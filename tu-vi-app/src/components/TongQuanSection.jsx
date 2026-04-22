import React from 'react';
import './TongQuanSection.css';
import { MENH_TONG_QUAN, DEFAULT_TONG_QUAN, getMainStar } from '../utils/analysisContent';

const TongQuanSection = ({ chartData }) => {
  if (!chartData) return null;
  const { board, menhPos } = chartData;
  const menhCung = board[menhPos];
  const mainStar = getMainStar(menhCung);
  const data = MENH_TONG_QUAN[mainStar] || DEFAULT_TONG_QUAN;

  return (
    <section className="result-section result-section--wide tongquan-section">
      {/* Section Header */}
      <div className="section-header">
        <div className="section-icon">象</div>
        <div className="section-header-text">
          <h2 className="section-title">Tổng Quan Vận Mệnh</h2>
          <p className="section-subtitle">Phân tích bốn phương diện chính • Dựa trên công thức tử vi</p>
        </div>
      </div>

      {/* Overview card */}
      <div className="tq-overview-card">
        <div className="tq-overview-badge">✦ TỔNG QUAN VẬN MỆNH</div>
        <p className="tq-overview-text">{data.overview}</p>
      </div>

      {/* 3 Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-card-label" style={{ color: 'var(--color-good)' }}>ĐIỂM MẠNH</div>
          <p className="summary-card-desc">{data.diemManh}</p>
        </div>
        <div className="summary-card">
          <div className="summary-card-label" style={{ color: 'var(--color-warning)' }}>ĐIỂM CẦN CANH</div>
          <p className="summary-card-desc">{data.diemCanCanh}</p>
        </div>
        <div className="summary-card">
          <div className="summary-card-label" style={{ color: 'var(--accent)' }}>NÊN CHỐT</div>
          <p className="summary-card-desc">{data.nenChot}</p>
        </div>
      </div>

      {/* Archetype */}
      <div className="tq-archetype-card">
        <div className="tq-archetype-header">
          <span className="tq-archetype-icon">{data.archetypeIcon}</span>
          <h3 className="tq-archetype-title">{data.archetype}</h3>
        </div>
        <p className="tq-archetype-desc">
          {mainStar ? `Bạn mang khi chất đỉnh đạc và uy quyền. Bạn luôn hướng tới sự hoàn hảo, danh dự cao và sinh ra là để làm lãnh đạo hoặc người làm chủ cuộc sống của mình.` : data.overview}
        </p>

        <div className="quote-box">
          {data.quote}
        </div>
      </div>

      {/* 6-grid traits */}
      <div className="tq-traits-grid">
        <div className="tq-trait-card">
          <div className="tq-trait-label">ĐẶC ĐIỂM CỐT LÕI</div>
          <ul className="tq-trait-list">
            {data.strengths.map((s, i) => <li key={i}>✦ {s}</li>)}
          </ul>
        </div>
        <div className="tq-trait-card">
          <div className="tq-trait-label">BÍ MẬT BÊN TRONG</div>
          <ul className="tq-trait-list tq-trait-list--warning">
            {data.secrets.map((s, i) => <li key={i}>◎ {s}</li>)}
          </ul>
        </div>
        <div className="tq-trait-card">
          <div className="tq-trait-label">PHONG CÁCH XÃ HỘI</div>
          <p className="tq-trait-text">{data.socialStyle}</p>
        </div>
        <div className="tq-trait-card">
          <div className="tq-trait-label">KHI STRESS</div>
          <p className="tq-trait-text">{data.stressResponse}</p>
        </div>
        <div className="tq-trait-card">
          <div className="tq-trait-label">NGHỀ NGHIỆP PHÙ HỢP</div>
          <div className="tq-career-tags">
            {data.careers.map((c, i) => <span key={i} className="pill-tag">{c}</span>)}
          </div>
        </div>
        <div className="tq-trait-card">
          <div className="tq-trait-label">CẦN PHÁT TRIỂN</div>
          <ul className="tq-trait-list tq-trait-list--growth">
            {data.growth.map((g, i) => <li key={i}>🌱 {g}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TongQuanSection;
