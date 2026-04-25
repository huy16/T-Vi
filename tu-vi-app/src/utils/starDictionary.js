/**
 * Từ điển ý nghĩa các sao Tử Vi (Core Meanings)
 * Dùng để hiển thị nội dung nhanh khi chưa gọi AI.
 */

export const STAR_MEANINGS = {
  // CHÍNH TINH
  "Tử Vi": {
    overview: "Chủ về uy quyền, tài lộc và sự hóa giải tai ương. Vận gặp Tử Vi là lúc có thể khẳng định vị thế.",
    advice: "Nên giữ phong thái đĩnh đạc, cầu tiến nhưng không kiêu ngạo.",
    warning: "Tránh sự độc đoán hoặc tin dùng kẻ xu nịnh."
  },
  "Thiên Phủ": {
    overview: "Chủ về kho lộc, sự ổn định và tích lũy. Vận này tốt cho việc quản lý tài sản và xây dựng nền móng.",
    advice: "Tập trung vào các kế hoạch dài hạn, tích cốc phòng cơ.",
    warning: "Tránh sự bảo thủ quá mức dẫn đến mất cơ hội."
  },
  "Thiên Lương": {
    overview: "Chủ về phúc thọ, sự che chở và hóa giải. Thiên Lương tọa thủ là vận may về quý nhân phù trợ.",
    advice: "Nên làm việc thiện, giúp người để bồi đắp thêm phúc khí.",
    warning: "Cẩn thận sự chủ quan hoặc quá tin người mà chịu thiệt."
  },
  "Thái Dương": {
    overview: "Chủ về quan lộc, danh tiếng và sự lan tỏa. Như ánh mặt trời soi sáng, mọi việc dần trở nên minh bạch.",
    advice: "Hãy tự tin thể hiện năng lực, phát triển các mối quan hệ xã giao.",
    warning: "Tránh sự nóng nảy, phô trương quá mức."
  },
  "Thái Âm": {
    overview: "Chủ về điền sản, tiền bạc và sự mềm mại. Vận này thuận lợi cho các kế hoạch kín đáo, bền bỉ.",
    advice: "Nên lắng nghe trực giác và giữ sự điềm tĩnh.",
    warning: "Cẩn thận các vấn đề liên quan đến phụ nữ hoặc thị phi ngầm."
  },
  "Vũ Khúc": {
    overview: "Chủ về tài lộc, sự quyết đoán và cô độc. Vận này mạnh về kiếm tiền nhưng cần chú ý tình cảm.",
    advice: "Quyết đoán trong kinh doanh sẽ mang lại lợi nhuận lớn.",
    warning: "Đừng quá khô khan, hãy dành thời gian cho gia đình."
  },
  "Tham Lang": {
    overview: "Chủ về ham muốn, nghệ thuật và sự biến hóa. Vận này nhiều cơ hội nhưng cũng nhiều cám dỗ.",
    advice: "Học hỏi các kỹ năng mới, mở rộng ngoại giao.",
    warning: "Kiểm soát dục vọng, tránh các thú vui xa đọa."
  },
  // THÊM CÁC SAO KHÁC...
};

export const getStarMeaning = (starName) => {
  // Xử lý trường hợp tên sao có độ sáng (ví dụ: "Thiên Lương (M)")
  const cleanName = starName.split(' (')[0].trim();
  return STAR_MEANINGS[cleanName] || null;
};
