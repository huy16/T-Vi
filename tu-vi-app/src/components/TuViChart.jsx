import React, { useState, useCallback } from 'react';
import './TuViChart.css';
import { SAO_NGU_HANH, HANH_TO_COLOR_CLASS, CHI_NGU_HANH, LEGEND_DATA } from '../utils/tuviEngine';
import { STAR_DICTIONARY } from '../utils/starDictionary';

const StarItem = ({ name, type }) => {
  let brightnessClass = '';
  let hanhClass = '';
  let displayName = name;
  let brightnessLabel = '';
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const brightnessMatch = name.match(/\s\(([MVĐHB])\)$/);
  const cleanName = name.replace(/\s\(([MVĐHB])\)$/, '').replace(/^L\./, '');
  const isLuu = name.startsWith('L.');

  if (brightnessMatch) {
    brightnessLabel = brightnessMatch[1];
    displayName = cleanName;
    if (brightnessLabel === 'M') brightnessClass = 'mieu';
    else if (brightnessLabel === 'V') brightnessClass = 'vuong';
    else if (brightnessLabel === 'Đ') brightnessClass = 'dac';
    else if (brightnessLabel === 'B') brightnessClass = 'binh';
    else if (brightnessLabel === 'H') brightnessClass = 'ham';
  }

  const hanh = SAO_NGU_HANH[cleanName];
  if (hanh) hanhClass = HANH_TO_COLOR_CLASS[hanh] || '';

  const meaning = STAR_DICTIONARY[cleanName];

  const handleMouseEnter = useCallback((e) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
    setShowTooltip(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false);
  }, []);

  return (
    <div 
      className={`sao-item ${type} ${brightnessClass} ${hanhClass}`}
      onMouseEnter={meaning ? handleMouseEnter : undefined}
      onMouseMove={meaning ? handleMouseMove : undefined}
      onMouseLeave={meaning ? handleMouseLeave : undefined}
    >
      <span className="star-name">{isLuu ? 'L.' : ''}{displayName}</span>
      {brightnessLabel && <span className="brightness-label"> ({brightnessLabel})</span>}
      {meaning && showTooltip && (
        <span 
          className="star-tooltip star-tooltip--visible" 
          style={{ left: tooltipPos.x + 12, top: tooltipPos.y - 10 }}
        >
          {meaning}
        </span>
      )}
    </div>
  );
};

const Cung = ({ isCenter, data, onClick, isActive }) => {
  if (isCenter) {
    const solarDate = data ? `${String(data.solarDay || data.day).padStart(2, '0')}/${String(data.solarMonth || data.month).padStart(2, '0')}/${data.solarYear || data.year}` : '';
    const hourDisplay = data ? `${data.hourDisplay || ''}` : '';
    const lunarDisplay = data ? `${data.day}/${data.month} âm lịch • Năm ${data.canChiYear || ''}` : '';
    
    return (
      <div className="thien-ban">
        {/* Inner Chi Labels */}
        <span className="inner-chi-label" style={{ top: '2px', left: '2px' }}>Hợi</span>
        <span className="inner-chi-label" style={{ top: '2px', left: '37.5%', transform: 'translateX(-50%)' }}>Tý</span>
        <span className="inner-chi-label" style={{ top: '2px', left: '62.5%', transform: 'translateX(-50%)' }}>Sửu</span>
        <span className="inner-chi-label" style={{ top: '2px', right: '2px' }}>Dần</span>
        <span className="inner-chi-label" style={{ top: '37.5%', right: '2px', transform: 'translateY(-50%)' }}>Mão</span>
        <span className="inner-chi-label" style={{ top: '62.5%', right: '2px', transform: 'translateY(-50%)' }}>Thìn</span>
        <span className="inner-chi-label" style={{ bottom: '2px', right: '2px' }}>Tỵ</span>
        <span className="inner-chi-label" style={{ bottom: '2px', left: '62.5%', transform: 'translateX(-50%)' }}>Ngọ</span>
        <span className="inner-chi-label" style={{ bottom: '2px', left: '37.5%', transform: 'translateX(-50%)' }}>Mùi</span>
        <span className="inner-chi-label" style={{ bottom: '2px', left: '2px' }}>Thân</span>
        <span className="inner-chi-label" style={{ top: '62.5%', left: '2px', transform: 'translateY(-50%)' }}>Dậu</span>
        <span className="inner-chi-label" style={{ top: '37.5%', left: '2px', transform: 'translateY(-50%)' }}>Tuất</span>

        {data && (
          <>
            <div className="center-gender-label">{data.gender === 'Nam' ? 'NAM MỆNH' : 'NỮ MỆNH'}</div>
            <div className="center-name">{data.name?.toUpperCase()}</div>
            <div className="center-date">{solarDate} • {hourDisplay}</div>
            <div className="center-lunar">{lunarDisplay}</div>

            <div className="thien-ban-info">
              <table className="info-table">
                <tbody>
                  <tr><td className="label">Mệnh:</td><td className="value"><strong>{data.banMenhFull?.split(' - ')[0]}</strong></td></tr>
                  <tr><td className="label">Cục:</td><td className="value">{data.cucName}</td></tr>
                  <tr><td className="label">Âm Dương:</td><td className="value">{data.amDuong} — {data.amDuong?.includes('Dương') ? 'năng lượng thuận chiều, phát triển tự nhiên theo đà.' : 'năng lượng nghịch chiều, cần chủ động tạo cơ hội.'}</td></tr>
                  <tr><td className="label">Chủ Mệnh:</td><td className="value">{data.chuMenh}</td></tr>
                  <tr><td className="label">Chủ Thân:</td><td className="value">{data.chuThan}</td></tr>
                </tbody>
              </table>
            </div>

            <div className="center-tuHoa-tags">
              <span className="center-tuHoa-tag">H. Lộc: {data.chuMenh || 'Tử Vi'}</span>
              <span className="center-tuHoa-tag">H.Quyền: Tài Bạch</span>
              <span className="center-tuHoa-tag">H.Khoa: {data.chuThan || 'Văn Xương'}</span>
              <span className="center-tuHoa-tag">H.Kỵ: Tật Ách</span>
            </div>
          </>
        )}
      </div>
    );
  }

  if (!data) return null;

  const isThan = data.tenCung.includes("/ Thân");
  const tenCungHienThi = data.tenCung.split(" /")[0].toUpperCase();
  const canChi = data.canChi || "";
  const nguHanhLabel = CHI_NGU_HANH[data.chi] || 'Thổ';

  return (
    <div className={`cung ${isActive ? 'active-cung' : ''}`} onClick={() => onClick && onClick(data)}>
      <div className="cung-header">
        <div className="cung-header-left">
          <span className="can-chi-idx">{canChi}</span>
          <span className="ngu-hanh-label">{nguHanhLabel}</span>
        </div>
        <div className="cung-header-center">
          <span className="ten-cung">{tenCungHienThi}</span>
          {isThan && <span className="than-note">&lt;THÂN&gt;</span>}
        </div>
        <div className="cung-header-right">
          <span className="dai-han">{data.daiHan}</span>
          <span className="tieu-han">{data.tieuHan}</span>
        </div>
      </div>

      <div className="cung-body">
        <div className="chinh-tinh-area">
          {data.saoChinh && data.saoChinh.length > 0 ? (
            data.saoChinh.map((sao, idx) => (
              <StarItem key={`ct-${idx}`} name={sao} type="main-star" />
            ))
          ) : (
            <div className="vo-chinh-dieu">Vô chính diệu</div>
          )}
        </div>
        <div className="phu-tinh-col left">
          {data.saoTot?.map((sao, idx) => (
            <StarItem key={`pt-${idx}`} name={sao} type="good-star" />
          ))}
        </div>
        <div className="phu-tinh-col right">
          {data.saoXau?.map((sao, idx) => (
            <StarItem key={`px-${idx}`} name={sao} type="bad-star" />
          ))}
        </div>
      </div>

      <div className="cung-footer">
        <div className="footer-left">
           <span className="dv-label">ĐV.</span>
           <span className="dv-val">{data.daiVanName.replace('ĐV.', '')}</span>
        </div>
        <div className="footer-center">
          <span className="trang-sinh">{data.trangSinh}</span>
        </div>
        <div className="footer-right">
          <span className="ln-label">LN.</span>
          <span className="ln-val">{data.luuNien.replace('LN.', '')}</span>
        </div>
      </div>
    </div>
  );
};

const BoundaryMarker = ({ type, position }) => {
  // Styles based on grid positions (0..15 internally, but we use a simpler 4x4 coordinate system)
  // position: {top, left, width, height...} or just categorical
  const style = { ...position };
  return (
    <div className="boundary-marker" style={style}>
      {type}
    </div>
  );
};

const TuViChart = ({ chartData, selectedChi, onCungSelect }) => {
  if (!chartData) return null;
  const { board, userInfo } = chartData;

  const handleCungClick = (cungData) => {
    if (onCungSelect && cungData) {
      onCungSelect(cungData.chi);
    }
  };

  const getCenterCoord = (chi) => {
    // Clockwise ring starting from Tỵ at Top-Left (0,0) - CLASSIC LAYOUT
    const CHI_ORDER_RING = ['Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn'];
    const idx = CHI_ORDER_RING.indexOf(chi);
    if (idx === -1) return {x: 0, y: 0};
    const positions = [[0,0], [0,1], [0,2], [0,3], [1,3], [2,3], [3,3], [3,2], [3,1], [3,0], [2,0], [1,0]];
    const [r, c] = positions[idx];
    return { x: `${(c + 0.5) * 25}%`, y: `${(r + 0.5) * 25}%` };
  };

  const renderSVGOverlay = () => {
    if (!selectedChi) return null;
    const CHI_LIST_CIRCLE = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
    let idx = CHI_LIST_CIRCLE.indexOf(selectedChi);
    const targets = [
       CHI_LIST_CIRCLE[(idx + 4) % 12],
       CHI_LIST_CIRCLE[(idx + 8) % 12],
       CHI_LIST_CIRCLE[(idx + 6) % 12]
    ];
    const startObj = getCenterCoord(selectedChi);

    return (
      <svg className="connections-overlay">
        {targets.map((targetChi, index) => {
           const endObj = getCenterCoord(targetChi);
           return (
             <line 
                key={`${selectedChi}-${targetChi}`}
                x1={startObj.x} y1={startObj.y} 
                x2={endObj.x} y2={endObj.y} 
                className="connection-line"
             />
           )
        })}
      </svg>
    )
  }

  // Calculate marker positions based on boundary between two cung
  const getMarkerPos = (chiArray) => {
    if (!chiArray || chiArray.length < 2) return null;
    
    const posMap = {
      'Tỵ': [0,0], 'Ngọ': [0,1], 'Mùi': [0,2], 'Thân': [0,3],
      'Dậu': [1,3], 'Tuất': [2,3], 'Hợi': [3,3], 'Tý': [3,2],
      'Sửu': [3,1], 'Dần': [3,0], 'Mão': [2,0], 'Thìn': [1,0]
    };

    const p1 = posMap[chiArray[0]];
    const p2 = posMap[chiArray[1]];

    if (!p1 || !p2) return null;

    const midR = (p1[0] + p2[0]) / 2;
    const midC = (p1[1] + p2[1]) / 2;

    // determine orientation for CSS styling
    const isVerticalLine = p1[1] !== p2[1]; 

    let topVal = (midR + 0.5) * 25;
    let leftVal = (midC + 0.5) * 25;

    // If it's a vertical boundary (between columns), push it down to the very bottom 
    // of the palace (below the footer text, on the horizontal grid line).
    if (isVerticalLine) {
      topVal = (midR + 1) * 25;
    }

    return {
      style: {
        top: `${topVal}%`,
        left: `${leftVal}%`
      },
      orientation: isVerticalLine ? 'vertical-line' : 'horizontal-line'
    };
  };

  const markers = [];
  if (chartData.trietPositions) {
    const mData = getMarkerPos(chartData.trietPositions);
    if (mData) markers.push({ type: 'Triệt', ...mData });
  }
  if (chartData.tuanPositions) {
    const mData = getMarkerPos(chartData.tuanPositions);
    if (mData) markers.push({ type: 'Tuần', ...mData });
  }

  return (
    <div className="tu-vi-chart-container">
       {/* Section Header */}
       <div className="chart-section-header">
         <div className="chart-section-icon">盤</div>
         <div className="chart-section-text">
           <h2>Mệnh Bàn Tử Vi</h2>
           <p>LÁ SỐ 12 CUNG ĐẦY ĐỦ • NHẤN CUNG ĐỂ XEM CHI TIẾT</p>
         </div>
       </div>

       <div className="tu-vi-grid">
          {renderSVGOverlay()}
          
          {markers.map((m, i) => (
            <div key={i} className={`boundary-marker ${m.orientation}`} style={m.style}>
              {m.type}
            </div>
          ))}

          {/* Hàng trên cùng: Tỵ, Ngọ, Mùi, Thân */}
          <Cung data={board['Tỵ']} onClick={handleCungClick} isActive={selectedChi === 'Tỵ'} />
          <Cung data={board['Ngọ']} onClick={handleCungClick} isActive={selectedChi === 'Ngọ'} />
          <Cung data={board['Mùi']} onClick={handleCungClick} isActive={selectedChi === 'Mùi'} />
          <Cung data={board['Thân']} onClick={handleCungClick} isActive={selectedChi === 'Thân'} />

          {/* Cột trái và phải - Hàng 2 */}
          <Cung data={board['Thìn']} onClick={handleCungClick} isActive={selectedChi === 'Thìn'} />
          <div className="thien-ban-wrapper">
            <Cung isCenter={true} data={userInfo} />
          </div>
          <Cung data={board['Dậu']} onClick={handleCungClick} isActive={selectedChi === 'Dậu'} />

          {/* Cột trái và phải - Hàng 3 */}
          <Cung data={board['Mão']} onClick={handleCungClick} isActive={selectedChi === 'Mão'} />
          <Cung data={board['Tuất']} onClick={handleCungClick} isActive={selectedChi === 'Tuất'} />

          {/* Hàng dưới cùng */}
          <Cung data={board['Dần']} onClick={handleCungClick} isActive={selectedChi === 'Dần'} />
          <Cung data={board['Sửu']} onClick={handleCungClick} isActive={selectedChi === 'Sửu'} />
          <Cung data={board['Tý']} onClick={handleCungClick} isActive={selectedChi === 'Tý'} />
          <Cung data={board['Hợi']} onClick={handleCungClick} isActive={selectedChi === 'Hợi'} />
       </div>

       {/* Legend Section */}
       <div className="chart-legend">
         <div className="brightness-legend">
            <span className="mieu">M: Miếu</span>
            <span className="vuong">V: Vượng</span>
            <span className="dac">Đ: Đắc</span>
            <span className="binh">B: Bình</span>
            <span className="ham">H: Hãm</span>
         </div>
         <div className="element-legend">
            {LEGEND_DATA.map((item, idx) => (
              <div key={idx} className="legend-item">
                <span className="color-box" style={{ background: item.color }}></span>
                <span className="legend-label">{item.label}</span>
              </div>
            ))}
         </div>
       </div>
    </div>
  );
};

export default TuViChart;
