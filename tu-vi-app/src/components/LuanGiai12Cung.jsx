import React, { useState } from 'react';
import './LuanGiai12Cung.css';
import { CUNG_ICONS, CUNG_DESCRIPTIONS, getStarBrightnessTags } from '../utils/analysisContent';
import { STAR_INFO, getMainStarFromCung } from '../utils/starImages';

const CUNG_ORDER = ['Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc', 'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'];

const PALACE_IMAGE_MAP = {
  'Mệnh': '/assets/stars/Menh.png',
  'Phụ Mẫu': '/assets/stars/PhuMau.png',
  'Phúc Đức': '/assets/stars/PhucDuc.png',
  'Điền Trạch': '/assets/stars/DienTrach.png',
  'Quan Lộc': '/assets/stars/QuanLoc.png',
  'Nô Bộc': '/assets/stars/NoBoc.png',
  'Thiên Di': '/assets/stars/ThienDi.png',
  'Tật Ách': '/assets/stars/TatAch.png',
  'Tài Bạch': '/assets/stars/TaiBach.png',
  'Tử Tức': '/assets/stars/TuTuc.png',
  'Phu Thê': '/assets/stars/PhuThe.png',
  'Huynh Đệ': '/assets/stars/HuynhDe.png'
};

const CungCard = ({ cungName, cungData, onSelect, className }) => {
  const icon = CUNG_ICONS[cungName] || '☰';
  const description = CUNG_DESCRIPTIONS[cungName] || '';
  const starTags = getStarBrightnessTags(cungData?.saoChinh || []);
  const isVoChinhDieu = starTags.length === 0;
  
  // Lấy tên chính tinh và thông tin bổ trợ
  const mainStar = getMainStarFromCung(cungData?.saoChinh);
  const starInfo = mainStar ? STAR_INFO[mainStar] : null;
  const palaceImage = PALACE_IMAGE_MAP[cungName];

  return (
    <div 
      className={`lg-cung-card ${className || ''}`} 
      onClick={() => onSelect && onSelect()}
    >
      <div className="lg-cung-bg-overlay" />
      {palaceImage && (
        <div className="lg-cung-image-container">
          <img src={palaceImage} alt={cungName} className="lg-cung-image" onError={(e) => e.target.style.display = 'none'} />
        </div>
      )}

      <div className="lg-cung-content">
        {/* Cung label tag */}
        <div className="lg-cung-label-tag">{cungName.toUpperCase()}</div>

        {/* Main star name (large) */}
        {mainStar ? (
          <h3 className="lg-cung-star-name">{mainStar}</h3>
        ) : (
          <h3 className="lg-cung-star-name lg-cung-star-name--empty">Vô Chính Diệu</h3>
        )}

        {/* Star subtitle info */}
        {starInfo && (
          <p className="lg-cung-star-subtitle">
            {starInfo.title}
          </p>
        )}

        {/* Star brightness tags */}
        <div className="lg-cung-tags">
          {starTags.map((tag, idx) => (
            <span key={idx} className={`pill-tag ${tag.brightness ? `pill-tag--b-${tag.brightness.toLowerCase()}` : ''}`}>
              {tag.name} {tag.brightness ? `· ${tag.label}` : ''}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="lg-cung-desc">{description}</p>

        {/* CTA */}
        <div className="link-arrow lg-cung-cta">
          <span>KHÁM PHÁ</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
};

const LuanGiai12Cung = ({ chartData, onCungSelect }) => {
  if (!chartData) return null;
  const { board } = chartData;

  // Map cung name to cung data
  const getCungDataByName = (name) => {
    for (const chi of Object.keys(board)) {
      const cung = board[chi];
      const tenCung = cung.tenCung?.split(' /')[0]?.split(' <')[0]?.trim();
      if (tenCung === name) return cung;
    }
    return null;
  };

  // Helper to get bento class
  const getBentoClass = (name) => {
    switch(name) {
      case 'Mệnh': return 'lg-card-menh';
      case 'Phúc Đức': return 'lg-card-phuc-duc';
      case 'Phụ Mẫu': return 'lg-card-phu-mau';
      case 'Điền Trạch': return 'lg-card-dien-trach';
      default: return '';
    }
  };

  return (
    <section className="result-section result-section--wide luangiai-section">
      {/* Section Header */}
      <div className="section-header">
        <div className="section-icon">命</div>
        <div className="section-header-text">
          <h2 className="section-title">Luận Giải 12 Cung</h2>
          <p className="section-subtitle">Phân tích chi tiết từng cung theo lá số thực tế</p>
        </div>
      </div>

      {/* Grid of 12 cung cards */}
      <div className="lg-grid">
        {CUNG_ORDER.map((name) => {
          const cungData = getCungDataByName(name);
          return (
            <CungCard
              key={name}
              cungName={name}
              cungData={cungData}
              className={getBentoClass(name)}
              onSelect={() => onCungSelect && onCungSelect(cungData?.chi)}
            />
          );
        })}
      </div>
    </section>
  );
};

export default LuanGiai12Cung;
