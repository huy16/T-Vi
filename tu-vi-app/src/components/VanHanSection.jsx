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

      {/* Tổng Quan Giai Đoạn - Hero Card */}
      <div className="vh-overview-card">
        <div className="vh-overview-content">
          <div className="vh-overview-badge-wrapper">
             <div className="vh-badge-icon">今</div>
             <div className="vh-badge-text">TỔNG QUAN GIAI ĐOẠN</div>
          </div>
          <div className="vh-overview-meta">
            {tuoi} tuổi • Giai đoạn {daiHanRange} • Năm 2026.
          </div>
          
          <h3 className="vh-overview-title">
            {hasTieuHanGoodStars ? 'Nắm bắt — Giai đoạn hiện tại' : 'Chọn lọc — Giai đoạn hiện tại'}
          </h3>
          
          <div className="vh-overview-text">
            <p>
              Nên lấy sự nghiệp làm mũi nhọn, nhưng muốn vận đi bền thì phải giữ chắc sức khỏe trước đã. 
              {hasTieuHanGoodStars ? ' Dòng tiền lưu thông tốt, hợp mở rộng sinh kế.' : ' Việc nên ưu tiên trước là giữ nghiêm kỷ luật quản lý tiền bạc.'}
            </p>
            <p>
              Tháng 2 Âm lịch: tháng khá thuận. Đây là lúc nên ưu tiên xử lý những việc quan trọng còn treo — chốt hợp đồng, ký kết.
            </p>
            <p>
              {daiHanStars.length > 0 
                ? `Cổ nhân từng viết: "${daiHanStars[0].name} ${daiHanStars[0].brightness === 'M' || daiHanStars[0].brightness === 'V' ? 'cô cương, tướng quân xuất chinh' : 'tọa thủ, cần xem tam hợp'}". Nhìn toàn cục, giai đoạn này khá sáng, đủ lực để đẩy việc tiến lên nếu biết chọn trọng tâm.`
                : 'Giai đoạn này cung vô chính diệu, cần xem tam hợp chiếu để đánh giá chính xác.'}
            </p>
          </div>

          <div className="vh-overview-list">
            <div className="vh-list-item">
              <span className="vh-list-num">1</span>
              <span>Nhìn tổng thể bản cờ vận hạn, Đại Vận đang hướng năng lượng vào sức bền tinh thần.</span>
            </div>
            <div className="vh-list-item">
              <span className="vh-list-num">2</span>
              <span>Chiến lược phù hợp lúc này là chọn lọc cơ hội, ưu tiên việc nắm chắc phần thắng.</span>
            </div>
            <div className="vh-list-item">
              <span className="vh-list-num">3</span>
              <span>Về cặp sao chủ đạo, {daiHanStars.length > 0 ? `${daiHanStars[0].name} của Đại Vận mang chất "sao tướng soái".` : 'cần giữ sự ổn định và kiên nhẫn.'}</span>
            </div>
            <div className="vh-list-item">
              <span className="vh-list-num">4</span>
              <span>Điều nên tránh trước là đầu cơ mạo hiểm, khinh suất tin người.</span>
            </div>
            <div className="vh-list-item">
              <span className="vh-list-num">5</span>
              <span>{hasTieuHanGoodStars ? 'Hóa Lộc chiếu vận mở thêm đường tài vận.' : 'Cần giữ gìn cẩn thận tài sản và các mối quan hệ.'}</span>
            </div>
          </div>

          <div className="vh-overview-tags">
            <span className="vh-ov-tag">CHỌN LỌC</span>
            <span className="vh-ov-tag">GIAI ĐOẠN HIỆN TẠI</span>
          </div>
        </div>
        
        <div className="vh-overview-image-wrapper">
           <img src="/assets/images/van-han-hien-tai.png" alt="Compass" className="vh-overview-image" />
           <div className="vh-overview-fade"></div>
        </div>
      </div>

      {/* Two cards: Tiểu Hạn + Đại Vận */}
      <div className="vh-dual-cards" style={{ marginTop: '1.5rem' }}>
        {/* Tiểu Hạn */}
        <div className="vh-han-card">
          <div className="vh-han-img-wrapper">
             <img src="/assets/images/van-han-hien-tai.png" alt="Tiểu Hạn" className="vh-han-img" />
             <div className="vh-han-img-overlay"></div>
          </div>
          <div className="vh-han-content-inner">
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
        </div>

        {/* Đại Vận */}
        <div className="vh-han-card vh-han-card--dai">
          <div className="vh-han-img-wrapper">
             <img src="/assets/images/dai-van.png" alt="Đại Vận" className="vh-han-img" />
             <div className="vh-han-img-overlay"></div>
          </div>
          <div className="vh-han-content-inner">
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
      </div>

    </section>
  );
};

export default VanHanSection;
