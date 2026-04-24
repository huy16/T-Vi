import React, { useState } from 'react';
import './LuanGiai12Cung.css';
import { CUNG_ICONS, CUNG_DESCRIPTIONS, getStarBrightnessTags } from '../utils/analysisContent';
import { STAR_INFO, getMainStarFromCung } from '../utils/starImages';

const CUNG_ORDER = ['Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc', 'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'];

const CungCard = ({ cungName, cungData, onSelect }) => {
  const icon = CUNG_ICONS[cungName] || '☰';
  const description = CUNG_DESCRIPTIONS[cungName] || '';
  const starTags = getStarBrightnessTags(cungData?.saoChinh || []);
  const isVoChinhDieu = starTags.length === 0;
  
  // Lấy tên chính tinh và thông tin bổ trợ
  const mainStar = getMainStarFromCung(cungData?.saoChinh);
  const starInfo = mainStar ? STAR_INFO[mainStar] : null;

  return (
    <div 
      className="lg-cung-card" 
      onClick={() => onSelect && onSelect(cungName)}
    >
      <div className="lg-cung-bg-overlay" />


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
            {starInfo.title} • {starInfo.subtitle}
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
        {CUNG_ORDER.map((name) => (
          <CungCard
            key={name}
            cungName={name}
            cungData={getCungDataByName(name)}
            onSelect={onCungSelect}
          />
        ))}
      </div>
    </section>
  );
};

export default LuanGiai12Cung;
