import React from 'react';
import './VanHanSection.css';
import { getStarBrightnessTags } from '../utils/analysisContent';
import { getStarMeaning } from '../utils/starDictionary';


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
  
  // Lấy thêm các sao phụ nếu không có sao chính để luận giải
  const allDaiHanStars = [
    ...(daiHanCung?.saoChinh || []),
    ...(daiHanCung?.saoTot || []),
    ...(daiHanCung?.saoXau || [])
  ];

  console.log("Debug - Dai Han Cung:", daiHanCungName);
  console.log("Debug - Stars found:", allDaiHanStars);

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
            {hasTieuHanGoodStars ? 'Cơ hội & Nắm bắt' : 'Quan sát & Chọn lọc'}
          </h3>
          
          <div className="vh-overview-text">
            {daiHanStars.length > 0 && getStarMeaning(daiHanStars[0].name) ? (
              <p>
                {getStarMeaning(daiHanStars[0].name).overview} 
                Giai đoạn này, con đang được soi chiếu qua lăng kính của {daiHanStars.map(s => s.name).join(', ')}.
              </p>
            ) : (
              <p>
                Nhìn chung, giai đoạn {daiHanRange} của con đang có sự dịch chuyển năng lượng mạnh mẽ. 
                {hasDaiHanGoodStars 
                  ? " Các bộ sao cát tinh đang hội tụ, hứa hẹn nhiều cơ hội về tài lộc và quý nhân." 
                  : " Đây là giai đoạn cần sự tĩnh tâm, quan sát kỹ lưỡng trước khi đưa ra các quyết định lớn."}
              </p>
            )}
          </div>


          <div className="vh-overview-list">
            {daiHanStars.length > 0 && getStarMeaning(daiHanStars[0].name) ? (
              <>
                <div className="vh-list-item">
                  <span className="vh-list-num">1</span>
                  <span>{getStarMeaning(daiHanStars[0].name).advice}</span>
                </div>
                <div className="vh-list-item">
                  <span className="vh-list-num">2</span>
                  <span>{getStarMeaning(daiHanStars[0].name).warning}</span>
                </div>
                <div className="vh-list-item">
                  <span className="vh-list-num">3</span>
                  <span>Nhìn tổng thể bản cờ vận hạn, Đại Vận đang hướng năng lượng vào cung {daiHanCungName}.</span>
                </div>
                <div className="vh-list-item">
                  <span className="vh-list-num">4</span>
                  <span>Chiến lược phù hợp lúc này là chọn lọc cơ hội, ưu tiên việc nắm chắc phần thắng.</span>
                </div>
                <div className="vh-list-item">
                  <span className="vh-list-num">5</span>
                  <span>{hasTieuHanGoodStars ? 'Hóa Lộc chiếu vận mở thêm đường tài vận.' : 'Cần giữ gìn cẩn thận tài sản và các mối quan hệ.'}</span>
                </div>
              </>
            ) : daiHanStars.length > 0 ? (
               <>
                <div className="vh-list-item">
                  <span className="vh-list-num">1</span>
                  <span>Phát huy sức mạnh của bộ sao {daiHanStars[0].name} đang tọa thủ.</span>
                </div>
                <div className="vh-list-item">
                  <span className="vh-list-num">2</span>
                  <span>Cẩn trọng các tác động từ cung tam hợp và xung chiếu.</span>
                </div>
                <div className="vh-list-item">
                  <span className="vh-list-num">3</span>
                  <span>Giai đoạn này cần sự kiên nhẫn và quan sát kỹ lưỡng trước khi hành động.</span>
                </div>
                <div className="vh-list-item">
                  <span className="vh-list-num">4</span>
                  <span>Tập trung vào việc bồi đắp kỹ năng cá nhân và các mối quan hệ cốt lõi.</span>
                </div>
                <div className="vh-list-item">
                  <span className="vh-list-num">5</span>
                  <span>{hasTieuHanGoodStars ? 'Vận trình có nhiều khởi sắc về tài lộc.' : 'Giữ vững tâm thế bình thản trước những biến động.'}</span>
                </div>
              </>
            ) : (
              [1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="vh-list-item ai-shimmer">
                  <span className="vh-list-num">{num}</span>
                  <span className="shimmer-line"></span>
                </div>
              ))
            )}
          </div>



          <div className="vh-overview-tags">
            <span className="vh-ov-tag">AI LUẬN GIẢI</span>
            <span className="vh-ov-tag">{hasTieuHanGoodStars ? 'CÁT LỢI' : 'THẬN TRỌNG'}</span>
          </div>

        </div>
        
        <div className="vh-overview-image-wrapper">
           <img src="/assets/images/van-han-hien-tai.jpg" alt="Compass" className="vh-overview-image" />
           <div className="vh-overview-fade"></div>
        </div>
      </div>

      {/* Two cards: Tiểu Hạn + Đại Vận */}
      <div className="vh-dual-cards" style={{ marginTop: '1.5rem' }}>
        {/* Tiểu Hạn */}
        <div className="vh-han-card">
          <div className="vh-han-img-wrapper">
             <img src="/assets/images/van-han-hien-tai.jpg" alt="Tiểu Hạn" className="vh-han-img" />
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
                <p className="action-card-text">
                  {tieuHanStars.length > 0 ? `Bồi đắp năng lượng cho bộ sao ${tieuHanStars[0].name}.` : 'Giữ tâm thế bình tĩnh, quan sát thời cuộc.'}
                </p>
              </div>
              <div className="action-card action-card--warning">
                <div className="action-card-label">CẦN TRÁNH</div>
                <p className="action-card-text">
                  {tieuHanCung?.saoXau?.length > 0 ? `Lưu ý các tác động từ ${tieuHanCung.saoXau[0]}.` : 'Tránh quyết định vội vàng trong đầu tư.'}
                </p>
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
             <img src="/assets/images/dai-van.jpg" alt="Đại Vận" className="vh-han-img" />
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
                <p className="action-card-text">
                  {daiHanStars.length > 0 ? `Phát huy sức mạnh của ${daiHanStars[0].name} tại cung ${daiHanCungName}.` : 'Xây dựng nền tảng vững chắc cho tương lai.'}
                </p>
              </div>
              <div className="action-card action-card--warning">
                <div className="action-card-label">CẦN TRÁNH</div>
                <p className="action-card-text">
                  {daiHanCung?.saoXau?.length > 0 ? `Cẩn trọng hạn từ ${daiHanCung.saoXau[0]}.` : 'Hạn chế thay đổi công việc đột ngột.'}
                </p>
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
