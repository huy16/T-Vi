import os
import subprocess
import sys

# Ensure PyMuPDF is installed
try:
    import fitz
except ImportError:
    print("Installing PyMuPDF...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyMuPDF"])
    import fitz

def extract_text_from_pdf(pdf_path, txt_path):
    print(f"Extracting {os.path.basename(pdf_path)}...")
    try:
        doc = fitz.open(pdf_path)
        with open(txt_path, 'w', encoding='utf-8') as txt_file:
            for page in doc:
                text = page.get_text()
                txt_file.write(text + "\n")
        print(f"Successfully extracted {os.path.basename(pdf_path)} to {os.path.basename(txt_path)}")
    except Exception as e:
        print(f"Error extracting {os.path.basename(pdf_path)}: {e}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(current_dir, "extracted_text")
    os.makedirs(output_dir, exist_ok=True)
    
    for filename in os.listdir(current_dir):
        if filename.lower().endswith(".pdf"):
            pdf_path = os.path.join(current_dir, filename)
            txt_filename = filename[:-4] + ".txt" # Remove .pdf, add .txt
            txt_path = os.path.join(output_dir, txt_filename)
            
            if not os.path.exists(txt_path):
                extract_text_from_pdf(pdf_path, txt_path)
            else:
                print(f"Already extracted: {txt_filename}")

print("Extraction process completed.")
