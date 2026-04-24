"""
Ingest Tử Vi books into Supabase pgvector for RAG.
Steps:
1. Read clean text files
2. Split into semantic chunks (~500 tokens with overlap)
3. Generate embeddings via Gemini API
4. Insert into Supabase documents table
"""

import os
import sys
import json
import time
import re

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import httpx
from google import genai

# ===== CONFIGURATION =====
GEMINI_API_KEY = "AIzaSyCb6MHI6D5dx1_77qPyGarIeuq2ZopvTw4"
SUPABASE_URL = "https://kjaqoezvurgcsgbpsseu.supabase.co"
SUPABASE_KEY = "sb_publishable_XCZYRP-JBOZSDXGuda6Crg_5rkIBuGu"

EMBEDDING_MODEL = "gemini-embedding-001"
CHUNK_SIZE = 800       # target chars per chunk
CHUNK_OVERLAP = 150    # overlap between chunks
BATCH_SIZE = 5         # very small batch for safety
RATE_LIMIT_DELAY = 10  # long delay to avoid any 429 errors

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(CURRENT_DIR, "ocr_output")

# Initialize clients
gemini_client = genai.Client(api_key=GEMINI_API_KEY)
http_client = httpx.Client(timeout=30)

# Files to ingest
FILES = [
    {
        "path": os.path.join(OUTPUT_DIR, "tu-vi-dau-so-toan-thu_clean.txt"),
        "book": "Tử Vi Đẩu Số Toàn Thư - Hi Di Trần Đoàn",
    },
    {
        "path": os.path.join(OUTPUT_DIR, "tu-vi-nghiem-ly-toan-thu_clean.txt"),
        "book": "Tử Vi Nghiêm Lý Toàn Thư - Thiên Lương",
    },
    {
        "path": os.path.join(OUTPUT_DIR, "tu-vi-tong-hop_clean.txt"),
        "book": "Tử Vi Tổng Hợp - Nguyễn Phát Lộc",
    },
]


def split_into_chunks(text, book_name):
    """Split text into semantic chunks with metadata."""
    chunks = []
    
    # Split by page markers first
    pages = re.split(r'--- Trang (\d+) ---', text)
    
    current_page = 0
    for i in range(1, len(pages), 2):
        page_num = int(pages[i])
        page_text = pages[i + 1].strip() if i + 1 < len(pages) else ""
        
        if not page_text or len(page_text) < 20:
            continue
        
        # Split page into paragraphs
        paragraphs = [p.strip() for p in page_text.split('\n\n') if p.strip()]
        
        # Build chunks from paragraphs
        current_chunk = ""
        for para in paragraphs:
            # If adding this paragraph exceeds chunk size, save current chunk
            if len(current_chunk) + len(para) > CHUNK_SIZE and current_chunk:
                chunks.append({
                    "content": current_chunk.strip(),
                    "metadata": {
                        "book": book_name,
                        "page": page_num,
                        "chunk_index": len(chunks),
                    }
                })
                # Keep overlap from end of current chunk
                overlap_text = current_chunk[-CHUNK_OVERLAP:] if len(current_chunk) > CHUNK_OVERLAP else ""
                current_chunk = overlap_text + "\n" + para
            else:
                current_chunk += ("\n" if current_chunk else "") + para
        
        # Save remaining text
        if current_chunk.strip():
            chunks.append({
                "content": current_chunk.strip(),
                "metadata": {
                    "book": book_name,
                    "page": page_num,
                    "chunk_index": len(chunks),
                }
            })
    
    return chunks


def generate_embeddings(texts, max_retries=5):
    """Generate embeddings for a batch of texts using Gemini."""
    for attempt in range(max_retries):
        try:
            result = gemini_client.models.embed_content(
                model=EMBEDDING_MODEL,
                contents=texts,
            )
            return [e.values for e in result.embeddings]
        except Exception as e:
            err = str(e)
            if any(k in err for k in ["503", "429", "UNAVAILABLE", "RESOURCE_EXHAUSTED"]):
                wait = (attempt + 1) * 10
                print(f"    ⏳ API busy ({attempt+1}/{max_retries}), waiting {wait}s...")
                time.sleep(wait)
            else:
                print(f"  ⚠ Embedding error: {e}")
                return None
    return None


def insert_to_supabase(records):
    """Insert records into Supabase documents table."""
    data = []
    for rec in records:
        data.append({
            "content": rec["content"],
            "metadata": rec["metadata"],
            "embedding": rec["embedding"],
        })
    
    response = http_client.post(
        f"{SUPABASE_URL}/rest/v1/documents",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
        json=data,
    )
    
    if response.status_code not in [200, 201]:
        print(f"  ⚠ Supabase error: {response.status_code} - {response.text[:200]}")
        return False
    return True


def process_file(file_info):
    """Process a single text file: chunk → embed → insert."""
    path = file_info["path"]
    book = file_info["book"]
    
    if not os.path.exists(path):
        print(f"  ⚠ File not found: {path}")
        return
    
    print(f"\n{'='*60}")
    print(f"📖 {book}")
    print(f"{'='*60}")
    
    # Read and chunk
    with open(path, encoding='utf-8') as f:
        text = f.read()
    
    chunks = split_into_chunks(text, book)
    print(f"  📄 Chunks: {len(chunks)}")
    
    # Progress tracking
    progress_file = path + ".ingest_progress.json"
    start_idx = 0
    if os.path.exists(progress_file):
        with open(progress_file) as f:
            start_idx = json.load(f).get("last_idx", 0)
        print(f"  📌 Resuming from chunk {start_idx}")
    
    # Process in batches
    total_inserted = 0
    for i in range(start_idx, len(chunks), BATCH_SIZE):
        batch = chunks[i:i + BATCH_SIZE]
        texts = [c["content"] for c in batch]
        
        print(f"  🔄 Embedding chunks {i+1}-{i+len(batch)} / {len(chunks)}...")
        
        embeddings = generate_embeddings(texts)
        if embeddings is None:
            print(f"  ❌ Failed to generate embeddings, stopping.")
            break
        
        # Attach embeddings to chunks
        records = []
        for j, chunk in enumerate(batch):
            chunk["embedding"] = embeddings[j]
            records.append(chunk)
        
        # Insert to Supabase
        if insert_to_supabase(records):
            total_inserted += len(records)
        
        # Save progress
        with open(progress_file, 'w') as f:
            json.dump({"last_idx": i + len(batch)}, f)
        
        time.sleep(RATE_LIMIT_DELAY)
    
    # Clean up
    if os.path.exists(progress_file):
        os.remove(progress_file)
    
    print(f"  ✅ Inserted {total_inserted} chunks into Supabase")


def verify_data():
    """Check how many documents are in Supabase."""
    response = http_client.get(
        f"{SUPABASE_URL}/rest/v1/documents?select=id&limit=1",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Prefer": "count=exact",
        },
    )
    
    count = response.headers.get("content-range", "unknown")
    print(f"\n📊 Documents in Supabase: {count}")


def main():
    print("🚀 Tử Vi RAG Ingestion Pipeline")
    print(f"   Embedding model: {EMBEDDING_MODEL}")
    print(f"   Chunk size: {CHUNK_SIZE} chars, overlap: {CHUNK_OVERLAP}")
    print(f"   Supabase: {SUPABASE_URL}")
    
    for file_info in FILES:
        process_file(file_info)
    
    verify_data()
    print("\n🎉 Ingestion complete!")


if __name__ == "__main__":
    main()
