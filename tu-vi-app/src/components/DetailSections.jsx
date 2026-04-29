import React from 'react';
import './DetailSections.css';
import { getCareerAnalysis, getLoveAnalysis, getWealthAnalysis, getHealthAnalysis, getStarBrightnessTags } from '../utils/analysisContent';
import { getStarMeaning } from '../utils/starDictionary';
// ===== HELPER: find cung by name =====
const findCungByName = (board, name) => {
  for (const chi of Object.keys(board)) {
    const cung = board[chi];
    const tenCung = cung.tenCung?.split(' /')[0]?.split(' <')[0]?.trim();
    if (tenCung === name) return { cung, chi };
  }
  return { cung: null, chi: null };
};

// ===== SỰ NGHIỆP & NGHỀ PHÙ HỢP =====
export const SuNghiepSection = ({ chartData }) => {
  if (!chartData) return null;
  const { board, menhPos } = chartData;
  const { cung: quanLoc } = findCungByName(board, 'Quan Lộc');
  const menhCung = board[menhPos];
  const analysis = getCareerAnalysis(quanLoc, menhCung, chartData);
  const starTags = getStarBrightnessTags(analysis.stars);

  return (
    <section className="result-section result-section--wide detail-section career-section">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">官</div>
        <div className="section-header-text">
          <h2 className="section-title">Sự Nghiệp & Nghề Phù Hợp</h2>
          <p className="section-subtitle">Khí chất nghề • Hướng hợp • Dòng tiền • Nhịp phát triển</p>
        </div>
      </div>

      {/* Star tags */}
      <div className="pill-tags">
        <span className="pill-tag pill-tag--accent">Cung Quan Lộc</span>
        <span className="pill-tag">Hợp tự chủ cao</span>
        {starTags.map((tag, i) => (
          <span key={i} className="pill-tag">{tag.name} {tag.label ? `(${tag.label})` : ''}</span>
        ))}
      </div>

      {/* Headline */}
      <div className="detail-headline">
        <h3>{analysis.headline}</h3>
        <p>{analysis.subline}</p>
      </div>

      {/* 3 summary cards */}
      <div className="summary-cards">
        <div className="summary-card" style={{ background: 'var(--color-info-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-info)' }}>MÔ HÌNH HỢP</div>
          <div className="summary-card-value">{analysis.model}</div>
          <p className="summary-card-desc">{analysis.modelDesc}</p>
        </div>
        <div className="summary-card" style={{ background: 'var(--bg-accent-soft)' }}>
          <div className="summary-card-label" style={{ color: 'var(--accent)' }}>HƯỚNG HỢP</div>
          <div className="summary-card-value">{starTags.length > 0 ? starTags[0].name : 'Linh hoạt'}</div>
          <p className="summary-card-desc">{starTags.length > 0 ? `${starTags[0].name} (${starTags[0].label || 'Tọa'}) tại Quan Lộc.` : 'Cung vô chính diệu.'}</p>
        </div>
        <div className="summary-card" style={{ background: 'var(--color-warning-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-warning)' }}>THẾ LỰC</div>
          <div className="summary-card-value">{analysis.isStrong ? 'Lực tự thân mạnh' : 'Phụ thuộc tam hợp'}</div>
          <p className="summary-card-desc">{analysis.isStrong ? 'Chính tinh miếu vượng' : 'Cần mượn thế lực bên ngoài'}</p>
        </div>
      </div>

      <div className="summary-cards" style={{ marginTop: '1rem' }}>
        <div className="summary-card" style={{ background: 'var(--color-good-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-good)' }}>TRỢ LỰC SỰ NGHIỆP</div>
          <div className="summary-card-value">{quanLoc?.saoTot?.length || 0} Trợ Tinh</div>
          <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {quanLoc?.saoTot?.slice(0, 3).map((s, i) => {
              const cleanName = s.replace(/^(L\.)+/, '').split(' (')[0].trim();
              const meaning = getStarMeaning(cleanName);
              return (
                <div key={i}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-good)' }}>{s}:</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>{meaning ? meaning.overview : 'Mang lại cơ hội và thăng tiến.'}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="summary-card" style={{ background: 'var(--color-danger-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-danger)' }}>CẢN TRỞ & THỬ THÁCH</div>
          <div className="summary-card-value">{quanLoc?.saoXau?.length || 0} Sát Tinh</div>
          <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {quanLoc?.saoXau?.slice(0, 3).map((s, i) => {
              const cleanName = s.replace(/^(L\.)+/, '').split(' (')[0].trim();
              const meaning = getStarMeaning(cleanName);
              return (
                <div key={i}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-danger)' }}>{s}:</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>{meaning ? meaning.overview : 'Gây áp lực, thử thách trong công việc.'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail text */}
      <div className="content-card" style={{ marginTop: '1rem' }}>
        <p><strong style={{ color: 'var(--accent)' }}>Điểm Tựa Sự Nghiệp:</strong> {analysis.diemManhNghe}</p>
        <p style={{ marginTop: '0.75rem' }}><strong style={{ color: 'var(--color-warning)' }}>Rủi Ro Cần Tránh:</strong> {analysis.diemCanGiu}</p>
        <p style={{ marginTop: '0.75rem' }}><strong style={{ color: 'var(--color-good)' }}>Chiến Lược Hành Động:</strong> {analysis.nuocDi}</p>
      </div>
    </section>
  );
};

// ===== TÌNH DUYÊN =====
export const TinhDuyenSection = ({ chartData }) => {
  if (!chartData) return null;
  const { board, menhPos } = chartData;
  const { cung: phuThe } = findCungByName(board, 'Phu Thê');
  const menhCung = board[menhPos];
  const analysis = getLoveAnalysis(phuThe, menhCung, chartData);
  const starTags = getStarBrightnessTags(analysis.stars);

  return (
    <section className="result-section result-section--wide detail-section love-section">
      <div className="section-header">
        <div className="section-icon" style={{ color: '#c0392b' }}>緣</div>
        <div className="section-header-text">
          <h2 className="section-title">Tình Duyên</h2>
          <p className="section-subtitle">Trục phu thê • Gu yêu • Mẫu người hợp • Cách giữ nhịp quan hệ</p>
        </div>
      </div>

      <div className="pill-tags">
        <span className="pill-tag pill-tag--accent">Cung Phu Thê</span>
        <span className="pill-tag">{analysis.status}</span>
        {starTags.map((tag, i) => (
          <span key={i} className="pill-tag">{tag.name} ({tag.label || 'Đang mạnh'})</span>
        ))}
      </div>

      <div className="detail-headline">
        <h3>{analysis.headline}</h3>
        <p>Tình yêu với bạn không chỉ là chuyện hợp hay không hợp.</p>
      </div>

      <div className="summary-cards">
        <div className="summary-card" style={{ background: 'var(--bg-accent-soft)' }}>
          <div className="summary-card-label" style={{ color: 'var(--accent)' }}>TRẠNG THÁI TÌNH DUYÊN</div>
          <div className="summary-card-value">{analysis.status}</div>
        </div>
        <div className="summary-card" style={{ background: 'var(--color-info-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-info)' }}>ẢNH HƯỞNG CHÍNH</div>
          <div className="summary-card-value">{starTags[0]?.name || 'Vô Chính Diệu'}</div>
          <p className="summary-card-desc">Tọa ở Phu Thê</p>
        </div>
      </div>

      <div className="summary-cards" style={{ marginTop: '1rem' }}>
        <div className="summary-card" style={{ background: 'var(--color-good-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-good)' }}>YẾU TỐ HÒA HỢP</div>
          <div className="summary-card-value">{phuThe?.saoTot?.length || 0} Trợ Tinh</div>
          <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {phuThe?.saoTot?.slice(0, 3).map((s, i) => {
              const cleanName = s.replace(/^(L\.)+/, '').split(' (')[0].trim();
              const meaning = getStarMeaning(cleanName);
              return (
                <div key={i}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-good)' }}>{s}:</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>{meaning ? meaning.overview : 'Thúc đẩy tình cảm gắn kết.'}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="summary-card" style={{ background: 'var(--color-danger-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-danger)' }}>YẾU TỐ XUNG KHẮC</div>
          <div className="summary-card-value">{phuThe?.saoXau?.length || 0} Sát Tinh</div>
          <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {phuThe?.saoXau?.slice(0, 3).map((s, i) => {
              const cleanName = s.replace(/^(L\.)+/, '').split(' (')[0].trim();
              const meaning = getStarMeaning(cleanName);
              return (
                <div key={i}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-danger)' }}>{s}:</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>{meaning ? meaning.overview : 'Dễ gây hiểu lầm, xa cách.'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="content-card" style={{ marginTop: '1rem' }}>
        <p><strong style={{ color: 'var(--accent)' }}>Điểm hợp:</strong> {analysis.diemHop}</p>
        <p style={{ marginTop: '0.75rem' }}><strong style={{ color: 'var(--color-warning)' }}>Dễ lệch nhịp:</strong> {analysis.deLechNhip}</p>
        <p style={{ marginTop: '0.75rem' }}><strong style={{ color: 'var(--color-good)' }}>Nguyên tắc nên giữ:</strong> {analysis.nguyenTac}</p>
      </div>
    </section>
  );
};

// ===== TÀI LỘC =====
export const TaiLocSection = ({ chartData }) => {
  if (!chartData) return null;
  const { board, menhPos } = chartData;
  const { cung: taiBach } = findCungByName(board, 'Tài Bạch');
  const menhCung = board[menhPos];
  const analysis = getWealthAnalysis(taiBach, menhCung, chartData);
  const starTags = getStarBrightnessTags(analysis.stars);

  return (
    <section className="result-section result-section--wide detail-section wealth-section">
      <div className="section-header">
        <div className="section-icon">財</div>
        <div className="section-header-text">
          <h2 className="section-title">Tài Lộc</h2>
          <p className="section-subtitle">Cung Tài Bạch • Đường tiền, nhịp giữ tiền và thể tích sản</p>
        </div>
      </div>

      <div className="pill-tags">
        <span className="pill-tag pill-tag--accent">Kiểu kiếm tiền chắc tay</span>
        {starTags.map((tag, i) => (
          <span key={i} className="pill-tag">{tag.name} ({tag.label || 'Tọa'})</span>
        ))}
      </div>

      <div className="content-card content-card--accent">
        <div className="content-card-title">KẾT LUẬN NHANH</div>
        <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-heading)' }}>{analysis.headline}</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{analysis.subline}</p>
      </div>

      <div className="summary-cards">
        <div className="summary-card" style={{ background: 'var(--color-good-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-good)' }}>NGUỒN THU NÊN ƯU TIÊN</div>
          <div className="summary-card-value">{analysis.nguonThu}</div>
          <p className="summary-card-desc">{analysis.nguonThuDesc}</p>
        </div>
        <div className="summary-card" style={{ background: 'var(--color-danger-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-danger)' }}>ĐIỂM RÒ CẦN CHẶN</div>
          <div className="summary-card-value">Điểm hao không nằm ở một cú sốc lớn</div>
          <p className="summary-card-desc">{analysis.diemRo}</p>
        </div>
        <div className="summary-card" style={{ background: 'var(--color-info-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-info)' }}>NHỊP NÊN GIỮ</div>
          <div className="summary-card-value">{analysis.nhipGiu}</div>
          <p className="summary-card-desc">{analysis.nhipGiuDesc}</p>
        </div>
      </div>

      <div className="content-card" style={{ marginTop: '1rem' }}>
        <div className="content-card-title">CĂN CỨ TỪ LÁ SỐ TỬ VI</div>
        <div className="pill-tags">
          {starTags.map((tag, i) => (
            <span key={i} className="pill-tag">{tag.name} ({tag.label || 'Tọa'})</span>
          ))}
          {starTags.length === 0 && <span className="pill-tag pill-tag--accent">Vô Chính Diệu</span>}
        </div>
      </div>
    </section>
  );
};

// ===== SỨC KHỎE =====
export const SucKhoeSection = ({ chartData }) => {
  if (!chartData) return null;
  const { board, menhPos } = chartData;
  const { cung: tatAch } = findCungByName(board, 'Tật Ách');
  const menhCung = board[menhPos];
  const analysis = getHealthAnalysis(tatAch, menhCung, chartData);
  const starTags = getStarBrightnessTags(analysis.stars);

  return (
    <section className="result-section result-section--wide detail-section health-section">
      <div className="section-header">
        <div className="section-icon" style={{ color: '#27ae60' }}>疾</div>
        <div className="section-header-text">
          <h2 className="section-title">Sức Khỏe</h2>
          <p className="section-subtitle">Tật Ách • Nhịp sức, chỗ dễ tụt và cách giữ nền cho bền</p>
        </div>
      </div>

      <div className="pill-tags">
        <span className="pill-tag pill-tag--accent">Cung Tật Ách</span>
        <span className="pill-tag">Thể Chất Cần Bảo Vệ</span>
        {starTags.map((tag, i) => (
          <span key={i} className="pill-tag">{tag.name} ({tag.label || 'Đắc'})</span>
        ))}
      </div>

      <div className="detail-headline">
        <h3>{analysis.headline}</h3>
        <p>{analysis.subline}</p>
      </div>

      <div className="summary-cards">
        <div className="summary-card" style={{ background: 'var(--color-info-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-info)' }}>BẢN CHẤT THỂ KHÍ</div>
          <div className="summary-card-value">{analysis.theKhi}</div>
          <p className="summary-card-desc">Nhịp điệu sinh học cơ bản của khung mệnh.</p>
        </div>
        <div className="summary-card" style={{ background: 'var(--color-warning-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-warning)' }}>CƠ QUAN THEO DÕI</div>
          <div className="summary-card-value">{analysis.coQuan}</div>
          <p className="summary-card-desc">Đặc biệt bảo vệ và theo dõi định kỳ theo chính tinh.</p>
        </div>
        <div className="summary-card" style={{ background: 'var(--color-danger-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-danger)' }}>ÁP LỰC NGẦM</div>
          <div className="summary-card-value">{analysis.stress}</div>
          <p className="summary-card-desc">Căn nguyên phá hoại sức khỏe từ môi trường.</p>
        </div>
      </div>

      <div className="summary-cards" style={{ marginTop: '1rem' }}>
        <div className="summary-card" style={{ background: 'var(--color-danger-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-danger)' }}>NƠI NÊN CANH</div>
          <div className="summary-card-value">{analysis.noiCanCanh}</div>
          <p className="summary-card-desc">{analysis.noiCanCanhDesc}</p>
          <p className="summary-card-desc" style={{ marginTop: '0.5rem' }}>Luôn duy trì theo dõi định kỳ.</p>
        </div>
        <div className="summary-card" style={{ background: 'var(--bg-accent-soft)' }}>
          <div className="summary-card-label" style={{ color: 'var(--accent)' }}>LUẬT NHÂN QUẢ SỨC KHỎE</div>
          <div className="summary-card-value">{analysis.lichGiu}</div>
          <p className="summary-card-desc">{analysis.lichGiuDesc}</p>
        </div>
        <div className="summary-card" style={{ background: 'var(--color-good-bg)' }}>
          <div className="summary-card-label" style={{ color: 'var(--color-good)' }}>CỦA HỒI LẠI</div>
          <div className="summary-card-value">{analysis.cuaHoiLai}</div>
          <p className="summary-card-desc">{analysis.cuaHoiLaiDesc}</p>
        </div>
      </div>
    </section>
  );
};
