import React from 'react';
import './HeroSection.css';

const HeroSection = ({ chartData }) => {
  const { userInfo } = chartData;
  const genderLabel = userInfo.gender === 'Nam' ? 'Nam' : 'Nữ';
  const genderSuffix = userInfo.gender === 'Nam' ? 'NAM PHÁI' : 'NỮ PHÁI';
  const solarDate = `${String(userInfo.solarDay || userInfo.day).padStart(2, '0')}/${String(userInfo.solarMonth || userInfo.month).padStart(2, '0')}/${userInfo.solarYear || userInfo.year}`;

  return (
    <section className="hero-section">
      <div className="hero-bg-pattern"></div>
      <div className="hero-content">
        {/* Year label */}
        <div className="hero-year-label">
          <span className="hero-year-text">NĂM {userInfo.canChiYear?.toUpperCase()} {userInfo.solarYear || userInfo.year}</span>
        </div>

        {/* Decorative title */}
        <h1 className="hero-tuvi-title">Tử Vi</h1>

        {/* Main card */}
        <div className="hero-card">
          <div className="hero-card-badge">★ TỬ VI NẤU SỐ {genderSuffix} ★</div>
          <h2 className="hero-card-title">LUẬN GIẢI MỆNH SỐ</h2>
          <p className="hero-card-subtitle">Phân Tích Toàn Diện • Bản Đồ Thiên Mệnh</p>
        </div>

        {/* Info pills */}
        <div className="hero-pills">
          <span className="hero-pill hero-pill--name">{userInfo.name}</span>
          <span className="hero-pill">{solarDate}</span>
          <span className="hero-pill hero-pill--gender">{genderLabel}</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
