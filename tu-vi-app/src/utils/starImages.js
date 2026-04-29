// Star name → image path mapping for 14 main stars (chính tinh)
// Images are in /images/stars/ directory (public folder)

export const STAR_IMAGES = {
  'Tử Vi': '/images/stars/tu_vi.png',
  'Thiên Cơ': '/images/stars/thien_co.png',
  'Thái Dương': '/images/stars/thai_duong.png',
  'Vũ Khúc': '/images/stars/vu_khuc.png',
  'Thiên Đồng': '/images/stars/thien_dong.png',
  'Liêm Trinh': '/images/stars/liem_trinh.png',
  'Thiên Phủ': '/images/stars/thien_phu.png',
  'Th�i �m': '/images/stars/thai_am.png',
  'Tham Lang': '/images/stars/tham_lang.png',
  'Cự Môn': '/images/stars/cu_mon.png',
  'Thiên Tướng': '/images/stars/thien_tuong.png',
  'Thiên Lương': '/images/stars/thien_luong.png',
  'Thất Sát': '/images/stars/that_sat.png',
  'Ph� Qu�n': '/images/stars/pha_quan.png',
};

// Fallback image for cung with no main star (Vô Chính Diệu)
export const VO_CHINH_DIEU_IMAGE = '/images/stars/vo_chinh_dieu.png';

// Star descriptions for hero cards
export const STAR_INFO = {
  'Tử Vi': { title: 'Đế Tinh', subtitle: 'Emperor Star', desc: 'Quyền lực, lãnh đạo, trung tâm vũ trụ' },
  'Thiên Cơ': { title: 'Trí Tinh', subtitle: 'Strategist Star', desc: 'Trí tuệ, mưu lược, biến hóa linh hoạt' },
  'Thái Dương': { title: 'Nhật Tinh', subtitle: 'Sun Star', desc: 'Quang minh, chính đại, bác ái' },
  'Vũ Khúc': { title: 'Kim Tinh', subtitle: 'Military Star', desc: 'Tài chính, quyết đoán, cương nghị' },
  'Thiên Đồng': { title: 'Phúc Tinh', subtitle: 'Harmony Star', desc: 'An nhàn, hưởng thụ, hòa hợp' },
  'Liêm Trinh': { title: 'Hỏa Tinh', subtitle: 'Integrity Star', desc: 'Liêm khiết, đam mê, quyền uy' },
  'Thiên Phủ': { title: 'Lộc Khố', subtitle: 'Treasury Star', desc: 'Giàu có, ổn định, tích lũy' },
  'Thái Âm': { title: 'Nguyệt Tinh', subtitle: 'Moon Star', desc: 'Nữ tính, dịu dàng, nghệ thuật' },
  'Tham Lang': { title: 'Đào Hoa Tinh', subtitle: 'Greedy Wolf', desc: 'Đa tài, biến hóa, quyến rũ' },
  'Cự Môn': { title: 'Ám Tinh', subtitle: 'Giant Gate', desc: 'Khẩu thiệt, bí ẩn, phân tích' },
  'Thiên Tướng': { title: 'Ấn Tinh', subtitle: 'Minister Star', desc: 'Công chính, phò tá, cân bằng' },
  'Thiên Lương': { title: 'Thọ Tinh', subtitle: 'Pillar Star', desc: 'Bảo hộ, trí tuệ, trường thọ' },
  'Thất Sát': { title: 'Sát Tinh', subtitle: 'Seven Killings', desc: 'Uy quyền, sát phạt, đột phá' },
  'Phá Quân': { title: 'Hao Tinh', subtitle: 'Destroyer Star', desc: 'Phá cũ lập mới, khai phá' },
};

/**
 * Get the primary main star (chính tinh) from a cung's star list.
 * Returns the first recognized main star name (cleaned of brightness labels).
 */
export const getMainStarFromCung = (saoChinh) => {
  if (!saoChinh || saoChinh.length === 0) return null;
  
  const mainStarNames = Object.keys(STAR_IMAGES);
  
  for (const sao of saoChinh) {
    const cleanName = sao.replace(/\s\(([MVĐHB])\)$/, '').replace(/^L\./, '');
    if (mainStarNames.includes(cleanName)) {
      return cleanName;
    }
  }
  return null;
};
