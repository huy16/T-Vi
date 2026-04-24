"""
VNI-Windows to Unicode Vietnamese converter.
Handles the specific VNI encoding found in Tử Vi Tổng Hợp PDF.
"""
import os, sys, re
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# VNI two-char sequences: base vowel + modifier → Unicode char
# Sorted by: vowel groups, then circumflex/breve/horn combos, then simple tones
VNI_PAIRS = {
    # ===== A/a + modifier =====
    # Circumflex â
    'aâ': 'â', 'Aâ': 'Â', 'AÂ': 'Â',
    'aá': 'ấ', 'Aá': 'Ấ', 'AÁ': 'Ấ',
    'aà': 'ầ', 'Aà': 'Ầ', 'AÀ': 'Ầ',
    'aã': 'ẫ', 'Aã': 'Ẫ', 'AÃ': 'Ẫ',
    'aå': 'ẩ', 'Aå': 'Ẩ', 'AÅ': 'Ẩ',
    'aä': 'ậ', 'Aä': 'Ậ', 'AÄ': 'Ậ',
    # Breve ă
    'aê': 'ă', 'Aê': 'Ă', 'AÊ': 'Ă',
    'aé': 'ắ', 'Aé': 'Ắ', 'AÉ': 'Ắ',
    'aè': 'ằ', 'Aè': 'Ằ', 'AÈ': 'Ằ',
    'aú': 'ẳ', 'Aú': 'Ẳ', 'AÚ': 'Ẳ',
    'aü': 'ẵ', 'Aü': 'Ẵ', 'AÜ': 'Ẵ',
    'aë': 'ặ', 'Aë': 'Ặ', 'AË': 'Ặ',
    # Simple tones on a
    'aù': 'á', 'Aù': 'Á', 'AÙ': 'Á',
    'aø': 'à', 'Aø': 'À', 'AØ': 'À',
    'aû': 'ả', 'Aû': 'Ả', 'AÛ': 'Ả',
    'aõ': 'ã', 'Aõ': 'Ã', 'AÕ': 'Ã',
    'aï': 'ạ', 'Aï': 'Ạ', 'AÏ': 'Ạ',

    # ===== E/e + modifier =====
    # Circumflex ê
    'eâ': 'ê', 'Eâ': 'Ê', 'EÂ': 'Ê',
    'eá': 'ế', 'Eá': 'Ế', 'EÁ': 'Ế',
    'eà': 'ề', 'Eà': 'Ề', 'EÀ': 'Ề',
    'eã': 'ễ', 'Eã': 'Ễ', 'EÃ': 'Ễ',
    'eå': 'ể', 'Eå': 'Ể', 'EÅ': 'Ể',
    'eä': 'ệ', 'Eä': 'Ệ', 'EÄ': 'Ệ',
    # Simple tones on e
    'eù': 'é', 'Eù': 'É', 'EÙ': 'É',
    'eø': 'è', 'Eø': 'È', 'EØ': 'È',
    'eû': 'ẻ', 'Eû': 'Ẻ', 'EÛ': 'Ẻ',
    'eõ': 'ẽ', 'Eõ': 'Ẽ', 'EÕ': 'Ẽ',
    'eï': 'ẹ', 'Eï': 'Ẹ', 'EÏ': 'Ẹ',

    # ===== O/o + modifier =====
    # Circumflex ô
    'oâ': 'ô', 'Oâ': 'Ô', 'OÂ': 'Ô',
    'oá': 'ố', 'Oá': 'Ố', 'OÁ': 'Ố',
    'oà': 'ồ', 'Oà': 'Ồ', 'OÀ': 'Ồ',
    'oã': 'ỗ', 'Oã': 'Ỗ', 'OÃ': 'Ỗ',
    'oå': 'ổ', 'Oå': 'Ổ', 'OÅ': 'Ổ',
    'oä': 'ộ', 'Oä': 'Ộ', 'OÄ': 'Ộ',
    # Simple tones on o
    'où': 'ó', 'Où': 'Ó', 'OÙ': 'Ó',
    'oø': 'ò', 'Oø': 'Ò', 'OØ': 'Ò',
    'oû': 'ỏ', 'Oû': 'Ỏ', 'OÛ': 'Ỏ',
    'oõ': 'õ', 'Oõ': 'Õ', 'OÕ': 'Õ',
    'oï': 'ọ', 'Oï': 'Ọ', 'OÏ': 'Ọ',

    # ===== U/u + modifier =====
    'uù': 'ú', 'Uù': 'Ú', 'UÙ': 'Ú',
    'uø': 'ù', 'Uø': 'Ù', 'UØ': 'Ù',
    'uû': 'ủ', 'Uû': 'Ủ', 'UÛ': 'Ủ',
    'uõ': 'ũ', 'Uõ': 'Ũ', 'UÕ': 'Ũ',
    'uï': 'ụ', 'Uï': 'Ụ', 'UÏ': 'Ụ',

    # ===== Y/y + modifier =====
    'yù': 'ý', 'Yù': 'Ý', 'YÙ': 'Ý',
    'yø': 'ỳ', 'Yø': 'Ỳ', 'YØ': 'Ỳ',
    'yû': 'ỷ', 'Yû': 'Ỷ', 'YÛ': 'Ỷ',
    'yõ': 'ỹ', 'Yõ': 'Ỹ', 'YÕ': 'Ỹ',
    'yï': 'ỵ', 'Yï': 'Ỵ', 'YÏ': 'Ỵ',

    # ===== I/i + modifier =====
    'ió': 'ĩ', 'Ió': 'Ĩ',
    'ò':  'ị',  # careful: standalone ò after i

    # ===== Horn vowels ô→ơ, ö→ư + tone =====
    # ơ tones
    'ôù': 'ớ', 'Ôù': 'Ớ', 'ÔÙ': 'Ớ',
    'ôø': 'ờ', 'Ôø': 'Ờ', 'ÔØ': 'Ờ',
    'ôû': 'ở', 'Ôû': 'Ở', 'ÔÛ': 'Ở',
    'ôõ': 'ỡ', 'Ôõ': 'Ỡ', 'ÔÕ': 'Ỡ',
    'ôï': 'ợ', 'Ôï': 'Ợ', 'ÔÏ': 'Ợ',
    # ư tones
    'öù': 'ứ', 'Öù': 'Ứ', 'ÖÙ': 'Ứ',
    'öø': 'ừ', 'Öø': 'Ừ', 'ÖØ': 'Ừ',
    'öû': 'ử', 'Öû': 'Ử', 'ÖÛ': 'Ử',
    'öõ': 'ữ', 'Öõ': 'Ữ', 'ÖÕ': 'Ữ',
    'öï': 'ự', 'Öï': 'Ự', 'ÖÏ': 'Ự',
}

# Single-char replacements (standalone)
VNI_SINGLES = {
    'ñ': 'đ', 'Ñ': 'Đ',
    'ô': 'ơ', 'Ô': 'Ơ',
    'ö': 'ư', 'Ö': 'Ư',
}

# Characters that are VNI modifiers (should not appear standalone after conversion)
VNI_MODIFIERS = set('ùøûõïâáàãåäêéèúüëó')
VNI_MODIFIERS_UPPER = set(c.upper() for c in VNI_MODIFIERS)


def vni_to_unicode(text):
    """Convert VNI-encoded text to Unicode Vietnamese."""
    result = []
    i = 0
    n = len(text)

    while i < n:
        # Try 2-char pair first
        if i + 1 < n:
            pair = text[i] + text[i+1]
            if pair in VNI_PAIRS:
                result.append(VNI_PAIRS[pair])
                i += 2
                continue

        # Try single-char replacement
        ch = text[i]
        if ch in VNI_SINGLES:
            result.append(VNI_SINGLES[ch])
        else:
            result.append(ch)
        i += 1

    return ''.join(result)


def convert_file(pdf_path, output_path):
    """Extract text from PDF and convert VNI to Unicode."""
    from pypdf import PdfReader

    print(f"  📖 Reading: {os.path.basename(pdf_path)}")
    reader = PdfReader(pdf_path)
    total = len(reader.pages)
    print(f"  📄 Pages: {total}")

    with open(output_path, 'w', encoding='utf-8') as out:
        out.write(f"# {os.path.basename(pdf_path)}\n")
        out.write(f"# VNI → Unicode | Pages: {total}\n\n")

        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if not text or len(text.strip()) < 10:
                continue

            # Remove URL headers
            lines = text.split('\n')
            lines = [l for l in lines if not l.strip().startswith('https://')]
            text = '\n'.join(lines)

            converted = vni_to_unicode(text)

            out.write(f"\n--- Trang {i+1} ---\n")
            out.write(converted)
            out.write("\n")

            if (i + 1) % 50 == 0:
                print(f"  ✅ {i+1}/{total} pages")

    size = os.path.getsize(output_path)
    print(f"  ✅ Done! {size:,} bytes → {output_path}")


def main():
    CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
    OUTPUT_DIR = os.path.join(CURRENT_DIR, "ocr_output")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    pdf = os.path.join(CURRENT_DIR, "1279-tu-vi-tong-hop-thuviensach.vn.pdf")
    out = os.path.join(OUTPUT_DIR, "tu-vi-tong-hop_clean.txt")

    print("🔄 VNI → Unicode Converter v2")
    convert_file(pdf, out)

    # Preview
    print("\n📋 Preview:")
    with open(out, encoding='utf-8') as f:
        content = f.read()
        idx = content.find('--- Trang 5 ---')
        if idx >= 0:
            print(content[idx:idx+600])


if __name__ == "__main__":
    main()
