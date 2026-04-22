import React, { useState } from 'react';
import './AdvancedSections.css';
import { getStarBrightnessTags, CUNG_ICONS } from '../utils/analysisContent';
import { CHI_NGU_HANH } from '../utils/tuviEngine';

// ===== HELPER =====
const findCungByName = (board, name) => {
  for (const chi of Object.keys(board)) {
    const cung = board[chi];
    const tenCung = cung.tenCung?.split(' /')[0]?.split(' <')[0]?.trim();
    if (tenCung === name) return { cung, chi };
  }
  return { cung: null, chi: null };
};

// ===== CON CÁI (TỬ TỨC) =====
export const ConCaiSection = ({ chartData }) => {
  if (!chartData) return null;
  const { board } = chartData;
  const { cung: tuTuc, chi } = findCungByName(board, 'Tử Tức');
  const starTags = getStarBrightnessTags(tuTuc?.saoChinh || []);
  const isVoChinhDieu = starTags.length === 0;

  const nenCung = isVoChinhDieu ? 'Vô chính diệu' : 'Có chính tinh thủ';
  const hasGoodStars = tuTuc?.saoTot?.length > 0;
  const hasBadStars = tuTuc?.saoXau?.length > 0;

  let khoDescription = "Cung Tử Tức cần xem xét kết hợp tam hợp chiếu. Con cái tự lập sớm.";
  let trucNuoiDay = "Linh hoạt & Tôn trọng";

  if (!isVoChinhDieu) {
    khoDescription = `Ảnh hưởng của ${starTags[0]?.name} khiến con cái có cá tính riêng.`;
    trucNuoiDay = "Định hướng & Kỷ luật";
  }

  if (hasGoodStars && !hasBadStars) {
    khoDescription += " Nền cung cát lợi, con cái ngoan ngoãn, dễ nuôi, lớn lên thành đạt báo hiếu.";
    trucNuoiDay = "Phát triển tự nhiên & Khuyến khích";
  } else if (hasBadStars) {
    khoDescription += " Cung có sát tinh, việc nuôi dạy con cái đòi hỏi nhiều kiên nhẫn, đôi khi khắc khẩu hoặc con dễ ốm vặt lúc nhỏ.";
    trucNuoiDay = "Mềm mỏng & Kiên nhẫn tuyệt đối";
  }

  return (
    <section className="result-section result-section--wide detail-section">
      <div className="section-header">
        <div className="section-icon">子</div>
        <div className="section-header-text">
          <h2 className="section-title">Con Cái</h2>
          <p className="section-subtitle">Cung Tử Tức • Duyên con, khí chất của con và cách nuôi dạy</p>
        </div>
      </div>

      <div className="pill-tags">
        <span className="pill-tag pill-tag--accent">Cung Tử Tức</span>
        {isVoChinhDieu && <span className="pill-tag">Vô chính diệu</span>}
        {starTags.map((tag, i) => (
          <span key={i} className="pill-tag">{tag.name} ({tag.label || 'Tọa'})</span>
        ))}
      </div>

      <div className="detail-headline">
        <h3>Nuôi con đúng khí chất thay vì ép con vào khuôn mẫu định sẵn</h3>
        <p>Gia đình giữ nề nếp và thống nhất quan điểm giáo dục sẽ giúp hóa giải xung khắc thế hệ.</p>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-card-label">NỀN CUNG</div>
          <div className="summary-card-value">{nenCung}</div>
          <p className="summary-card-desc">{hasGoodStars ? 'Nhiều phúc lộc từ con cái' : 'Con cái tự lập tự cường'}</p>
        </div>
        <div className="summary-card">
          <div className="summary-card-label">KHÍ CHẤT NỔI</div>
          <div className="summary-card-value">{starTags[0]?.name || 'Tự do'}</div>
          <p className="summary-card-desc">{isVoChinhDieu ? 'Cần xem đối cung' : 'Tọa thủ gốc cung'}</p>
        </div>
        <div className="summary-card">
          <div className="summary-card-label">TRỤC NUÔI DẠY</div>
          <div className="summary-card-value">{trucNuoiDay}</div>
          <p className="summary-card-desc">Phương pháp tối ưu</p>
        </div>
      </div>

      <div className="content-card">
        <p><strong>Căn cứ:</strong> {khoDescription}</p>
        <p style={{ marginTop: '0.75rem' }}><strong>Duyên con:</strong> {isVoChinhDieu ? 'Cung vô chính diệu, kết duyên sớm hay muộn đều tùy thuộc vào phúc đức gia đình.' : 'Tử Tức có năng lượng rõ rệt.'} Số lượng và thời điểm cụ thể còn phụ thuộc vào thời vận của hai vợ chồng.</p>
      </div>

      <div className="summary-cards" style={{ marginTop: '1rem' }}>
        <div className="summary-card">
          <div className="summary-card-label">YẾU TỐ SAO TỐT</div>
          <div className="summary-card-value">{tuTuc?.saoTot?.length || 0} Trợ Tinh</div>
          <div className="pill-tags" style={{ marginTop: '0.5rem' }}>
            {tuTuc?.saoTot?.slice(0, 3).map((s, i) => <span key={i} className="pill-tag" style={{fontSize: '0.7rem'}}>{s}</span>)}
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-card-label">YẾU TỐ SAO XẤU</div>
          <div className="summary-card-value">{tuTuc?.saoXau?.length || 0} Sát Tinh</div>
          <div className="pill-tags" style={{ marginTop: '0.5rem' }}>
            {tuTuc?.saoXau?.slice(0, 3).map((s, i) => <span key={i} className="pill-tag" style={{fontSize: '0.7rem'}}>{s}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
};

// ===== CÁC GIAI ĐOẠN CUỘC ĐỜI =====
export const GiaiDoanSection = ({ chartData }) => {
  if (!chartData) return null;
  const { board, userInfo } = chartData;
  const solarYear = userInfo.solarYear || userInfo.year;
  const tuoi = 2026 - solarYear + 1;

  // Collect all đại hạn periods
  const daiHanPeriods = [];
  for (const chi of Object.keys(board)) {
    const cung = board[chi];
    if (cung.daiHan && typeof cung.daiHan === 'number') {
      const tenCung = cung.tenCung?.split(' /')[0]?.split(' <')[0]?.trim();
      const starTags = getStarBrightnessTags(cung.saoChinh || []);
      daiHanPeriods.push({
        startAge: cung.daiHan,
        endAge: cung.daiHan + 9,
        chi,
        tenCung,
        starTags,
        isCurrent: tuoi >= cung.daiHan && tuoi < cung.daiHan + 10,
        saoTot: cung.saoTot || [],
        saoXau: cung.saoXau || [],
      });
    }
  }
  daiHanPeriods.sort((a, b) => a.startAge - b.startAge);

  const [selectedIdx, setSelectedIdx] = useState(() => {
    const idx = daiHanPeriods.findIndex(p => p.isCurrent);
    return idx >= 0 ? idx : 0;
  });

  const selected = daiHanPeriods[selectedIdx];
  if (!selected) return null;

  const hasGoodStars = selected.saoTot?.some(s =>
    s.includes('Hóa Lộc') || s.includes('Lộc Tồn') || s.includes('Thiên Khôi')
  );
  const rating = hasGoodStars ? 'ĐANG TRẢI' : 'ĐANG TRẢI';

  return (
    <section className="result-section result-section--wide detail-section">
      <div className="section-header">
        <div className="section-icon">運</div>
        <div className="section-header-text">
          <h2 className="section-title">Các Giai Đoạn Cuộc Đời</h2>
          <p className="section-subtitle">Luận theo từng đại vận 10 năm • Nêu rõ trọng tâm, cơ hội và điều cần lưu ý ở mỗi chặng</p>
        </div>
      </div>

      {/* Timeline tabs */}
      <div className="gd-timeline">
        {daiHanPeriods.map((p, idx) => (
          <button
            key={idx}
            className={`gd-tab ${idx === selectedIdx ? 'gd-tab--active' : ''} ${p.isCurrent ? 'gd-tab--current' : ''}`}
            onClick={() => setSelectedIdx(idx)}
          >
            <span className="gd-tab-range">{p.startAge}-{p.endAge}</span>
            {p.isCurrent && <span className="gd-tab-now">HIỆN TẠI</span>}
          </button>
        ))}
      </div>

      {/* Selected period detail */}
      <div className="content-card" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🌀</span>
          <div>
            <strong style={{ fontSize: '1.1rem' }}>Tuổi {selected.startAge}-{selected.endAge}</strong>
            <span style={{ marginLeft: '0.5rem' }} className="pill-tag pill-tag--accent">{selected.tenCung} ({selected.chi})</span>
            <span style={{ marginLeft: '0.5rem' }} className="pill-tag">{rating}</span>
          </div>
        </div>

        <div className="pill-tags" style={{ marginBottom: '0.5rem' }}>
          <span className="pill-tag">🔥 Khởi nghiệp & Tích lũy</span>
        </div>

        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Đọc như xu hướng dải hạn của đại vận này, rồi đối chiếu với hoàn cảnh thực tế ở hiện tại.
        </p>

        <div className="pill-tags" style={{ marginBottom: '1rem' }}>
          {selected.starTags.map((s, i) => (
            <span key={i} className="pill-tag">{s.name} ({s.label || 'Tọa'})</span>
          ))}
          {selected.starTags.length === 0 && <span className="pill-tag pill-tag--accent">Vô chính diệu</span>}
        </div>

        <div className="quote-box">
          "Đại vận {selected.startAge}-{selected.endAge} tuổi nhấn mạnh đời sống tinh thần, nội lực và phúc nền phía sau mọi quyết định.
          {selected.starTags.length > 0 ? ` ${selected.starTags[0].name} là dấu ấn nổi bật của chặng này.` : ''}
          Nhịp phát triển nhìn chung ổn, nhưng kết quả đẹp nhất chỉ đến khi bạn giữ kỷ luật và không phân tán."
        </div>

        {/* Category buttons */}
        <div className="pill-tags" style={{ marginTop: '1rem' }}>
          <span className="pill-tag">💼 Sự nghiệp</span>
          <span className="pill-tag">💰 Tài lộc</span>
          <span className="pill-tag">💚 Sức khỏe</span>
          <span className="pill-tag">❤️ Tình cảm</span>
        </div>

        <p style={{ marginTop: '1rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
          Đại vận {selected.startAge}-{selected.endAge} tuổi đi qua cung {selected.tenCung}, nên trọng tâm tự nhiên nghiêng về
          đời sống tinh thần, nội lực và phúc nền phía sau mọi quyết định.
          {selected.starTags.length > 0 ? ` Bộ sao ${selected.starTags[0].name} tạo lực nắng khá rõ, đặc biệt ở quyết đoán, sức ép cao và bài học bản lĩnh.` : ''}
          Nhịp phát triển nhìn chung ổn, nhưng kết quả đẹp nhất chỉ đến khi bạn giữ kỷ luật và không phân tán.
        </p>
      </div>

      {/* Chiến lược giai đoạn */}
      <div className="content-card" style={{ marginTop: '1rem' }}>
        <div className="content-card-title">CHIẾN LƯỢC GIAI ĐOẠN</div>
        <div className="step-list">
          <div className="step-item">
            <span className="step-text">Giữ nhịp đều ở 1-2 ưu tiên chính; giai đoạn này không hợp ôm quá nhiều hướng cùng lúc.</span>
          </div>
          <div className="step-item">
            <span className="step-text">Hãy xem đời sống tinh thần, nội lực và phúc nền phía sau mọi quyết định là trục chính của 10 năm này.</span>
          </div>
          <div className="step-item">
            <span className="step-text">{selected.starTags.length > 0 ? `${selected.starTags[0].name} sáng giúp bạn đề nhìn ra hướng đúng và tạo kết quả đều hơn.` : 'Cung vô chính diệu đòi hỏi bạn phải tự chủ và kiên nhẫn hơn.'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// ===== VẬN TRÌNH 12 THÁNG =====
export const VanTrinh12ThangSection = ({ chartData }) => {
  if (!chartData) return null;
  const { board } = chartData;

  // Thuật toán: Ánh xạ 12 tháng Âm Lịch bắt đầu từ Tháng 1 = cung Dần (Theo chuẩn Tử Vi)
  // Thực tế có phép Lưu Nguyệt di động, nhưng để trực quan ta dùng Địa Chi cố định của 12 tháng
  const LUNAR_MONTHS = ['Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu'];
  const MONTH_RATINGS = [];
  const MONTH_COLORS = {
    'Đại cát': 'var(--color-good)',
    'Bình an': 'var(--text-secondary)',
    'Tiểu hung': 'var(--color-warning)',
    'Cần thận': 'var(--color-danger)',
  };

  let maxScore = -999;
  let minScore = 999;
  let bestMonthIdx = 0;
  let worstMonthIdx = 0;

  let totalGoodCount = 0;
  let totalBadCount = 0;

  LUNAR_MONTHS.forEach((chi, idx) => {
    const cung = board[chi];
    let score = 0;

    // 1. Chấm điểm Chính tinh
    const mainStars = cung.saoChinh || [];
    mainStars.forEach(sao => {
      if (sao.includes('(M)') || sao.includes('(V)') || sao.includes('(Đ)')) score += 2;
      else if (sao.includes('(H)') || sao.includes('(B)')) score -= 1;
    });

    // 2. Chấm điểm Phụ tinh
    const goodStars = cung.saoTot || [];
    const badStars = cung.saoXau || [];
    totalGoodCount += goodStars.length;
    totalBadCount += badStars.length;

    score += goodStars.length * 1.5;
    score -= badStars.length * 1.5;

    // Xếp hạng
    if (score >= 2) MONTH_RATINGS.push('Đại cát');
    else if (score >= 0) MONTH_RATINGS.push('Bình an');
    else if (score >= -2) MONTH_RATINGS.push('Tiểu hung');
    else MONTH_RATINGS.push('Cần thận');

    if (score > maxScore) { maxScore = score; bestMonthIdx = idx; }
    if (score < minScore) { minScore = score; worstMonthIdx = idx; }
  });

  const overallRating = totalGoodCount >= totalBadCount ? 'Vượng khí' : 'Cần bảo toàn';

  // Find best/worst months
  const bestMonth = bestMonthIdx + 1;
  const worstMonth = worstMonthIdx + 1;

  return (
    <section className="result-section result-section--wide detail-section">
      <div className="section-header">
        <div className="section-icon">月</div>
        <div className="section-header-text">
          <h2 className="section-title">Vận Trình 12 Tháng</h2>
          <p className="section-subtitle">Chi tiết từng tháng • Sự nghiệp • Tài chính • Sức khỏe • Tình cảm</p>
        </div>
      </div>

      {/* Summary row */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-card-label">🌟 THÁNG TỐT NHẤT</div>
          <div className="summary-card-value" style={{ color: 'var(--color-good)' }}>Tháng {bestMonth} — {MONTH_RATINGS[bestMonth - 1]}</div>
          <p className="summary-card-desc">Cung {LUNAR_MONTHS[bestMonth - 1]}</p>
        </div>
        <div className="summary-card">
          <div className="summary-card-label">⚠️ CẦN CHÚ Ý NHẤT</div>
          <div className="summary-card-value" style={{ color: 'var(--color-warning)' }}>Tháng {worstMonth} — {MONTH_RATINGS[worstMonth - 1]}</div>
          <p className="summary-card-desc">Cung {LUNAR_MONTHS[worstMonth - 1]}</p>
        </div>
        <div className="summary-card">
          <div className="summary-card-label">🔮 TRUNG BÌNH NĂM</div>
          <div className="summary-card-value">{overallRating}</div>
          <p className="summary-card-desc">Chỉ số tính toàn diện 12 cung</p>
        </div>
      </div>

      {/* Timeline bar */}
      <div className="vt-timeline-bar">
        {MONTH_RATINGS.map((rating, idx) => (
          <div key={idx} className="vt-bar-item" style={{ '--bar-color': MONTH_COLORS[rating] || 'var(--text-muted)' }}>
            <div className="vt-bar-dot"></div>
            <span className="vt-bar-label">T{idx + 1}</span>
          </div>
        ))}
      </div>

      {/* Monthly grid */}
      <div className="vt-month-grid">
        {MONTH_RATINGS.map((rating, idx) => (
          <div key={idx} className="vt-month-card">
            <div className="vt-month-header">
              <span className="vt-month-num">T{idx + 1}</span>
              <span className="vt-month-label">{['Cần thận', 'Tiểu hung'].includes(rating) ? rating : ''}</span>
              <span className="vt-month-rating" style={{ color: MONTH_COLORS[rating] }}>{rating}</span>
            </div>
            <p className="vt-month-desc">{rating}</p>
            <div className="pill-tags" style={{ marginTop: '0.35rem' }}>
              <span className="pill-tag" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>{['Cần thận', 'Tiểu hung'].includes(rating) ? 'Tĩnh' : 'Động'}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ===== PHONG THỦY & VẬT PHẨM =====
export const PhongThuySection = ({ chartData }) => {
  if (!chartData) return null;
  const { userInfo } = chartData;

  // Derive feng shui from Bản Mệnh
  const banMenh = userInfo.banMenhFull?.split(' - ')[0] || 'Kim';
  const HUONG_TOT = {
    'Kim': ['Tây', 'Tây Bắc', 'Đông', 'Nam'],
    'Mộc': ['Đông', 'Đông Nam', 'Bắc', 'Nam'],
    'Thủy': ['Bắc', 'Tây', 'Tây Bắc', 'Đông'],
    'Hỏa': ['Nam', 'Đông', 'Đông Nam', 'Tây Nam'],
    'Thổ': ['Tây Nam', 'Đông Bắc', 'Tây', 'Tây Bắc'],
  };
  const HUONG_KY = {
    'Kim': ['Tây Bắc', 'Tây', 'Đông Bắc', 'Tây Nam'],
    'Mộc': ['Tây', 'Tây Bắc', 'Đông Bắc', 'Tây Nam'],
    'Thủy': ['Nam', 'Tây Nam', 'Đông Bắc', 'Đông Nam'],
    'Hỏa': ['Bắc', 'Tây', 'Tây Bắc', 'Đông Bắc'],
    'Thổ': ['Đông', 'Đông Nam', 'Nam', 'Bắc'],
  };
  const MAU_MAY_MAN = {
    'Kim': ['Trắng', 'Vàng', 'Bạc'],
    'Mộc': ['Xanh lá', 'Xanh dương', 'Đen'],
    'Thủy': ['Đen', 'Xanh dương', 'Trắng'],
    'Hỏa': ['Đỏ', 'Tím', 'Hồng'],
    'Thổ': ['Vàng', 'Nâu', 'Cam'],
  };
  const SO_MAY_MAN = {
    'Kim': [4, 9, 14],
    'Mộc': [3, 8, 13],
    'Thủy': [1, 6, 11],
    'Hỏa': [2, 7, 12],
    'Thổ': [5, 10, 15],
  };

  const huongTot = HUONG_TOT[banMenh] || ['Đông', 'Nam'];
  const huongKy = HUONG_KY[banMenh] || ['Tây', 'Bắc'];
  const mauMay = MAU_MAY_MAN[banMenh] || ['Trắng', 'Vàng'];
  const soMay = SO_MAY_MAN[banMenh] || [4, 9];

  return (
    <section className="result-section result-section--wide detail-section">
      <div className="section-header">
        <div className="section-icon" style={{ color: '#27ae60' }}>☯</div>
        <div className="section-header-text">
          <h2 className="section-title">Phong Thủy & Vật Phẩm</h2>
          <p className="section-subtitle">Hướng tốt • Màu may • Số hợp • Lời khuyên chi tiết</p>
        </div>
      </div>

      <div className="content-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.5rem', background: 'var(--bg-accent-soft)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>☯</span>
          <div>
            <strong>Mệnh {banMenh}</strong>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Mệnh {banMenh} — bạn là "{banMenh === 'Kim' ? 'thanh kiếm sắc bén' : banMenh === 'Mộc' ? 'cây đại thụ' : banMenh === 'Thủy' ? 'dòng nước' : banMenh === 'Hỏa' ? 'ngọn lửa' : 'mặt đất'}"!
              Phong thủy của bạn cần sự thanh thoát, tinh tế, tăng cường năng lượng {banMenh}.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="pill-tags" style={{ marginBottom: '1rem' }}>
        <span className="pill-tag pill-tag--accent">🏠 TỔNG QUAN</span>
        <span className="pill-tag">🏢 NHÀ Ở</span>
        <span className="pill-tag">💼 VĂN PHÒNG</span>
        <span className="pill-tag">💎 TRANG SỨC</span>
      </div>

      <div className="summary-cards">
        <div className="summary-card" style={{ background: 'var(--color-good-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-good)' }}>✔ HƯỚNG TỐT</div>
          <div className="pill-tags" style={{ marginBottom: '0.5rem' }}>
            {huongTot.map((h, i) => <span key={i} className="pill-tag" style={{ fontSize: '0.72rem' }}>{h}</span>)}
          </div>
          <p className="summary-card-desc">Hướng {huongTot[0]} và {huongTot[1]} thuộc {banMenh} — hợp mệnh, tăng tài lộc và sức khỏe.</p>
        </div>
        <div className="summary-card" style={{ background: 'var(--color-danger-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-danger)' }}>✗ HƯỚNG KỴ</div>
          <div className="pill-tags" style={{ marginBottom: '0.5rem' }}>
            {huongKy.slice(0, 3).map((h, i) => <span key={i} className="pill-tag" style={{ fontSize: '0.72rem' }}>{h}</span>)}
          </div>
          <p className="summary-card-desc">Những hướng này xung khắc mệnh {banMenh}, có thể gây trở ngại về tài chính và sức khỏe.</p>
        </div>
        <div className="summary-card" style={{ background: 'var(--color-info-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-info)' }}>🎨 MÀU MAY MẮN</div>
          <div className="pill-tags" style={{ marginBottom: '0.5rem' }}>
            {mauMay.map((m, i) => <span key={i} className="pill-tag" style={{ fontSize: '0.72rem' }}>{m}</span>)}
          </div>
          <p className="summary-card-desc">{mauMay.join(', ')} — tăng cường bản mệnh. Tránh đỏ, hồng (Hỏa khắc {banMenh}).</p>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '1rem' }}>
        <div className="content-card">
          <div className="content-card-title">SỐ MAY MẮN</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {soMay.map((s, i) => (
              <span key={i} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-sm)', fontWeight: 700, color: 'var(--accent)' }}>{s}</span>
            ))}
          </div>
        </div>
        <div className="content-card">
          <div className="content-card-title">MÀU CẦN TRÁNH</div>
          <div className="pill-tags">
            <span className="pill-tag" style={{ fontSize: '0.75rem' }}>🔴 Đỏ</span>
            <span className="pill-tag" style={{ fontSize: '0.75rem' }}>🩷 Hồng</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// ===== THẦN SÁT LUẬN GIẢI =====
export const ThanSatSection = ({ chartData }) => {
  if (!chartData) return null;
  const { board } = chartData;

  let totalTot = 0, totalXau = 0;
  const topTot = [], topXau = [];
  for (const chi of Object.keys(board)) {
    const cung = board[chi];
    totalTot += (cung.saoTot?.length || 0);
    totalXau += (cung.saoXau?.length || 0);
    cung.saoTot?.forEach(s => { if (!s.startsWith('L.') && topTot.length < 5) topTot.push(s); });
    cung.saoXau?.forEach(s => { if (!s.startsWith('L.') && topXau.length < 5) topXau.push(s); });
  }

  const catPercent = Math.round((totalTot / (totalTot + totalXau)) * 100);

  // Count quý nhân stars
  const quyNhanStars = ['Thiên Khôi', 'Thiên Việt', 'Lộc Tồn', 'Thiên Mã', 'Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc'];
  let quyNhanCount = 0;
  const foundQuyNhan = [];
  for (const chi of Object.keys(board)) {
    board[chi].saoTot?.forEach(s => {
      if (quyNhanStars.includes(s) && !foundQuyNhan.includes(s)) {
        foundQuyNhan.push(s);
        quyNhanCount++;
      }
    });
  }

  return (
    <section className="result-section result-section--wide detail-section">
      <div className="section-header">
        <div className="section-icon">煞</div>
        <div className="section-header-text">
          <h2 className="section-title">Thần Sát Luận Giải</h2>
          <p className="section-subtitle">Cát tinh & Hung tinh • Phân tích • Hóa Giải</p>
        </div>
      </div>

      <div className="content-card">
        <p>Hệ Thần Sát của bạn nghiêng rõ về cát tinh với {totalTot} sao tốt đang đỡ lực. Ngay cung Mệnh có chính tinh, nên nền bảo hộ và quý nhân khá dày.</p>
      </div>

      <div className="content-card" style={{ marginTop: '1rem', background: 'var(--color-good-bg)' }}>
        <div className="content-card-title" style={{ color: 'var(--color-good)' }}>☆ Cát Tinh Chiếm Ưu Thế</div>
        <p>Trong hệ Thần Sát, lá số có {totalTot} cát tinh chiếm ưu thế với sức mạnh trung bình {catPercent}%. Các sao tốt bảo vệ và hỗ trợ mạnh, giúp giảm đáng kể tác động của hung tinh trong những chỗ then chốt.</p>
      </div>

      <div className="grid-2" style={{ marginTop: '1rem' }}>
        <div className="content-card" style={{ textAlign: 'center' }}>
          <div className="content-card-title" style={{ color: 'var(--color-good)' }}>● CÁT TINH</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-good)' }}>{totalTot}</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>sao</p>
        </div>
        <div className="content-card" style={{ textAlign: 'center' }}>
          <div className="content-card-title" style={{ color: 'var(--color-danger)' }}>● HUNG TINH</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-danger)' }}>{totalXau}</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>sao</p>
        </div>
      </div>

      <div className="pill-tags" style={{ marginTop: '1rem' }}>
        {topTot.slice(0, 4).map((s, i) => <span key={i} className="pill-tag">★ {s}</span>)}
        {topXau.slice(0, 1).map((s, i) => <span key={`x${i}`} className="pill-tag" style={{ color: 'var(--color-danger)' }}>★ {s}</span>)}
        <span className="pill-tag">+{totalTot + totalXau - 5} sao khác</span>
      </div>

      <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Phần luận giải chi tiết từng cát tinh, hung tinh và hướng hóa giải đã được gom vào popup để section này gọn hơn trên trang.
      </p>

      {/* Quý Nhân section */}
      <div style={{ marginTop: '2rem' }}>
        <div className="section-header">
          <div className="section-icon">貴</div>
          <div className="section-header-text">
            <h2 className="section-title">Quý Nhân Phù Hộ</h2>
            <p className="section-subtitle">Ai giúp bạn • Phương hướng • Cách kích hoạt</p>
          </div>
        </div>

        <div className="content-card" style={{ background: 'var(--color-good-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--color-good)' }}>Tốt</span>
            <span className="pill-tag pill-tag--accent">{quyNhanCount} quý nhân tinh</span>
          </div>
          <p style={{ fontSize: '0.9rem' }}>
            <span style={{ fontSize: '1.1rem' }}>🔥</span> Quý nhân vẫn RẤT MẠNH! Có {quyNhanCount} quý nhân tinh. Cả đời gặp nhiều người giúp đỡ, "trong cơn hoạn nạn có người nâng đỡ". Đây là phúc phần hiếm có!
          </p>
        </div>

        <div className="summary-cards" style={{ marginTop: '1rem' }}>
          <div className="summary-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>{quyNhanCount}</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quý nhân</p>
          </div>
          <div className="summary-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>2</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sao cống</p>
          </div>
          <div className="summary-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>5</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cung có QN</p>
          </div>
        </div>

        <div className="pill-tags" style={{ marginTop: '1rem' }}>
          {foundQuyNhan.slice(0, 4).map((s, i) => <span key={i} className="pill-tag pill-tag--accent">★ {s}</span>)}
          {foundQuyNhan.length > 4 && <span className="pill-tag">+{foundQuyNhan.length - 4} quý nhân khác</span>}
        </div>
      </div>
    </section>
  );
};

// ===== ĐIỀN TRẠCH & NHÀ ĐẤT =====
export const DienTrachSection = ({ chartData }) => {
  if (!chartData) return null;
  const { board } = chartData;
  const { cung: dienTrach, chi } = findCungByName(board, 'Điền Trạch');
  const starTags = getStarBrightnessTags(dienTrach?.saoChinh || []);
  const isVoChinhDieu = starTags.length === 0;

  const rating = isVoChinhDieu ? 'Cần xem thêm' : 'Tạm ổn';

  // Count stars
  const numChinh = dienTrach?.saoChinh?.length || 0;
  const numTot = dienTrach?.saoTot?.length || 0;
  const numXau = dienTrach?.saoXau?.length || 0;

  return (
    <section className="result-section result-section--wide detail-section">
      <div className="section-header">
        <div className="section-icon">宅</div>
        <div className="section-header-text">
          <h2 className="section-title">Điền Trạch & Nhà Đất</h2>
          <p className="section-subtitle">Phân tích cung Điền Trạch • Bất động sản • Hướng tốt</p>
        </div>
      </div>

      <div className="content-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="pill-tag pill-tag--accent">{rating}</span>
          <span style={{ fontWeight: 600 }}>Cung Điền Trạch</span>
        </div>
        <div className="pill-tags" style={{ marginBottom: '0.75rem' }}>
          <span className="pill-tag">🏠 Hướng tốt: Tây Nam</span>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
          {isVoChinhDieu
            ? '🌀 Cung Điền Trạch vô chính diệu, cần xem tam hợp chiếu để đánh giá chi tiết.'
            : `🌀 Vận nhà đất khá tốt. Cung Điền cho thấy có khả năng sở hữu nhà. Đại Vận Điền Trạch: 34-43 tuổi. Nắm đúng thời cơ, chọn đúng hướng — "nhà chọn hướng tốt, nhịp thuận hơn."`
          }
        </p>

        <div className="summary-cards" style={{ marginTop: '1rem' }}>
          <div className="summary-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>{numChinh}</div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sao chính</p>
          </div>
          <div className="summary-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-good)' }}>{numTot}</div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Thuận lợi</p>
          </div>
          <div className="summary-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-danger)' }}>{numXau}</div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Lưu ý</p>
          </div>
        </div>
      </div>

      <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Phần luận giải dài về vận nhà đất, phong thủy và chiến lược đầu tư được gom vào popup để layout không bị trải dài.
      </p>
    </section>
  );
};
