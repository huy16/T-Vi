// tuviEngine.js - Engine logic cơ bản cho ứng dụng phân tích Tử Vi
import { solarToLunar } from './lunarCalendar.js';

const CHI_ARRAY = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const THIEN_CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];

// Bảng Tứ Hoá chuẩn: [Hoá Lộc, Hoá Quyền, Hoá Khoa, Hoá Kỵ] theo Can
const TU_HOA_TABLE = [
  ['Liêm Trinh', 'Phá Quân', 'Vũ Khúc', 'Thái Dương'],   // Giáp
  ['Thiên Cơ', 'Thiên Lương', 'Tử Vi', 'Thái Âm'],       // Ất
  ['Thiên Đồng', 'Thiên Cơ', 'Văn Xương', 'Liêm Trinh'], // Bính
  ['Thái Âm', 'Thiên Đồng', 'Thiên Cơ', 'Cự Môn'],       // Đinh
  ['Tham Lang', 'Thái Âm', 'Hữu Bật', 'Thiên Cơ'],       // Mậu
  ['Vũ Khúc', 'Tham Lang', 'Thiên Lương', 'Văn Khúc'],    // Kỷ
  ['Thái Dương', 'Vũ Khúc', 'Thái Âm', 'Thiên Đồng'],    // Canh
  ['Cự Môn', 'Thái Dương', 'Văn Khúc', 'Văn Xương'],     // Tân
  ['Thiên Lương', 'Tử Vi', 'Tả Phù', 'Vũ Khúc'],         // Nhâm
  ['Phá Quân', 'Cự Môn', 'Thái Âm', 'Tham Lang'],         // Quý
];

const TRIET_MAP = [ [8, 9], [6, 7], [4, 5], [2, 3], [0, 1] ];


// ===== HỆ THỐNG NGŨ HÀNH =====
// Ngũ Hành của 12 Địa Chi (Cung)
const CHI_NGU_HANH = {
  'Tý': 'Thủy', 'Sửu': 'Thổ', 'Dần': 'Mộc', 'Mão': 'Mộc',
  'Thìn': 'Thổ', 'Tỵ': 'Hỏa', 'Ngọ': 'Hỏa', 'Mùi': 'Thổ',
  'Thân': 'Kim', 'Dậu': 'Kim', 'Tuất': 'Thổ', 'Hợi': 'Thủy'
};

// Ngũ Hành của các Sao (Chính & Phụ)
const SAO_NGU_HANH = {
  // 14 Chính Tinh
  'Tử Vi': 'Thổ', 'Thiên Cơ': 'Mộc', 'Thái Dương': 'Hỏa', 'Vũ Khúc': 'Kim',
  'Thiên Đồng': 'Thủy', 'Liêm Trinh': 'Hỏa',
  'Thiên Phủ': 'Thổ', 'Thái Âm': 'Thủy', 'Tham Lang': 'Thủy', 'Cự Môn': 'Thủy',
  'Thiên Tướng': 'Thủy', 'Thiên Lương': 'Mộc', 'Thất Sát': 'Kim', 'Phá Quân': 'Thủy',

  // Lục Cát Tinh
  'Thiên Khôi': 'Hỏa', 'Thiên Việt': 'Hỏa', 
  'Tả Phù': 'Thổ', 'Hữu Bật': 'Thổ',
  'Văn Xương': 'Kim', 'Văn Khúc': 'Thủy',

  // Lục Sát Tinh
  'Địa Không': 'Hỏa', 'Địa Kiếp': 'Hỏa',
  'Kình Dương': 'Kim', 'Đà La': 'Kim',
  'Hỏa Tinh': 'Hỏa', 'Linh Tinh': 'Hỏa',

  // Tứ Hóa
  'Hóa Lộc': 'Mộc', 'Hóa Quyền': 'Thủy', 'Hóa Khoa': 'Thủy', 'Hóa Kỵ': 'Thủy',

  // Vòng Lộc Tồn
  'Lộc Tồn': 'Thổ', 'Bác Sĩ': 'Thủy', 'Lực Sĩ': 'Hỏa', 'Thanh Long': 'Thủy',
  'Tiểu Hao': 'Hỏa', 'Tướng Quân': 'Mộc', 'Tấu Thư': 'Kim', 'Phi Liêm': 'Hỏa',
  'Hỷ Thần': 'Hỏa', 'Bệnh Phù': 'Thổ', 'Đại Hao': 'Hỏa', 'Phục Binh': 'Hỏa', 'Quan Phủ': 'Hỏa',

  // Vòng Thái Tuế
  'Thái Tuế': 'Hỏa', 'Thiên Không': 'Hỏa', 'Thiếu Dương': 'Hỏa', 'Tang Môn': 'Mộc', 
  'Thiếu Âm': 'Thủy', 'Quan Phù': 'Hỏa', 'Tử Phù': 'Kim', 'Tuế Phá': 'Hỏa', 
  'Long Đức': 'Thủy', 'Bạch Hổ': 'Kim', 'Phúc Đức': 'Thổ', 'Điếu Khách': 'Hỏa', 'Trực Phù': 'Hỏa',

  // Khác
  'Đào Hoa': 'Mộc', 'Hồng Loan': 'Thủy', 'Thiên Hỷ': 'Thủy',
  'Thiên Mã': 'Hỏa', 'Thiên Khốc': 'Thủy', 'Thiên Hư': 'Thủy',
  'Long Trì': 'Thủy', 'Phượng Các': 'Thổ', 'Giải Thần': 'Thổ',
  'Cô Thần': 'Thổ', 'Quả Tú': 'Thổ', 'Hoa Cái': 'Kim', 'Kiếp Sát': 'Hỏa', 'Phá Toái': 'Hỏa',
  'Ân Quang': 'Mộc', 'Thiên Quý': 'Thổ', 'Tam Thai': 'Thủy', 'Bát Tọa': 'Thổ',
  'Thiên Riêu': 'Thủy', 'Thiên Y': 'Thủy', 'Thiên Hình': 'Hỏa', 'Thai Phụ': 'Thổ', 'Phong Cáo': 'Thổ'
};

const LEGEND_DATA = [
  { label: 'Kim', color: '#7F8C8D' },
  { label: 'Mộc', color: '#27AE60' },
  { label: 'Thủy', color: '#000000' },
  { label: 'Hỏa', color: '#E74C3C' },
  { label: 'Thổ', color: '#F39C12' }
];

// Màu CSS tương ứng Ngũ Hành
const HANH_TO_COLOR_CLASS = {
  'Kim': 'hanh-kim', 'Mộc': 'hanh-moc', 'Thủy': 'hanh-thuy', 'Hỏa': 'hanh-hoa', 'Thổ': 'hanh-tho'
};

// Tương sinh: Kim->Thủy->Mộc->Hỏa->Thổ->Kim
// Tương khắc: Kim->Mộc->Thổ->Thủy->Hỏa->Kim
const NGU_HANH_SINH = { 'Kim': 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim' };
const NGU_HANH_KHAC = { 'Kim': 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim' };

export const phanTichNguHanh = (hanhMenh, hanhSao) => {
  if (!hanhMenh || !hanhSao) return { type: 'none', text: 'Không xác định.' };
  if (hanhMenh === hanhSao) return { type: 'dong-hanh', text: `Đồng hành (${hanhMenh}): Rất tốt, hỗ trợ lẫn nhau.` };
  if (NGU_HANH_SINH[hanhSao] === hanhMenh) return { type: 'tuong-sinh', text: `Tương sinh: Tuyệt vời! ${hanhSao} nuôi dưỡng mệnh ${hanhMenh}.` };
  if (NGU_HANH_SINH[hanhMenh] === hanhSao) return { type: 'sinh-xuat', text: `Sinh xuất: Mệnh ${hanhMenh} nuôi sao ${hanhSao}, hơi hao tổn năng lượng.` };
  if (NGU_HANH_KHAC[hanhMenh] === hanhSao) return { type: 'che-khac', text: `Chế khắc: Tốt, bạn kiểm soát được năng lượng sao ${hanhSao}.` };
  if (NGU_HANH_KHAC[hanhSao] === hanhMenh) return { type: 'tuong-khac', text: `Tương khắc: Cần thận trọng! Sao ${hanhSao} gây áp lực lên mệnh ${hanhMenh}.` };
  return { type: 'binh-thuong', text: 'Quan hệ bình thường.' };
};

export { SAO_NGU_HANH, CHI_NGU_HANH, HANH_TO_COLOR_CLASS, LEGEND_DATA };

// Modulo chuẩn xử lý số âm: (a % b + b) % b
const safeMod = (n, m) => ((n % m) + m) % m;

// Helper chức năng tính toán Can / Chi
const getCanChiYearIndex = (year) => {
  // Chu kỳ Thiên Can (10) và Địa Chi (12). Tính từ năm 1900 (Canh Tý: Can=6, Chi=0)
  const canIndex = safeMod(year - 1900 + 6, 10);
  const chiIndex = safeMod(year - 1900, 12);
  return { canIndex, chiIndex };
};

// Tìm cục số (Cục) - Nạp Âm 60 Hoa Giáp chuẩn
// Thủy=2, Mộc=3, Kim=4, Thổ=5, Hỏa=6
const CUC_NAMES = { 2: 'Thủy Nhị Cục', 3: 'Mộc Tam Cục', 4: 'Kim Tứ Cục', 5: 'Thổ Ngũ Cục', 6: 'Hoả Lục Cục' };

// Bảng Nạp Âm 60 Hoa Giáp → Cục. Key = 'canCungMenh_chiCungMenh'
const NAP_AM_CUC = {
  '0_0':4,'1_1':4, '2_2':6,'3_3':6, '4_4':3,'5_5':3, '6_6':5,'7_7':5, '8_8':4,'9_9':4,
  '0_10':6,'1_11':6, '2_0':2,'3_1':2, '4_2':5,'5_3':5, '6_4':4,'7_5':4, '8_6':3,'9_7':3,
  '0_8':2,'1_9':2, '2_10':5,'3_11':5, '4_0':6,'5_1':6, '6_2':3,'7_3':3, '8_4':2,'9_5':2,
  '0_6':4,'1_7':4, '2_8':6,'3_9':6, '4_10':3,'5_11':3, '6_0':5,'7_1':5, '8_2':4,'9_3':4,
  '0_4':6,'1_5':6, '2_6':2,'3_7':2, '4_8':5,'5_9':5, '6_10':4,'7_11':4, '8_0':3,'9_1':3,
  '0_2':2,'1_3':2, '2_4':5,'3_5':5, '4_6':6,'5_7':6, '6_8':3,'7_9':3, '8_10':2,'9_11':2,
};

// Can tháng Giêng (Dần) theo nhóm Can Năm: Giáp/Kỷ→Bính, Ất/Canh→Mậu, Bính/Tân→Canh, Đinh/Nhâm→Nhâm, Mậu/Quý→Giáp
const CAN_THANG_GIENG = [2, 4, 6, 8, 0];

const getBanMenh = (year) => {
  const canMap = { "Giáp": 1, "Ất": 1, "Bính": 2, "Đinh": 2, "Mậu": 3, "Kỷ": 3, "Canh": 4, "Tân": 4, "Nhâm": 5, "Quý": 5 };
  const chiMap = { "Tý": 0, "Sửu": 0, "Ngọ": 0, "Mùi": 0, "Dần": 1, "Mão": 1, "Thân": 1, "Dậu": 1, "Thìn": 2, "Tỵ": 2, "Tuất": 2, "Hợi": 2 };
  const elementMap = { 1: "Kim", 2: "Thủy", 3: "Hỏa", 4: "Thổ", 5: "Mộc" };

  const { canIndex, chiIndex } = getCanChiYearIndex(year);
  const val = canMap[THIEN_CAN[canIndex]] + chiMap[CHI_ARRAY[chiIndex]];
  const finalVal = val > 5 ? val - 5 : val;
  return elementMap[finalVal] || "Kim";
};

const getCuc = (yearCanIndex, menhChiIndex) => {
  // 1. Tìm Can tháng Giêng (Dần) theo Ngũ Hổ Độn
  let canThangGieng = CAN_THANG_GIENG[yearCanIndex % 5];
  // 2. Tìm Can Cung Mệnh: từ Dần tiến đến cung Mệnh
  let khoangCach = (menhChiIndex - 2 + 12) % 12;
  let canCungMenh = (canThangGieng + khoangCach) % 10;
  // 3. Tra Nạp Âm → Cục
  let key = `${canCungMenh}_${menhChiIndex}`;
  return NAP_AM_CUC[key] || 4;
};

export const lapLaSo = (userInfo) => {
  let { gender, day, month, year, hour } = userInfo;
  
  // 0. Nếu có ngày Dương Lịch gốc, chuyển đổi sang Âm Lịch ngay trong engine
  if (userInfo.solarDay && userInfo.solarMonth && userInfo.solarYear) {
    const lunar = solarToLunar(userInfo.solarDay, userInfo.solarMonth, userInfo.solarYear);
    day = lunar.lunarDay;
    month = lunar.lunarMonth;
    year = lunar.lunarYear;
    console.log(`[Engine] Đã chuyển DL ${userInfo.solarDay}/${userInfo.solarMonth}/${userInfo.solarYear} → ÂL ${day}/${month}/${year}`);
  }
  
  // 1. Chuyển đổi giờ sinh sang index (Tý=1, Sửu=2, ..., Hợi=12)
  const hourMapping = {
    'Ti': 1, 'Suu': 2, 'Dan': 3, 'Mao': 4, 'Thin': 5, 'Ti2': 6,
    'Ngo': 7, 'Mui': 8, 'Than': 9, 'Dau': 10, 'Tuat': 11, 'Hoi': 12
  };
  const hourIndex = hourMapping[hour] || 1; 

  const { canIndex, chiIndex: yearChiIndex } = getCanChiYearIndex(year);
  console.log(`[Engine Debug] Birth Year: ${year}, Can Index: ${canIndex}, Year Chi Index: ${yearChiIndex}`);

  // 2. Tìm vị trí Cung Mệnh và Cung Thân
  let monthPos = 2 + (month - 1); 
  let menhPos = safeMod(monthPos - (hourIndex - 1), 12);
  let thanPos = safeMod(monthPos + (hourIndex - 1), 12);

  let cuc = getCuc(canIndex, menhPos);

  // Tính vị trí Tử Vi: f(Ngày sinh, Cục) - Thuật toán Zigzag chuẩn
  // 1. Tìm x nhỏ nhất sao cho (Ngày + x) chia hết cho Cục (0 <= x < Cục)
  let x = 0;
  if (day % cuc === 0) {
    x = 0;
  } else {
    x = cuc - (day % cuc);
  }
  let q = (day + x) / cuc;
  let result;
  if (x % 2 === 0) {
    // x chẵn: Tiến x bước từ thương q
    result = q + x;
  } else {
    // x lẻ: Lùi x bước từ thương q
    result = q - x;
  }
  // Vị trí Tử Vi khởi từ Dần (index 2), result là số cung (1-based)
  let tuviPos = safeMod(2 + result - 1, 12);

  // 3. Khởi tạo 12 Cung
  let board = {};
  CHI_ARRAY.forEach((chi) => {
    board[chi] = { 
      chi, 
      canChi: "",
      nguHanh: "",
      tenCung: "", 
      saoChinh: [], 
      saoTot: [], 
      saoXau: [],
      daiHan: "",
      tieuHan: "",
      daiVanName: "",
      trangSinh: "",
      luuNien: ""
    };
  });

  const CUNG_NAMES = [
    "Mệnh", "Phụ Mẫu", "Phúc Đức", "Điền Trạch", "Quan Lộc", "Nô Bộc",
    "Thiên Di", "Tật Ách", "Tài Bạch", "Tử Tức", "Phu Thê", "Huynh Đệ"
  ];



  let canThangGieng = CAN_THANG_GIENG[canIndex % 5]; // Can của tháng Dần

  // Xác định Âm/Dương của người xem
  const isDuongNam = (canIndex % 2 === 0); // Giáp(0), Bính(2)... là Dương
  console.log(`Nam/Nữ: ${gender}, canIndex: ${canIndex}, isDuongNam: ${isDuongNam}`);

  let isThuan = true;
  let amDuongName = "";
  if (gender === 'Nam') {
    isThuan = isDuongNam; // Dương Nam đi thuận, Âm Nam đi nghịch
    amDuongName = isDuongNam ? "Dương Nam" : "Âm Nam";
  } else {
    isThuan = !isDuongNam; // Âm Nữ đi thuận, Dương Nữ đi nghịch
    amDuongName = isDuongNam ? "Dương Nữ" : "Âm Nữ";
  }
  userInfo.amDuong = amDuongName;
  userInfo.cucName = CUC_NAMES[cuc] || `Cục ${cuc}`;
  
  // Các thông tin mở rộng trên Thiên Bàn
  userInfo.canChiYear = `${THIEN_CAN[canIndex]} ${CHI_ARRAY[yearChiIndex]}`;

  // Can Chi Tháng: Can tháng Giêng + (tháng - 1), Chi tháng = Dần + (tháng - 1)
  let monthCanIdx = (CAN_THANG_GIENG[canIndex % 5] + (month - 1)) % 10;
  let monthChiIdx = safeMod(2 + (month - 1), 12);
  const solarMonthDisplay = userInfo.solarMonth ? ` (DL: ${userInfo.solarMonth})` : '';
  userInfo.canChiMonth = `${month}${solarMonthDisplay} ${THIEN_CAN[monthCanIdx]} ${CHI_ARRAY[monthChiIdx]}`;

  // Can Chi Ngày: Tính theo công thức Julian Day Number
  const solarDay = userInfo.solarDay || day;
  const solarMonth = userInfo.solarMonth || month;
  const solarYear = userInfo.solarYear || year;
  const a = Math.floor((14 - solarMonth) / 12);
  const y_jdn = solarYear + 4800 - a;
  const m_jdn = solarMonth + 12 * a - 3;
  const jdn = solarDay + Math.floor((153 * m_jdn + 2) / 5) + 365 * y_jdn + Math.floor(y_jdn / 4) - Math.floor(y_jdn / 100) + Math.floor(y_jdn / 400) - 32045;
  const dayCanIdx = (jdn + 9) % 10;
  const dayChiIdx = (jdn + 1) % 12;
  const solarDayDisplay = userInfo.solarDay ? ` (DL: ${userInfo.solarDay})` : '';
  userInfo.canChiDay = `${day}${solarDayDisplay} ${THIEN_CAN[dayCanIdx]} ${CHI_ARRAY[dayChiIdx]}`;

  // Can Chi Giờ: Can giờ Tý = 2 * (Can Ngày % 5), Chi giờ = hourIndex - 1
  const hourChiIdx = hourIndex - 1; // Tý=0, Sửu=1...
  const canGioTy = (2 * (dayCanIdx % 5)) % 10;
  const hourCanIdx = (canGioTy + hourChiIdx) % 10;
  const CHI_HOUR_NAMES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  userInfo.hourDisplay = `${CHI_HOUR_NAMES[hourChiIdx]}`;
  userInfo.canChiHour = `${THIEN_CAN[hourCanIdx]} ${CHI_HOUR_NAMES[hourChiIdx]}`;

  // Năm xem (Mặc định là năm hiện tại nếu không có)
  const currentYear = new Date().getFullYear();
  const namXem = userInfo.namXem || currentYear;
  const { canIndex: xemCanIdx, chiIndex: xemChiIdx } = getCanChiYearIndex(namXem);
  const tuoi = namXem - solarYear + 1;
  userInfo.namXemStr = `${THIEN_CAN[xemCanIdx]} ${CHI_ARRAY[xemChiIdx]} (${namXem}), ${tuoi} tuổi`;

  const banMenh = getBanMenh(year);
  userInfo.banMenhFull = `${banMenh} - ${userInfo.cucName}`;
  
  // Tính Chủ Mệnh dựa trên Địa Chi của cung Mệnh
  const CHU_MENH_MAP = { 
    0: 'Tham Lang', 1: 'Cự Môn', 2: 'Lộc Tồn', 3: 'Văn Khúc', 
    4: 'Liêm Trinh', 5: 'Vũ Khúc', 6: 'Phá Quân', 7: 'Vũ Khúc', 
    8: 'Liêm Trinh', 9: 'Văn Khúc', 10: 'Lộc Tồn', 11: 'Cự Môn' 
  };
  // Tính Chủ Thân dựa trên Địa Chi của cung Mệnh
  const CHU_THAN_MAP = { 
    0: 'Linh Tinh', 6: 'Linh Tinh',
    1: 'Thiên Tướng', 7: 'Thiên Tướng',
    2: 'Thiên Lương', 8: 'Thiên Lương',
    3: 'Thiên Đồng', 9: 'Thiên Đồng',
    4: 'Văn Xương', 10: 'Văn Xương',
    5: 'Hỏa Tinh', 11: 'Hỏa Tinh'
  };
  
  userInfo.chuMenh = CHU_MENH_MAP[menhPos] || 'Tham Lang';
  userInfo.chuThan = CHU_THAN_MAP[menhPos] || 'Văn Xương';
  
  // Tính Lai Nhân Cung (Cung có Thiên Can trùng với Can năm sinh)
  let laiNhanCung = "Mệnh";
  for (const chi of CHI_ARRAY) {
    const khoangCachTuDan = safeMod(CHI_ARRAY.indexOf(chi) - 2, 12); 
    const canCungIndex = safeMod(canThangGieng + khoangCachTuDan, 10);
    if (canCungIndex === canIndex) {
      // Tìm tên cung thực tế tại vị trí chi này
      for (let i = 0; i < 12; i++) {
        if (safeMod(menhPos + i, 12) === CHI_ARRAY.indexOf(chi)) {
          laiNhanCung = CUNG_NAMES[i];
          break;
        }
      }
    }
  }
  userInfo.laiNhanCung = laiNhanCung;
  
  // Cân lượng cần bảng tra cứu phức tạp, tạm thời để trống hoặc tính sơ bộ
  userInfo.canLuong = `Đang cập nhật`;

  const DV_SHORT_NAMES = ['MỆNH','PHỤ','PHÚC','ĐIỀN','QUAN','NÔ','DI','TẬT','TÀI','TỬ','PHỐI','HUYNH'];

  for (let i = 0; i < 12; i++) {
    // Vị trí cung trên bàn cờ (Tý=0..Hợi=11)
    // CUNG_NAMES được xếp theo chiều thuận (Mệnh, Phụ, Phúc). Do đó phải chạy thuận (+i) 
    // để đảm bảo Huynh Đệ (index 11) sẽ nằm ở mệnh - 1 (tức đi nghịch).
    let pos = safeMod(menhPos + i, 12);
    
    // Tên cung
    let tenCung = CUNG_NAMES[i];
    if (pos === thanPos && i !== 0) {
      tenCung += " <Thân>";
    }
    board[CHI_ARRAY[pos]].tenCung = tenCung;
    
    // Tính Thiên Can của Cung
    let khoangCachTuDan = safeMod(pos - 2, 12); 
    let canCungIndex = safeMod(canThangGieng + khoangCachTuDan, 10);
    board[CHI_ARRAY[pos]].canChi = `${THIEN_CAN[canCungIndex].substring(0,1)}.${CHI_ARRAY[pos]}`;
    
    board[CHI_ARRAY[pos]].nguHanh = CHI_NGU_HANH[CHI_ARRAY[pos]];
    board[CHI_ARRAY[pos]].trangSinh = "";
    // LN (Lưu Niên) và ĐV sẽ lưu vị trí sau
  }

  // 3.1 Tính Tiểu Hạn và Nguyệt Hạn
  const { chiIndex: birthChiIndex } = getCanChiYearIndex(year);
  const tuoiTa = namXem - year + 1;
  const isNam = gender === "Nam";

  // Nhóm tam hợp để xác định điểm khởi Tiểu Hạn
  // Dần (2), Ngọ (6), Tuất (10) -> Thìn (4)
  // Thân (8), Tý (0), Thìn (4) -> Tuất (10)
  // Tỵ (5), Dậu (9), Sửu (1) -> Mùi (7)
  // Hợi (11), Mão (3), Mùi (7) -> Sửu (1)
  const TIEU_HAN_START_MAP = {
    8: 10, 0: 10, 4: 10,
    2: 4, 6: 4, 10: 4,
    5: 7, 9: 7, 1: 7,
    11: 1, 3: 1, 7: 1
  };
  const tieuHanStart = TIEU_HAN_START_MAP[birthChiIndex];
  
  // Vị trí Tiểu Hạn của năm hiện tại
  const tieuHanPos = isNam ? safeMod(tieuHanStart + (tuoiTa - 1), 12) : safeMod(tieuHanStart - (tuoiTa - 1), 12);
  
  // Vị trí Tháng 1 (Nguyệt Hạn)
  // Khởi từ Tiểu Hạn, tính nghịch đến tháng sinh, rồi tính thuận đến giờ sinh
  const month1Pos = safeMod(tieuHanPos - (month - 1) + (hourIndex - 1), 12);

  // Gán nhãn Tháng hạn (Th.1 - Th.12) chạy thuận từ month1Pos
  for (let m = 1; m <= 12; m++) {
    const targetPos = safeMod(month1Pos + (m - 1), 12);
    board[CHI_ARRAY[targetPos]].tieuHan = `Th.${m}`;
  }

  // 3.1.2 ĐV (Đại Vận / Lưu Cung Đại Hạn):
  let currentDaiHanPos = menhPos;
  
  for (let i = 0; i < 12; i++) {
    // Đại Hạn chạy theo isThuan
    let checkPos = isThuan ? safeMod(menhPos + i, 12) : safeMod(menhPos - i, 12);
    let startAge = cuc + (i * 10);
    if (tuoiTa >= startAge && tuoiTa < startAge + 10) {
      currentDaiHanPos = checkPos;
      break;
    }
  }

  // An nhãn ĐV từ cung chứa Đại Hạn hiện tại 
  // DV_SHORT_NAMES xếp theo chiều thuận nên phải dùng +i
  for (let i = 0; i < 12; i++) {
    let dvPos = safeMod(currentDaiHanPos + i, 12); 
    board[CHI_ARRAY[dvPos]].daiVanName = `ĐV.${DV_SHORT_NAMES[i]}`;
  }

  // 3.1.3 LN (Lưu Niên / Lưu Cung của Năm Xem): Khởi tại Tiểu Hạn
  // LN xếp theo chiều thuận nên phải dùng +i
  for (let i = 0; i < 12; i++) {
    let lnPos = safeMod(tieuHanPos + i, 12); 
    board[CHI_ARRAY[lnPos]].luuNien = `LN.${DV_SHORT_NAMES[i]}`;
  }

  // 3.5 Tính Đại Hạn
  for(let i = 0; i < 12; i++) {
     // Bước nhảy cho đạo hạn từ Cung Mệnh
     // Đi thuận (isThuan = true): Tiến lên theo chiều Kim đồng hồ (+ i)
     // Đi nghịch (isThuan = false): Lùi lại ngược chiều Kim đồng hồ (- i)
     let posHan = isThuan ? safeMod(menhPos + i, 12) : safeMod(menhPos - i, 12);

     board[CHI_ARRAY[posHan]].daiHan = cuc + (i * 10);
  }
  if (menhPos === thanPos) {
    board[CHI_ARRAY[menhPos]].tenCung = "Mệnh / Thân";
  }

  // 4. An 14 Chính Tinh + Độ Sáng (Miếu/Vượng/Đắc/Hãm)
  // Bảng tra Độ Sáng: BRIGHTNESS[tenSao][chiIndex] = 'M'|'V'|'Đ'|'H'|''
  // Tý=0, Sửu=1, Dần=2, Mão=3, Thìn=4, Tỵ=5, Ngọ=6, Mùi=7, Thân=8, Dậu=9, Tuất=10, Hợi=11
  const BRIGHTNESS = {
    'Tử Vi':     ['M','M','M','Đ','V','V','M','M','V','H','Đ','V'],
    'Thiên Cơ':  ['Đ','H','V','M','Đ','V','Đ','H','V','M','Đ','V'],
    'Thái Dương': ['H','H','V','M','V','M','M','V','Đ','H','H','H'],
    'Vũ Khúc':   ['M','Đ','H','Đ','M','V','H','Đ','Đ','M','V','H'],
    'Thiên Đồng': ['M','Đ','H','V','Đ','V','H','Đ','H','V','Đ','V'],
    'Liêm Trinh': ['H','Đ','Đ','H','Đ','M','H','V','V','H','Đ','H'],
    'Thiên Phủ':  ['M','V','Đ','V','V','M','Đ','V','Đ','V','M','Đ'],
    'Thái Âm':   ['M','M','H','H','H','H','H','Đ','V','V','M','M'],
    'Tham Lang':  ['H','M','Đ','V','M','V','H','M','Đ','V','M','Đ'],
    'Cự Môn':    ['M','Đ','V','V','Đ','H','Đ','H','V','V','Đ','H'],
    'Thiên Tướng':['M','V','M','Đ','V','Đ','M','V','M','Đ','V','Đ'],
    'Thiên Lương': ['V','V','M','Đ','V','H','M','Đ','H','Đ','H','Đ'],
    'Thất Sát':  ['M','Đ','V','H','V','Đ','M','Đ','V','H','V','Đ'],
    'Phá Quân':  ['M','V','H','Đ','Đ','Đ','M','M','H','H','Đ','Đ'],
  };

  const getDoSang = (saoName, chiIndex) => {
    if (BRIGHTNESS[saoName]) {
      return BRIGHTNESS[saoName][chiIndex] || '';
    }
    return '';
  };

  // Vòng Tử Vi: Tử Vi (0), Nghịch: Thiên Cơ (1), ...
  const vongTuVi = ['Tử Vi', 'Thiên Cơ', '', 'Thái Dương', 'Vũ Khúc', 'Thiên Đồng', '', '', 'Liêm Trinh'];
  vongTuVi.forEach((sao, idx) => {
    if (sao) {
      let pos = (tuviPos - idx) % 12;
      if (pos < 0) pos += 12;
      let doSang = getDoSang(sao, pos);
      let label = doSang ? `${sao} (${doSang})` : sao;
      board[CHI_ARRAY[pos]].saoChinh.push(label);
    }
  });

  // Vòng Thiên Phủ: Đối xứng Tử Vi qua cung Dần (index 2)
  // Công thức: phuPos = (4 - tuviPos + 12) % 12
  let phuPos = (4 - tuviPos + 12) % 12;
  const vongThienPhu = ['Thiên Phủ', 'Thái Âm', 'Tham Lang', 'Cự Môn', 'Thiên Tướng', 'Thiên Lương', 'Thất Sát', '', '', '', 'Phá Quân'];
  vongThienPhu.forEach((sao, idx) => {
    if (sao) {
      let pos = (phuPos + idx) % 12;
      let doSang = getDoSang(sao, pos);
      let label = doSang ? `${sao} (${doSang})` : sao;
      board[CHI_ARRAY[pos]].saoChinh.push(label);
    }
  });

  // 5. An Phụ Tinh cơ bản
  // Tả Phù / Hữu Bật (Dựa vào tháng sinh)
  let taphuPos = (4 + (month - 1)) % 12; // Thìn = 4
  let huubatPos = (10 - (month - 1)) % 12; // Tuất = 10
  if (huubatPos < 0) huubatPos += 12;
  board[CHI_ARRAY[taphuPos]].saoTot.push('Tả Phù');
  board[CHI_ARRAY[huubatPos]].saoTot.push('Hữu Bật');

  // Văn Xương / Văn Khúc (Dựa vào giờ sinh)
  let xuongPos = (10 - (hourIndex - 1)) % 12;
  if (xuongPos < 0) xuongPos += 12;
  let khucPos = (4 + (hourIndex - 1)) % 12;
  board[CHI_ARRAY[xuongPos]].saoTot.push('Văn Xương');
  board[CHI_ARRAY[khucPos]].saoTot.push('Văn Khúc');

  // Vị trí Lộc Tồn theo Thiên Can
  const LOC_TON_MAP = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0]; // Giáp->Dần(2)...Quý->Tý(0)
  let locTonPos = LOC_TON_MAP[canIndex];
  board[CHI_ARRAY[locTonPos]].saoTot.push('Lộc Tồn');

  // Kình Dương (Tiến 1), Đà La (Lùi 1 từ Lộc Tồn)
  board[CHI_ARRAY[(locTonPos + 1) % 12]].saoXau.push('Kình Dương');
  board[CHI_ARRAY[(locTonPos + 11) % 12]].saoXau.push('Đà La');

  // 6. VÒNG LỘC TỒN (12 sao)
  const vongLocTonArr = [
    { name: 'Bác Sĩ', type: 'tot' }, { name: 'Lực Sĩ', type: 'tot' }, { name: 'Thanh Long', type: 'tot' },
    { name: 'Tiểu Hao', type: 'xau' }, { name: 'Tướng Quân', type: 'tot' }, { name: 'Tấu Thư', type: 'tot' },
    { name: 'Phi Liêm', type: 'xau' }, { name: 'Hỷ Thần', type: 'tot' }, { name: 'Bệnh Phù', type: 'xau' },
    { name: 'Đại Hao', type: 'xau' }, { name: 'Phục Binh', type: 'xau' }, { name: 'Quan Phủ', type: 'xau' }
  ];
  for (let i = 0; i < 12; i++) {
    let pos = isThuan ? (locTonPos + i) % 12 : (locTonPos - i + 12) % 12;
    let sao = vongLocTonArr[i];
    if (sao.type === 'tot') board[CHI_ARRAY[pos]].saoTot.push(sao.name);
    else board[CHI_ARRAY[pos]].saoXau.push(sao.name);
  }

  // 7. VÒNG THÁI TUẾ (12 sao, khởi từ Chi Năm)
  const vongThaiTueArr = [
    { name: 'Thái Tuế', type: 'tot' }, { name: 'Thiếu Dương', type: 'tot' }, { name: 'Tang Môn', type: 'xau' },
    { name: 'Thiếu Âm', type: 'tot' }, { name: 'Quan Phù', type: 'xau' }, { name: 'Tử Phù', type: 'xau' },
    { name: 'Tuế Phá', type: 'xau' }, { name: 'Long Đức', type: 'tot' }, { name: 'Bạch Hổ', type: 'xau' },
    { name: 'Phúc Đức', type: 'tot' }, { name: 'Điếu Khách', type: 'xau' }, { name: 'Trực Phù', type: 'xau' }
  ];
  for (let i = 0; i < 12; i++) {
    let pos = (yearChiIndex + i) % 12;
    let sao = vongThaiTueArr[i];
    if (sao.type === 'tot') board[CHI_ARRAY[pos]].saoTot.push(sao.name);
    else board[CHI_ARRAY[pos]].saoXau.push(sao.name);
  }

  // 8. ĐỊA KHÔNG - ĐỊA KIẾP (Từ Hợi = 11, tính theo giờ sinh)
  let khongPos = (11 - (hourIndex - 1) + 12) % 12;
  let kiepPos = (11 + (hourIndex - 1)) % 12;
  board[CHI_ARRAY[khongPos]].saoXau.push('Địa Không');
  board[CHI_ARRAY[kiepPos]].saoXau.push('Địa Kiếp');

  // 9. THIÊN KHÔI - THIÊN VIỆT (Tra chuẩn theo 10 Can)
  const KHOI_VIET_MAP = [
    {k: 1, v: 7},  // Giáp: Khôi=Sửu(1), Việt=Mùi(7)
    {k: 0, v: 8},  // Ất:  Khôi=Tý(0),  Việt=Thân(8)
    {k: 11, v: 9}, // Bính: Khôi=Hợi(11),Việt=Dậu(9)
    {k: 11, v: 9}, // Đinh: Khôi=Hợi(11),Việt=Dậu(9)
    {k: 1, v: 7},  // Mậu: Khôi=Sửu(1), Việt=Mùi(7)
    {k: 0, v: 8},  // Kỷ:  Khôi=Tý(0),  Việt=Thân(8)
    {k: 6, v: 2},  // Canh: Khôi=Ngọ(6), Việt=Dần(2)
    {k: 2, v: 6},  // Tân:  Khôi=Dần(2), Việt=Ngọ(6)
    {k: 3, v: 5},  // Nhâm: Khôi=Mão(3), Việt=Tỵ(5)
    {k: 3, v: 5},  // Quý:  Khôi=Mão(3), Việt=Tỵ(5)
  ];
  let kv = KHOI_VIET_MAP[canIndex];
  board[CHI_ARRAY[kv.k]].saoTot.push('Thiên Khôi');
  board[CHI_ARRAY[kv.v]].saoTot.push('Thiên Việt');

  // 10. ĐÀO HOA - HỒNG LOAN - THIÊN HỶ
  // Đào Hoa: Tý/Ngọ/Mão/Dậu tuỳ nhóm tam hợp chi năm
  const DAO_HOA_MAP = { 0:9, 4:9, 8:9, 1:6, 5:6, 9:6, 2:3, 6:3, 10:3, 3:0, 7:0, 11:0 };
  let daoHoaPos = DAO_HOA_MAP[yearChiIndex];
  board[CHI_ARRAY[daoHoaPos]].saoTot.push('Đào Hoa');
  let hongLoanPos = (3 - yearChiIndex + 12) % 12; // Mão (3) lùi
  board[CHI_ARRAY[hongLoanPos]].saoTot.push('Hồng Loan');
  board[CHI_ARRAY[(hongLoanPos + 6) % 12]].saoTot.push('Thiên Hỷ');

  // 11. CÁC SAO THEO CHI NĂM SINH
  // Thiên Mã (Theo Tam Hợp)
  const MA_MAP = { 0:2, 1:11, 2:8, 3:5, 4:2, 5:11, 6:8, 7:5, 8:2, 9:11, 10:8, 11:5 }; 
  board[CHI_ARRAY[MA_MAP[yearChiIndex]]].saoTot.push('Thiên Mã');

  // Thiên Khốc, Thiên Hư
  let khocPos = (6 - yearChiIndex + 12) % 12;
  let huPos = (6 + yearChiIndex) % 12;
  board[CHI_ARRAY[khocPos]].saoXau.push('Thiên Khốc');
  board[CHI_ARRAY[huPos]].saoXau.push('Thiên Hư');

  // Long Trì, Phượng Các, Giải Thần
  let longPos = (4 + yearChiIndex) % 12; // Khởi Thìn(4)
  let phuongPos = (10 - yearChiIndex + 12) % 12; // Khởi Tuất(10)
  board[CHI_ARRAY[longPos]].saoTot.push('Long Trì');
  board[CHI_ARRAY[phuongPos]].saoTot.push('Phượng Các');
  board[CHI_ARRAY[phuongPos]].saoTot.push('Giải Thần');

  // Cô Thần, Quả Tú
  const CO_QUA_MAP = [
    { c: 2, q: 10 }, { c: 2, q: 10 }, { c: 5, q: 1 }, 
    { c: 5, q: 1 }, { c: 5, q: 1 }, { c: 8, q: 4 }, 
    { c: 8, q: 4 }, { c: 8, q: 4 }, { c: 11, q: 7 }, 
    { c: 11, q: 7 }, { c: 11, q: 7 }, { c: 2, q: 10 }
  ]; 
  let coQua = CO_QUA_MAP[yearChiIndex];
  board[CHI_ARRAY[coQua.c]].saoXau.push('Cô Thần');
  board[CHI_ARRAY[coQua.q]].saoXau.push('Quả Tú');

  // Hoa Cái, Kiếp Sát, Phá Toái
  const HOA_CAI_MAP = { 0:4, 4:4, 8:4, 2:10, 6:10, 10:10, 11:7, 3:7, 7:7, 5:1, 9:1, 1:1 }; 
  const KIEP_SAT_MAP = { 0:5, 4:5, 8:5, 2:11, 6:11, 10:11, 11:8, 3:8, 7:8, 5:2, 9:2, 1:2 };
  const PHA_TOAI_MAP = { 0:5, 4:5, 8:5, 2:9, 6:9, 10:9, 11:1, 3:1, 7:1, 5:5, 9:5, 1:5 };
  board[CHI_ARRAY[HOA_CAI_MAP[yearChiIndex]]].saoTot.push('Hoa Cái');
  board[CHI_ARRAY[KIEP_SAT_MAP[yearChiIndex]]].saoXau.push('Kiếp Sát');
  board[CHI_ARRAY[PHA_TOAI_MAP[yearChiIndex]]].saoXau.push('Phá Toái');

  // 12. CÁC SAO THEO THÁNG, NGÀY VÀ GIỜ
  let anQuangPos = safeMod(xuongPos + day - 2, 12);
  let thienQuyPos = safeMod(khucPos - day + 2, 12);
  board[CHI_ARRAY[anQuangPos]].saoTot.push('Ân Quang');
  board[CHI_ARRAY[thienQuyPos]].saoTot.push('Thiên Quý');
  
  let tamThaiPos = safeMod(taphuPos + day - 1, 12);
  let batToaPos = safeMod(huubatPos - day + 1, 12);
  board[CHI_ARRAY[tamThaiPos]].saoTot.push('Tam Thai');
  board[CHI_ARRAY[batToaPos]].saoTot.push('Bát Tọa');
  
  let rieuYPos = (1 + month - 1) % 12;
  board[CHI_ARRAY[rieuYPos]].saoXau.push('Thiên Riêu');
  board[CHI_ARRAY[rieuYPos]].saoTot.push('Thiên Y');

  let hinhPos = (9 + month - 1) % 12;
  board[CHI_ARRAY[hinhPos]].saoXau.push('Thiên Hình');

  board[CHI_ARRAY[(khucPos + 2) % 12]].saoTot.push('Thai Phụ');
  board[CHI_ARRAY[(khucPos - 2 + 12) % 12]].saoTot.push('Phong Cáo');

  // 12.5 CÁC SAO KHÁC (Thiên Không, Hoả Linh, Quang Quý...)
  // Thiên Không (Ngay trước Thái Tuế)
  let thienKhongPos = (yearChiIndex + 1) % 12;
  board[CHI_ARRAY[thienKhongPos]].saoXau.push('Thiên Không');
  
  // Hỏa Tinh, Linh Tinh - Theo Chi Năm sinh và Giờ sinh
  // Nhóm Dần Ngọ Tuất: Hỏa khởi Sửu, Linh khởi Mão
  // Nhóm Thân Tý Thìn: Hỏa khởi Dần, Linh khởi Tuất
  // Nhóm Tỵ Dậu Sửu: Hỏa khởi Mão, Linh khởi Tuất
  // Nhóm Hợi Mão Mùi: Hỏa khởi Dậu, Linh khởi Mão (Dương Nam/Âm Nữ thuận, ngược lại nghịch)
  const HOA_LINH_START = {
    // [hoaStart, linhStart] theo nhóm Tam Hợp Chi Năm
    // Dần(2), Ngọ(6), Tuất(10)
    2: [1, 3], 6: [1, 3], 10: [1, 3],
    // Thân(8), Tý(0), Thìn(4)
    8: [2, 10], 0: [2, 10], 4: [2, 10],
    // Tỵ(5), Dậu(9), Sửu(1)
    5: [3, 10], 9: [3, 10], 1: [3, 10],
    // Hợi(11), Mão(3), Mùi(7)
    11: [9, 3], 3: [9, 3], 7: [9, 3]
  };
  const [hoaStart, linhStart] = HOA_LINH_START[yearChiIndex] || [2, 10];
  // Dương Nam / Âm Nữ: thuận (tiến theo giờ). Âm Nam / Dương Nữ: nghịch.
  let hoaPos, linhPos;
  if (isThuan) {
    hoaPos = (hoaStart + hourIndex - 1) % 12;
    linhPos = (linhStart + hourIndex - 1) % 12;
  } else {
    hoaPos = (hoaStart - (hourIndex - 1) + 12) % 12;
    linhPos = (linhStart - (hourIndex - 1) + 12) % 12;
  }
  board[CHI_ARRAY[hoaPos]].saoXau.push('Hỏa Tinh');
  board[CHI_ARRAY[linhPos]].saoXau.push('Linh Tinh');

  // Thiên Quan, Thiên Phúc (Theo Can Năm)
  const QUAN_PHUC_MAP = [
    {q: 7, p: 9}, {q: 4, p: 8}, {q: 5, p: 0}, {q: 2, p: 11}, {q: 3, p: 3}, 
    {q: 9, p: 2}, {q: 11, p: 6}, {q: 9, p: 5}, {q: 10, p: 6}, {q: 6, p: 5}
  ]; // Giáp->Quý
  board[CHI_ARRAY[QUAN_PHUC_MAP[canIndex].q]].saoTot.push('Thiên Quan');
  board[CHI_ARRAY[QUAN_PHUC_MAP[canIndex].p]].saoTot.push('Thiên Phúc');

  // Lưỡng Toái, Không Kiếp, Kiếp Sát, Hoa Cái... (đã có ở trên)
  // Lưu Hà, Thiên Trù
  const LUU_HA = [9, 10, 7, 5, 5, 6, 4, 3, 11, 2]; // Canh=Thìn(4), was wrong(8)
  board[CHI_ARRAY[LUU_HA[canIndex]]].saoXau.push('Lưu Hà');
  
  // Thiên Khốc, Thiên Hư, Thiên Hình, Thiên Riêu (Đã an)
  
  // 12.6 CÁC SAO THIẾU - BỔ SUNG THEO REFERENCE
  // Thiên La (cố định Thìn=4), Địa Võng (cố định Tuất=10)
  board[CHI_ARRAY[4]].saoXau.push('Thiên La');
  board[CHI_ARRAY[10]].saoXau.push('Địa Võng');

  // Quốc Ấn (theo Tam Hợp Chi Năm)
  const QUOC_AN_MAP = { 0:4, 4:4, 8:4, 2:10, 6:10, 10:10, 5:7, 9:7, 1:7, 11:1, 3:1, 7:1 };
  board[CHI_ARRAY[QUOC_AN_MAP[yearChiIndex]]].saoTot.push('Quốc Ấn');

  // Đường Phù (theo Tam Hợp Chi Năm)
  const DUONG_PHU_MAP = { 0:1, 4:1, 8:1, 2:7, 6:7, 10:7, 5:10, 9:10, 1:10, 11:4, 3:4, 7:4 };
  board[CHI_ARRAY[DUONG_PHU_MAP[yearChiIndex]]].saoTot.push('Đường Phù');

  // Thiên Đức (theo tháng sinh ÂL)
  const THIEN_DUC_MAP = [5, 6, 1, 11, 11, 0, 2, 7, 5, 4, 8, 7]; // tháng 1-12
  board[CHI_ARRAY[THIEN_DUC_MAP[(month - 1) % 12]]].saoTot.push('Thiên Đức');
  
  // Nguyệt Đức (theo tháng sinh ÂL)
  const NGUYET_DUC_MAP = [5, 2, 11, 9, 5, 2, 11, 9, 5, 2, 11, 9]; // tháng 1-12
  board[CHI_ARRAY[NGUYET_DUC_MAP[(month - 1) % 12]]].saoTot.push('Nguyệt Đức');

  // Thiên Trù (theo Can Năm)
  const THIEN_TRU = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0]; // same as Lộc Tồn offset or separate
  // Thiên Trù: Giáp→Tỵ, Ất→Ngọ, Bính→Tỵ, Đinh→Ngọ, Mậu→Tỵ, Kỷ→Ngọ, Canh→Dần, Tân→Mão, Nhâm→Dần, Quý→Mão
  const THIEN_TRU_MAP = [5, 6, 5, 6, 5, 6, 2, 3, 2, 3];
  board[CHI_ARRAY[THIEN_TRU_MAP[canIndex]]].saoTot.push('Thiên Trù');

  // Thiên Sứ: cố định tại cung Tật Ách
  let tatAchPos = (menhPos + 7) % 12;
  board[CHI_ARRAY[tatAchPos]].saoXau.push('Thiên Sứ');

  // Thiên Giải (theo tháng sinh)
  const THIEN_GIAI_MAP = [11, 11, 1, 1, 3, 3, 5, 5, 7, 7, 9, 9]; // tháng 1-12
  board[CHI_ARRAY[THIEN_GIAI_MAP[(month - 1) % 12]]].saoTot.push('Thiên Giải');

  // Địa Giải (theo tháng sinh)
  const DIA_GIAI_MAP = [7, 7, 9, 9, 11, 11, 1, 1, 3, 3, 5, 5]; // tháng 1-12
  board[CHI_ARRAY[DIA_GIAI_MAP[(month - 1) % 12]]].saoTot.push('Địa Giải');

  // Thiên Thương (đối cung Thiên Hỷ)
  let thienHyPos = (hongLoanPos + 6) % 12;
  board[CHI_ARRAY[(thienHyPos + 6) % 12]].saoXau.push('Thiên Thương');

  // Thiên Thọ: nghịch Thiên Mã
  let thienMaPos = MA_MAP[yearChiIndex];
  board[CHI_ARRAY[(thienMaPos + 6) % 12]].saoTot.push('Thiên Thọ');

  // Thiên Tài (theo giờ sinh, khởi Ngọ thuận)
  let thienTaiPos = (6 + hourIndex - 1) % 12;
  board[CHI_ARRAY[thienTaiPos]].saoTot.push('Thiên Tài');

  // Văn Tinh (= Thiên Quan duplicate in some systems, or based on Can)
  // Thiên Quan đã an, Văn Tinh thường trùng vị trí
  board[CHI_ARRAY[QUAN_PHUC_MAP[canIndex].q]].saoTot.push('Văn Tinh');

  // 16. LƯU SAO (L. prefix) - Sao lưu niên theo NĂM XEM
  const { canIndex: xCanIdx, chiIndex: xChiIdx } = getCanChiYearIndex(namXem);
  
  // L.Lộc Tồn
  const lLocTonPos = LOC_TON_MAP[xCanIdx];
  board[CHI_ARRAY[lLocTonPos]].saoTot.push('L.Lộc Tồn');
  // L.Kình Dương, L.Đà La (not displayed separately if not in reference, but add key ones)
  board[CHI_ARRAY[(lLocTonPos + 1) % 12]].saoXau.push('L.Kình Dương');

  // L.Thái Tuế (= Chi năm xem)
  board[CHI_ARRAY[xChiIdx]].saoXau.push('L.Thái Tuế');
  // L.Tang Môn (Thái Tuế + 2)
  board[CHI_ARRAY[(xChiIdx + 2) % 12]].saoXau.push('L.Tang Môn');

  // L.Văn Xương (theo Can năm xem)
  // Standard: Giáp→Tỵ, Ất→Ngọ, Bính→Thân, etc.
  const L_VAN_XUONG = [5, 6, 8, 9, 8, 9, 11, 0, 2, 3];
  board[CHI_ARRAY[L_VAN_XUONG[xCanIdx]]].saoTot.push('L.Văn Xương');
  // L.Văn Khúc
  const L_VAN_KHUC = [11, 0, 2, 3, 2, 3, 5, 6, 8, 9];
  board[CHI_ARRAY[L_VAN_KHUC[xCanIdx]]].saoTot.push('L.Văn Khúc');

  // L.Thiên Mã
  const L_MA_MAP = { 0:2, 1:11, 2:8, 3:5, 4:2, 5:11, 6:8, 7:5, 8:2, 9:11, 10:8, 11:5 };
  board[CHI_ARRAY[L_MA_MAP[xChiIdx]]].saoTot.push('L.Thiên Mã');

  // L.Hồng Loan (Mão(3) - Chi năm xem)
  let lHongLoanPos = (3 - xChiIdx + 12) % 12;
  board[CHI_ARRAY[lHongLoanPos]].saoTot.push('L.Hồng Loan');

  // L.Thiên Khôi, L.Thiên Việt (theo Can năm xem)
  let lkv = KHOI_VIET_MAP[xCanIdx];
  board[CHI_ARRAY[lkv.k]].saoTot.push('L.Thiên Khôi');
  board[CHI_ARRAY[lkv.v]].saoTot.push('L.Thiên Việt');

  // L.Hóa Lộc, L.Hóa Quyền, L.Hóa Khoa, L.Hóa Kỵ (Tứ Hóa năm xem)
  const lTuHoaStars = TU_HOA_TABLE[xCanIdx];
  const lTuHoaLabels = ['L.Hóa Lộc', 'L.Hóa Quyền', 'L.Hóa Khoa', 'L.Hóa Kỵ'];
  for (let h = 0; h < 4; h++) {
    const targetStar = lTuHoaStars[h];
    for (const chi of CHI_ARRAY) {
      const cung = board[chi];
      if (cung.saoChinh.some(s => s.startsWith(targetStar)) || cung.saoTot.includes(targetStar)) {
        if (h < 3) cung.saoTot.push(lTuHoaLabels[h]);
        else cung.saoXau.push(lTuHoaLabels[h]);
        break;
      }
    }
  }

  // L.Thiên Khốc, L.Thiên Hư (theo Chi năm xem)
  let lKhocPos = (6 - xChiIdx + 12) % 12;
  let lHuPos = (6 + xChiIdx) % 12;
  board[CHI_ARRAY[lKhocPos]].saoXau.push('L.Thiên Khốc');
  board[CHI_ARRAY[lHuPos]].saoXau.push('L.Thiên Hư');

  // L.Phúc Đức (vòng Thái Tuế năm xem, i=9)
  board[CHI_ARRAY[(xChiIdx + 9) % 12]].saoTot.push('L.Phúc Đức');
  // L.Bạch Hổ (vòng Thái Tuế năm xem, i=8)
  board[CHI_ARRAY[(xChiIdx + 8) % 12]].saoXau.push('L.Bạch Hổ');
  // L.Long Đức (vòng Thái Tuế năm xem, i=7)
  board[CHI_ARRAY[(xChiIdx + 7) % 12]].saoTot.push('L.Long Đức');
  // L.Kiếp Sát 
  const L_KIEP_SAT_MAP = { 0:5, 4:5, 8:5, 2:11, 6:11, 10:11, 11:8, 3:8, 7:8, 5:2, 9:2, 1:2 };
  board[CHI_ARRAY[L_KIEP_SAT_MAP[xChiIdx]]].saoXau.push('L.Kiếp Sát');
  // L.Đào Hoa
  const L_DAO_HOA_MAP = { 0:9, 4:9, 8:9, 1:6, 5:6, 9:6, 2:3, 6:3, 10:3, 3:0, 7:0, 11:0 };
  board[CHI_ARRAY[L_DAO_HOA_MAP[xChiIdx]]].saoTot.push('L.Đào Hoa');
  // L.Thiên Đức  
  board[CHI_ARRAY[THIEN_DUC_MAP[(xChiIdx) % 12]]].saoTot.push('L.Thiên Đức');
  // L.Nguyệt Đức
  board[CHI_ARRAY[NGUYET_DUC_MAP[(xChiIdx) % 12]]].saoTot.push('L.Nguyệt Đức');
  // 13. VÒNG TRÀNG SINH (12 sao)
  // Quy luật: Dương Nam/Âm Nữ đi Thuận. Âm Nam/Dương Nữ đi Nghịch.
  // Đi thuận = đi CÙNG chiều với 12 cung (Nghịch kim đồng hồ)
  // Đi nghịch = đi NGƯỢC chiều với 12 cung (Thuận kim đồng hồ)
  const TS_START = { 2: 8, 3: 11, 4: 5, 5: 8, 6: 2 };
  let tsPos = TS_START[cuc] || 8;
  const vongTSArr = ['Tràng Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng', 'Suy', 'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'];
  
  for (let i = 0; i < 12; i++) {
    // Nếu đi Thuận (Tràng Sinh->Mộc Dục...): Tiến lên theo chiều Kim đồng hồ (+ i)
    // Nếu đi Nghịch (Tràng Sinh->Mộc Dục...): Lùi lại ngược chiều Kim đồng hồ (- i)
    let pos = isThuan ? safeMod(tsPos + i, 12) : safeMod(tsPos - i, 12);
    board[CHI_ARRAY[pos]].trangSinh = vongTSArr[i];
  }

  // 14. TUẦN KHÔNG, TRIỆT LỘ
  let tuanK_Giap = (yearChiIndex - canIndex + 12) % 12;
  let tuan1 = (tuanK_Giap - 1 + 12) % 12;
  let tuan2 = (tuanK_Giap - 2 + 12) % 12;
  // Thay vì push vào saoXau, ta sẽ lưu vị trí để vẽ box trên biên
  const tuanPositions = [tuan1, tuan2];
  console.log(`[Engine Debug] tuanK_Giap: ${tuanK_Giap}, tuanPositions:`, tuanPositions);

  let trietArr = TRIET_MAP[safeMod(canIndex, 5)];
  const trietPositions = trietArr;
  console.log(`[Engine Debug] trietPositions idx:`, trietPositions);

  // 15. TỨ HÓA - Gắn vào Chính Tinh theo Can Năm sinh
  const tuHoaStars = TU_HOA_TABLE[canIndex];
  const tuHoaLabels = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'];
  userInfo.tuHoaCungs = { Loc: '...', Quyen: '...', Khoa: '...', Ky: '...' };
  
  for (let h = 0; h < 4; h++) {
    const targetStar = tuHoaStars[h];
    let found = false;
    for (const chi of CHI_ARRAY) {
      if (found) break;
      const cung = board[chi];
      
      // Kiểm tra trong Chính tinh (có xử lý độ sáng)
      const hasInMain = cung.saoChinh.some(s => s.startsWith(targetStar));
      // Kiểm tra trong Cát tinh và Hung tinh
      const hasInPhu = cung.saoTot.includes(targetStar) || cung.saoXau.includes(targetStar);
      
      if (hasInMain || hasInPhu) {
        if (h < 3) cung.saoTot.push(tuHoaLabels[h]);
        else cung.saoXau.push(tuHoaLabels[h]);
        
        // Lấy tên cung gốc (bỏ phần Thân)
        const displayCungName = cung.tenCung.replace(' <Thân>', '').split(' /')[0].trim();
        if (h === 0) userInfo.tuHoaCungs.Loc = displayCungName;
        if (h === 1) userInfo.tuHoaCungs.Quyen = displayCungName;
        if (h === 2) userInfo.tuHoaCungs.Khoa = displayCungName;
        if (h === 3) userInfo.tuHoaCungs.Ky = displayCungName;
        
        found = true;
      }
    }
  }

  return {
    board,
    userInfo,
    menhPos: CHI_ARRAY[menhPos],
    thanPos: CHI_ARRAY[thanPos],
    tuanPositions: tuanPositions.map(p => CHI_ARRAY[p]),
    trietPositions: trietPositions.map(p => CHI_ARRAY[p])
  };
};
