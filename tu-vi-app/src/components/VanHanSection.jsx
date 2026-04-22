import React from 'react';
import './VanHanSection.css';
import { getStarBrightnessTags } from '../utils/analysisContent';

const VanHanSection = ({ chartData }) => {
  if (!chartData) return null;
  const { board, userInfo } = chartData;

  // Find current tieuHan and daiVan positions
  const solarYear = userInfo.solarYear || userInfo.year;
  const tuoi = 2026 - solarYear + 1;

  // Find cung that has the current Tiểu Hạn (empty tieuHan means it's not highlighted)
  let tieuHanCung = null;
  let tieuHanChi = null;
  for (const chi of Object.keys(board)) {
    const cung = board[chi];
    // The cung that contains the year 2026's Tiểu Hạn
    if (cung.tieuHan === 'Th.1' || !tieuHanCung) {
      // We need to find the cung where LN.MỆNH is
      if (cung.luuNien === 'LN.MỆNH') {
        tieuHanCung = cung;
        tieuHanChi = chi;
      }
    }
  }

  // Find current Đại Hạn position
  let daiHanCung = null;
  let daiHanChi = null;
  let daiHanRange = '';
  for (const chi of Object.keys(board)) {
    const cung = board[chi];
    if (cung.daiHan && typeof cung.daiHan === 'number') {
      const startAge = cung.daiHan;
      if (tuoi >= startAge && tuoi < startAge + 10) {
        daiHanCung = cung;
        daiHanChi = chi;
        daiHanRange = `${startAge}-${startAge + 9} tuổi`;
      }
    }
  }

  const tieuHanStars = getStarBrightnessTags(tieuHanCung?.saoChinh || []);
  const daiHanStars = getStarBrightnessTags(daiHanCung?.saoChinh || []);

  const tieuHanCungName = tieuHanCung?.tenCung?.split(' /')[0]?.split(' <')[0]?.trim() || 'Chưa xác định';
  const daiHanCungName = daiHanCung?.tenCung?.split(' /')[0]?.split(' <')[0]?.trim() || 'Chưa xác định';

  // Simple analysis based on stars
  const hasTieuHanGoodStars = tieuHanCung?.saoTot?.some(s => 
    s.includes('Hóa Lộc') || s.includes('Lộc Tồn') || s.includes('Thiên Khôi')
  );
  const hasDaiHanGoodStars = daiHanCung?.saoTot?.some(s => 
    s.includes('Hóa Lộc') || s.includes('Lộc Tồn') || s.includes('Thiên Phúc')
  );

  const tieuHanRating = hasTieuHanGoodStars ? 'Chọn lọc' : 'Cần thận trọng';
  const daiHanRating = hasDaiHanGoodStars ? 'Khá thuận' : 'Bình hòa';

  return (
    <section className="result-section result-section--wide vanhan-section">
      {/* Section Header */}
      <div className="section-header">
        <div className="section-icon">⟡</div>
        <div className="section-header-text">
          <h2 className="section-title">Vận Hạn Hiện Tại</h2>
          <p className="section-subtitle">
            Đài hạn: sức bền tinh thần và chất lượng nội tâm. Năm nay: dòng tiền, nợ và tích lũy.
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="pill-tags">
        <span className="pill-tag pill-tag--accent">{tuoi} tuổi</span>
        <span className="pill-tag">Giai đoạn {daiHanRange}</span>
        <span className="pill-tag">Năm 2026.</span>
      </div>

      {/* Kết luận nhanh */}
      <div className="content-card content-card--accent">
        <div className="content-card-title" style={{ color: 'var(--color-danger)' }}>KẾT LUẬN NHANH</div>
        <p>
          Trận địa dài hạn, sức bền tinh thần và chất lượng nội tâm — cung {daiHanCungName} là tâm.
          {hasTieuHanGoodStars ? ' Hóa Lộc chiếu vận — dòng tiền dễ lưu thông hơn thường lệ, hợp mở rộng sinh kế.' 
            : ' Cần kiên nhẫn và giữ kỷ luật trong giai đoạn này.'}
        </p>
      </div>

      {/* Nhịp tháng */}
      <div className="content-card content-card--accent">
        <div className="content-card-title" style={{ color: 'var(--color-good)' }}>NHỊP THÁNG HIỆN TẠI</div>
        <p>
          Tháng 2 Âm lịch: tháng khá thuận. Đây là lúc nên ưu tiên xử lý những việc quan trọng còn treo — chốt hợp đồng, ký kết.
        </p>
      </div>

      {/* Phân tích nền */}
      <div className="content-card content-card--accent">
        <div className="content-card-title">PHÂN TÍCH NỀN</div>
        <p>
          {daiHanStars.length > 0 
            ? `Cổ nhân từng viết: "${daiHanStars[0].name} ${daiHanStars[0].brightness === 'M' || daiHanStars[0].brightness === 'V' ? 'cô cương, tướng quân xuất chinh' : 'tọa thủ, cần xem tam hợp'}". Giai đoạn này mang sắc thái khá sáng, đủ lực để đẩy việc lên thêm một nấc nếu chủ động.`
            : 'Giai đoạn này cung vô chính diệu, cần xem tam hợp chiếu để đánh giá chính xác.'}
        </p>
      </div>

      {/* Two cards: Tiểu Hạn + Đại Vận */}
      <div className="vh-dual-cards">
        {/* Tiểu Hạn */}
        <div className="vh-han-card">
          <div className="vh-han-header">
            <span className="vh-han-icon">卦</span>
            <span className="vh-han-title">Tiểu Hạn</span>
            <span className={`vh-han-badge ${hasTieuHanGoodStars ? 'vh-han-badge--good' : 'vh-han-badge--neutral'}`}>
              {tieuHanRating}
            </span>
          </div>
          <p className="vh-han-meta">Năm 2026 • Cung {tieuHanCungName} ({tieuHanChi})</p>
          <div className="vh-han-stars">
            {tieuHanStars.map((s, i) => (
              <span key={i} className="pill-tag">{s.name}</span>
            ))}
            {tieuHanStars.length === 0 && <span className="pill-tag pill-tag--accent">Vô chính diệu</span>}
          </div>

          <div className="vh-han-note">
            <div className="content-card-title">ĐIỂM ĐÁNG CHÚ Ý</div>
            <p>Tiểu hạn {tieuHanStars.length > 0 ? `nhiều biến động — Năm 2026, ${tieuHanStars[0].name}.` : 'cần xem tam hợp chiếu.'}</p>
          </div>

          <div className="action-grid">
            <div className="action-card action-card--good">
              <div className="action-card-label">NÊN ƯU TIÊN</div>
              <p className="action-card-text">Giữ nghiêm kỷ luật quản lý tiền bạc.</p>
            </div>
            <div className="action-card action-card--warning">
              <div className="action-card-label">CẦN TRÁNH</div>
              <p className="action-card-text">Đầu cơ mạo hiểm, khinh suất tin người.</p>
            </div>
          </div>

          <div className="link-arrow" style={{ marginTop: '1rem' }}>
            <span>XEM PHÂN TÍCH SÂU</span>
            <span>→</span>
          </div>
        </div>

        {/* Đại Vận */}
        <div className="vh-han-card vh-han-card--dai">
          <div className="vh-han-header">
            <span className="vh-han-icon">☰</span>
            <span className="vh-han-title">Đại Vận</span>
            <span className={`vh-han-badge ${hasDaiHanGoodStars ? 'vh-han-badge--good' : 'vh-han-badge--neutral'}`}>
              {daiHanRating}
            </span>
          </div>
          <p className="vh-han-meta">{daiHanRange} • Cung {daiHanCungName} ({daiHanChi})</p>
          <div className="vh-han-stars">
            {daiHanStars.map((s, i) => (
              <span key={i} className="pill-tag">{s.name}</span>
            ))}
            {daiHanStars.length === 0 && <span className="pill-tag pill-tag--accent">Vô chính diệu</span>}
          </div>

          <div className="vh-han-note">
            <div className="content-card-title" style={{ color: 'var(--accent)' }}>ĐIỂM ĐÁNG CHÚ Ý</div>
            <p>Đại vận bình hòa — {daiHanStars.length > 0 ? `${daiHanStars[0].name} giữ thế ổn tại ${daiHanCungName}, cục diện bền vững.` : `Cung vô chính diệu, cần xem tam hợp.`}</p>
          </div>

          <div className="action-grid">
            <div className="action-card action-card--good">
              <div className="action-card-label">NÊN ƯU TIÊN</div>
              <p className="action-card-text">Bồi đắp phúc khí dòng tộc tổ tiên.</p>
            </div>
            <div className="action-card action-card--warning">
              <div className="action-card-label">CẦN TRÁNH</div>
              <p className="action-card-text">Mê tín dị đoan thái quá.</p>
            </div>
          </div>

          <div className="link-arrow" style={{ marginTop: '1rem' }}>
            <span>XEM PHÂN TÍCH SÂU</span>
            <span>→</span>
          </div>
        </div>
      </div>

      {/* Nước đi nên chốt */}
      <div className="content-card" style={{ marginTop: '1.5rem' }}>
        <div className="content-card-title">NƯỚC ĐI NÊN CHỐT</div>
        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Các bước ưu tiên để đi qua giai đoạn hiện tại gọn hơn, ít hao lực hơn.
        </p>
        <div className="step-list">
          <div className="step-item">
            <span className="step-number">1</span>
            <span className="step-text">Nhìn tổng thể bản cờ vận hạn, Đại Vận đang hướng năng lượng vào sức bền tinh thần.</span>
          </div>
          <div className="step-item">
            <span className="step-number">2</span>
            <span className="step-text">Chiến lược phù hợp lúc này là chọn lọc cơ hội, ưu tiên việc nắm chắc phần thắng.</span>
          </div>
          <div className="step-item">
            <span className="step-number">3</span>
            <span className="step-text">Về cặp sao chủ đạo, {daiHanStars.length > 0 ? `${daiHanStars[0].name} của Đại Vận mang chất "sao tướng soái".` : 'cần giữ sự ổn dịnh và kiên nhẫn.'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VanHanSection;
