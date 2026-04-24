"""
Smart PDF Extraction Pipeline for Tử Vi books.
- PDFs with text layer: extract text + fix encoding via Gemini
- PDFs without text (scanned): OCR via Gemini Vision
"""

import os
import sys
import time
import base64
import json

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

try:
    import fitz
except ImportError:
    os.system(f"{sys.executable} -m pip install PyMuPDF")
    import fitz

from google import genai

# ===== CONFIGURATION =====
API_KEY = "AIzaSyCb6MHI6D5dx1_77qPyGarIeuq2ZopvTw4"
MODEL = "gemini-2.5-flash"
DPI = 200
PAGES_PER_BATCH_OCR = 2      # pages per API call for image OCR
PAGES_PER_BATCH_FIX = 10     # pages per API call for text fix (cheaper)
RATE_LIMIT_DELAY = 3

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(CURRENT_DIR, "ocr_output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

client = genai.Client(api_key=API_KEY)

# ===== PROMPTS =====
OCR_PROMPT = """Bạn là chuyên gia OCR tiếng Việt. Đọc và trích xuất TOÀN BỘ văn bản từ hình ảnh trang sách.
QUY TẮC:
1. Giữ nguyên cấu trúc: tiêu đề, đoạn văn, danh sách
2. Dấu tiếng Việt CHÍNH XÁC
3. Bỏ header/footer/số trang
4. CHỈ trả về text, KHÔNG giải thích
Trích xuất:"""

FIX_ENCODING_PROMPT = """Văn bản dưới đây được trích xuất từ PDF sách Tử Vi tiếng Việt nhưng BỊ LỖI ENCODING (font VNI/TCVN cũ).
Hãy SỬA LẠI thành tiếng Việt Unicode đúng dấu.

QUY TẮC:
1. Chuyển đổi chính xác từng chữ, giữ nguyên ý nghĩa
2. Giữ nguyên cấu trúc đoạn văn, xuống dòng
3. Thuật ngữ Tử Vi phải đúng: Tử Vi, Thiên Cơ, Thái Dương, Vũ Khúc, Thiên Đồng, Liêm Trinh, Thiên Phủ, Thái Âm, Tham Lang, Cự Môn, Thiên Tướng, Thiên Lương, Thất Sát, Phá Quân
4. CHỈ trả về text đã sửa, KHÔNG giải thích

Văn bản cần sửa:
"""


def api_call_with_retry(contents, max_retries=5):
    """Make Gemini API call with retry logic."""
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model=MODEL,
                contents=contents,
                config={"temperature": 0.1, "max_output_tokens": 8192}
            )
            text = response.text
            return text if text else ""
        except Exception as e:
            err = str(e)
            if any(k in err for k in ["503", "429", "UNAVAILABLE", "RESOURCE_EXHAUSTED"]):
                wait = (attempt + 1) * 10
                print(f"    ⏳ API busy ({attempt+1}/{max_retries}), waiting {wait}s...")
                time.sleep(wait)
            else:
                print(f"  ⚠ API Error: {e}")
                return f"[ERROR: {e}]\n"
    return "[FAILED after retries]\n"


def check_text_quality(doc, sample_pages=5):
    """Check if PDF has usable text layer."""
    text_pages = 0
    total_chars = 0
    for i in range(min(sample_pages, len(doc))):
        text = doc[i].get_text().strip()
        if len(text) > 50:
            text_pages += 1
            total_chars += len(text)
    
    has_text = text_pages >= sample_pages * 0.5
    return has_text, total_chars


def process_pdf_with_text_fix(pdf_path, output_path):
    """Extract text from PDF with text layer, fix encoding via Gemini."""
    doc = fitz.open(pdf_path)
    total = len(doc)
    print(f"  📝 Mode: TEXT FIX (has text layer, fixing encoding)")
    print(f"  📄 Total pages: {total}")
    
    # Load progress
    progress_file = output_path + ".progress.json"
    start_page = 0
    if os.path.exists(progress_file):
        with open(progress_file) as f:
            start_page = json.load(f).get("last_page", 0)
        print(f"  📌 Resuming from page {start_page + 1}")
    
    mode = 'a' if start_page > 0 else 'w'
    with open(output_path, mode, encoding='utf-8') as out:
        if start_page == 0:
            out.write(f"# {os.path.basename(pdf_path)}\n# Extracted + Encoding Fixed\n\n")
        
        batch_text = ""
        batch_start = start_page
        
        for page_num in range(start_page, total):
            text = doc[page_num].get_text().strip()
            if len(text) < 10:
                continue
            
            # Remove common header/footer patterns
            lines = text.split('\n')
            lines = [l for l in lines if not l.strip().startswith('https://') and len(l.strip()) > 0]
            text = '\n'.join(lines)
            
            batch_text += f"\n--- Trang {page_num + 1} ---\n{text}\n"
            
            if (page_num - batch_start + 1) >= PAGES_PER_BATCH_FIX or page_num == total - 1:
                if batch_text.strip():
                    print(f"  🔧 Fixing pages {batch_start+1}-{page_num+1}... ({page_num+1}/{total})")
                    fixed = api_call_with_retry(FIX_ENCODING_PROMPT + batch_text)
                    out.write(fixed + "\n\n")
                    out.flush()
                
                # Save progress
                with open(progress_file, 'w') as pf:
                    json.dump({"last_page": page_num + 1}, pf)
                
                batch_text = ""
                batch_start = page_num + 1
                time.sleep(RATE_LIMIT_DELAY)
    
    doc.close()
    if os.path.exists(progress_file):
        os.remove(progress_file)


def process_pdf_with_ocr(pdf_path, output_path):
    """OCR scanned PDF pages via Gemini Vision."""
    doc = fitz.open(pdf_path)
    total = len(doc)
    print(f"  📷 Mode: IMAGE OCR (scanned PDF)")
    print(f"  📄 Total pages: {total}")
    
    progress_file = output_path + ".progress.json"
    start_page = 0
    if os.path.exists(progress_file):
        with open(progress_file) as f:
            start_page = json.load(f).get("last_page", 0)
        print(f"  📌 Resuming from page {start_page + 1}")
    
    mode = 'a' if start_page > 0 else 'w'
    with open(output_path, mode, encoding='utf-8') as out:
        if start_page == 0:
            out.write(f"# {os.path.basename(pdf_path)}\n# OCR by Gemini Vision\n\n")
        
        batch_images = []
        batch_pages = []
        
        for page_num in range(start_page, total):
            page = doc[page_num]
            
            # Skip blank pages
            if len(page.get_text().strip()) < 5 and len(page.get_images()) == 0:
                continue
            
            mat = fitz.Matrix(DPI / 72, DPI / 72)
            pix = page.get_pixmap(matrix=mat)
            batch_images.append(pix.tobytes("png"))
            batch_pages.append(page_num + 1)
            
            if len(batch_images) >= PAGES_PER_BATCH_OCR or page_num == total - 1:
                print(f"  🔍 OCR pages {batch_pages}... ({page_num+1}/{total})")
                
                contents = [OCR_PROMPT]
                for i, img in enumerate(batch_images):
                    contents.append(f"\n--- TRANG {batch_pages[i]} ---\n")
                    contents.append({"inline_data": {"mime_type": "image/png", "data": base64.b64encode(img).decode()}})
                
                result = api_call_with_retry(contents)
                out.write(result + "\n\n")
                out.flush()
                
                with open(progress_file, 'w') as pf:
                    json.dump({"last_page": page_num + 1}, pf)
                
                batch_images = []
                batch_pages = []
                time.sleep(RATE_LIMIT_DELAY)
    
    doc.close()
    if os.path.exists(progress_file):
        os.remove(progress_file)


def process_pdf(pdf_path):
    """Auto-detect and process a PDF."""
    filename = os.path.basename(pdf_path)
    output_path = os.path.join(OUTPUT_DIR, os.path.splitext(filename)[0] + "_clean.txt")
    
    if os.path.exists(output_path) and not os.path.exists(output_path + ".progress.json"):
        size = os.path.getsize(output_path)
        if size > 1000:
            print(f"\n  ✅ Already done: {filename} ({size:,} bytes)")
            return
    
    print(f"\n{'='*60}")
    print(f"📖 {filename}")
    print(f"{'='*60}")
    
    doc = fitz.open(pdf_path)
    has_text, char_count = check_text_quality(doc)
    doc.close()
    
    if has_text:
        print(f"  📊 Text detected: ~{char_count:,} chars in sample")
        process_pdf_with_text_fix(pdf_path, output_path)
    else:
        print(f"  📊 No text layer detected → using OCR")
        process_pdf_with_ocr(pdf_path, output_path)
    
    print(f"  ✅ Done! → {output_path}")


def main():
    pdfs = [
        "1279-tu-vi-tong-hop-thuviensach.vn.pdf",
        "Tu-Vi-Nghiem-Ly-Toan-Thu-–-Thien-Luong.pdf",
        "nhasachmienphi-tu-vi-dau-so-toan-thu.pdf",
        "Tử vi khảo luận - TS Hoàng Thường, TS Hàm Chương.pdf",
        "teachvn-tu-vi-tinh-dien-pdf.pdf",
    ]
    
    print("🚀 Tử Vi Smart PDF Extraction Pipeline")
    print(f"   Model: {MODEL}")
    print(f"   Output: {OUTPUT_DIR}\n")
    
    for name in pdfs:
        path = os.path.join(CURRENT_DIR, name)
        if os.path.exists(path):
            process_pdf(path)
        else:
            print(f"  ⚠ Not found: {name}")
    
    print("\n🎉 All done!")


if __name__ == "__main__":
    main()
