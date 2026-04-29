import React, { useMemo, useState, useEffect } from 'react';
import './InputForm.css';
import { solarToLunar } from '../utils/lunarCalendar';

/* ===== DATA ===== */
const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

const GIO_CHI = [
  { key: 'Ti',   name: 'Tý',   emoji: '🐀', range: '23:00 - 01:00' },
  { key: 'Suu',  name: 'Sửu',  emoji: '🐂', range: '01:00 - 03:00' },
  { key: 'Dan',  name: 'Dần',  emoji: '🐅', range: '03:00 - 05:00' },
  { key: 'Mao',  name: 'Mão',  emoji: '🐇', range: '05:00 - 07:00' },
  { key: 'Thin', name: 'Thìn', emoji: '🐉', range: '07:00 - 09:00' },
  { key: 'Ti2',  name: 'Tỵ',   emoji: '🐍', range: '09:00 - 11:00' },
  { key: 'Ngo',  name: 'Ngọ',  emoji: '🐴', range: '11:00 - 13:00' },
  { key: 'Mui',  name: 'Mùi',  emoji: '🐐', range: '13:00 - 15:00' },
  { key: 'Than', name: 'Thân', emoji: '🐒', range: '15:00 - 17:00' },
  { key: 'Dau',  name: 'Dậu',  emoji: '🐓', range: '17:00 - 19:00' },
  { key: 'Tuat', name: 'Tuất', emoji: '🐕', range: '19:00 - 21:00' },
  { key: 'Hoi',  name: 'Hợi',  emoji: '🐖', range: '21:00 - 23:00' },
];

const QUAN_HE = [
  { value: 'doc_than', label: 'Độc thân', icon: null },
  { value: 'hen_ho', label: 'Đang hẹn hò', icon: '💕' },
  { value: 'ket_hon', label: 'Đã kết hôn', icon: null },
  { value: 'ly_hon', label: 'Ly thân / Ly hôn', icon: null },
];

const CURRENT_YEAR = new Date().getFullYear();

/* ===== Helper: tính Can Chi năm ===== */
function canChiNam(year) {
  const canIdx = (year + 6) % 10;
  const chiIdx = (year + 8) % 12;
  return `${CAN[canIdx]} ${CHI[chiIdx]}`;
}

/* ===================================================================== */
/*  InputForm Component                                                   */
/* ===================================================================== */
const InputForm = ({ onSubmit }) => {
  // Form State
  const [name, setName] = useState('');
  const [day, setDay] = useState('15');
  const [month, setMonth] = useState('05');
  const [year, setYear] = useState('2000');
  const [gender, setGender] = useState('Nam');
  const [selectedGioChi, setSelectedGioChi] = useState(GIO_CHI[1]); // Sửu by default
  const unknownTime = false;
  const isLunar = false;
  const [viewYear, setViewYear] = useState(String(CURRENT_YEAR));
  const [viewMonth, setViewMonth] = useState('3');
  const [quanHe, setQuanHe] = useState('hen_ho');

  // Dropdown states
  const [showDayDropdown, setShowDayDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showZodiacDropdown, setShowZodiacDropdown] = useState(false);
  const [showQuanHeDropdown, setShowQuanHeDropdown] = useState(false);
  const [showViewMonthDropdown, setShowViewMonthDropdown] = useState(false);

  // Auto-convert solar to lunar
  const lunarInfo = useMemo(() => {
    const d = parseInt(day) || 1;
    const m = parseInt(month) || 1;
    const y = parseInt(year) || 2000;
    if (y >= 1900 && y <= 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      try {
        return solarToLunar(d, m, y);
      } catch {
        return null;
      }
    }
    return null;
  }, [day, month, year]);

  /* Auto-detect removed for simplified UI */

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.custom-dropdown--zodiac')) setShowZodiacDropdown(false);
      if (!e.target.closest('.custom-dropdown--quanhe')) setShowQuanHeDropdown(false);
      if (!e.target.closest('.custom-dropdown--viewmonth')) setShowViewMonthDropdown(false);
      if (!e.target.closest('.date-input-wrapper--day')) setShowDayDropdown(false);
      if (!e.target.closest('.date-input-wrapper--month')) setShowMonthDropdown(false);
      if (!e.target.closest('.date-input-wrapper--year')) setShowYearDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Format lunar display
  const lunarDisplay = lunarInfo
    ? `${lunarInfo.lunarDay}/${lunarInfo.lunarMonth} âm lịch • Năm ${canChiNam(lunarInfo.lunarYear)}`
    : '';

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const rawD = parseInt(day) || 1;
    const rawM = parseInt(month) || 1;
    const rawY = parseInt(year) || 2000;

    let d = rawD, m = rawM, y = rawY;
    let solarDay = rawD, solarMonth = rawM, solarYear = rawY;

    try {
      const lunar = solarToLunar(rawD, rawM, rawY);
      d = lunar.lunarDay;
      m = lunar.lunarMonth;
      y = lunar.lunarYear;
    } catch (err) {
      console.error('Lỗi chuyển đổi âm lịch:', err);
    }

    const submissionData = {
      name: name || 'Vô Danh',
      gender,
      day: d,
      month: m,
      year: y,
      hour: unknownTime ? 'Ti' : selectedGioChi.key,
      solarDay,
      solarMonth,
      solarYear,
      namXem: parseInt(viewYear) || CURRENT_YEAR,
      thangXem: parseInt(viewMonth) || 1,
      isLunar,
      quanHe,
    };

    onSubmit(submissionData);
  };

  return (
    <div className="tuvi-card">
      {/* Background decorative elements */}
      <div className="card-bg-circle card-bg-circle--top"></div>
      <div className="card-bg-circle card-bg-circle--bottom"></div>

      {/* Header Icon */}
      <div className="card-header-banner">
        <h1 className="card-title-modern">THÔNG TIN TÍN CHỦ</h1>
      </div>

      <form onSubmit={handleSubmit} className="tuvi-form" id="tuvi-input-form">

        <div className="form-section form-section--name">
          <label className="form-label">Họ và tên</label>
          <input
            id="input-name"
            type="text"
            className="form-input"
            placeholder="NHẬP HỌ VÀ TÊN..."
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            required
          />
        </div>

        {/* === NGÀY SINH + LOẠI LỊCH === */}
        <div className="form-row form-row--split">
          <div className="form-section form-section--date">
            <label className="form-label">Ngày sinh (Dương lịch)</label>
            <div className="date-inputs">
              <div className="date-input-wrapper date-input-wrapper--day">
                <div className="custom-dropdown">
                  <input
                    type="text"
                    className="dropdown-trigger dropdown-trigger--date"
                    value={day}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 2) setDay(val);
                    }}
                    onBlur={() => {
                      if (day && parseInt(day) > 31) setDay('31');
                      if (day && parseInt(day) < 1) setDay('1');
                      if (day) setDay(String(parseInt(day)).padStart(2, '0'));
                    }}
                    onClick={() => setShowDayDropdown(!showDayDropdown)}
                    placeholder="DD"
                  />
                  {showDayDropdown && (
                    <div className="dropdown-menu dropdown-menu--date">
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                        <button key={d} type="button" className="dropdown-item" onClick={() => { setDay(String(d).padStart(2, '0')); setShowDayDropdown(false); }}>
                          {String(d).padStart(2, '0')}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="date-label">Ngày</span>
              </div>

              <div className="date-input-wrapper date-input-wrapper--month">
                <div className="custom-dropdown">
                  <input
                    type="text"
                    className="dropdown-trigger dropdown-trigger--date"
                    value={month}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 2) setMonth(val);
                    }}
                    onBlur={() => {
                      if (month && parseInt(month) > 12) setMonth('12');
                      if (month && parseInt(month) < 1) setMonth('1');
                      if (month) setMonth(String(parseInt(month)).padStart(2, '0'));
                    }}
                    onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                    placeholder="MM"
                  />
                  {showMonthDropdown && (
                    <div className="dropdown-menu dropdown-menu--date">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <button key={m} type="button" className="dropdown-item" onClick={() => { setMonth(String(m).padStart(2, '0')); setShowMonthDropdown(false); }}>
                          {String(m).padStart(2, '0')}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="date-label">Tháng</span>
              </div>

              <div className="date-input-wrapper date-input-wrapper--year">
                <div className="custom-dropdown">
                  <input
                    type="text"
                    className="dropdown-trigger dropdown-trigger--date"
                    value={year}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 4) setYear(val);
                    }}
                    onBlur={() => {
                      const y = parseInt(year);
                      if (y < 1900) setYear('1900');
                      if (y > CURRENT_YEAR) setYear(String(CURRENT_YEAR));
                    }}
                    onClick={() => setShowYearDropdown(!showYearDropdown)}
                    placeholder="YYYY"
                  />
                  {showYearDropdown && (
                    <div className="dropdown-menu dropdown-menu--date dropdown-menu--year">
                      {Array.from({ length: 121 }, (_, i) => CURRENT_YEAR - i).map(y => (
                        <button key={y} type="button" className="dropdown-item" onClick={() => { setYear(String(y)); setShowYearDropdown(false); }}>
                          {y}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="date-label">Năm</span>
              </div>
            </div>
          </div>
        </div>

        {/* === GIỚI TÍNH (FULL WIDTH) === */}
        <div className="form-section">
          <label className="form-label">Giới tính</label>
          <div className="gender-toggle-full" style={{ pointerEvents: 'auto' }}>
            <button
              type="button"
              className={`gender-btn-classic ${gender === 'Nam' ? 'active' : ''}`}
              onClick={() => setGender('Nam')}
            >
              NAM
            </button>
            <button
              type="button"
              className={`gender-btn-classic ${gender === 'Nữ' ? 'active' : ''}`}
              onClick={() => setGender('Nữ')}
            >
              NỮ
            </button>
          </div>
        </div>

        {/* === LUNAR INFO TAG === */}
        {lunarInfo && (
          <div className="lunar-tag" id="lunar-info">
            <span>{lunarDisplay}</span>
          </div>
        )}

        {/* === GIỜ SINH === */}
        <div className="form-section form-section--zodiac-full">
          <label className="form-label">Giờ sinh (12 Con Giáp)</label>
          <div className="custom-dropdown custom-dropdown--zodiac">
            <button 
              type="button" 
              className="dropdown-trigger dropdown-trigger--zodiac" 
              onClick={(e) => {
                e.stopPropagation();
                setShowZodiacDropdown(!showZodiacDropdown);
              }}
              disabled={unknownTime}
            >
                <span className="zodiac-trigger-content">
                  <span className="zodiac-emoji">{selectedGioChi.emoji}</span>
                  <span className="zodiac-name">Giờ {selectedGioChi.name}</span>
                  <span className="zodiac-range-dim">({selectedGioChi.range})</span>
                </span>
              </button>
              {showZodiacDropdown && !unknownTime && (
                <div className="dropdown-menu">
                  {GIO_CHI.map(g => (
                    <button 
                      key={g.key} 
                      type="button" 
                      className={`dropdown-item ${selectedGioChi.key === g.key ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedGioChi(g);
                        setShowZodiacDropdown(false);
                      }}
                    >
                      <span className="zodiac-item-content">
                        <span className="zodiac-emoji">{g.emoji}</span>
                        <span className="zodiac-name">Giờ {g.name}</span>
                        <span className="zodiac-range-dim">{g.range}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>



        {/* === NĂM XEM + THÁNG XEM === */}
        <div className="form-row form-row--split">
          <div className="form-section">
            <label className="form-label">Năm xem</label>
            <input 
              type="text" 
              className="form-input form-input--center" 
              value={viewYear} 
              onChange={(e) => setViewYear(e.target.value.replace(/\D/g, ''))}
              placeholder={String(CURRENT_YEAR)}
            />
          </div>
          <div className="form-section">
            <label className="form-label">Tháng xem (Âm lịch)</label>
            <div className="custom-dropdown custom-dropdown--viewmonth">
              <button 
                type="button" 
                className="dropdown-trigger dropdown-trigger--viewmonth" 
                onClick={() => setShowViewMonthDropdown(!showViewMonthDropdown)}
              >
                Tháng {viewMonth}
              </button>
              {showViewMonthDropdown && (
                <div className="dropdown-menu">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <button 
                      key={m} 
                      type="button" 
                      className={`dropdown-item ${viewMonth === String(m) ? 'selected' : ''}`}
                      onClick={() => {
                        setViewMonth(String(m));
                        setShowViewMonthDropdown(false);
                      }}
                    >
                      Tháng {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* === MỐI QUAN HỆ === */}
        <div className="form-section form-section--relation-full">
          <label className="form-label">Mối quan hệ</label>
          <div className="custom-dropdown custom-dropdown--quanhe">
            <button 
              type="button" 
              className="dropdown-trigger" 
              onClick={() => setShowQuanHeDropdown(!showQuanHeDropdown)}
            >
              {QUAN_HE.find(q => q.value === quanHe)?.label || 'Chọn...'}
            </button>
            {showQuanHeDropdown && (
              <div className="dropdown-menu">
                {QUAN_HE.map(q => (
                  <button 
                    key={q.value} 
                    type="button" 
                    className={`dropdown-item ${quanHe === q.value ? 'selected' : ''}`}
                    onClick={() => {
                      setQuanHe(q.value);
                      setShowQuanHeDropdown(false);
                    }}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* === SUBMIT BUTTON === */}
        <button type="submit" className="submit-btn-premium" id="btn-submit">
          XEM LUẬN GIẢI
        </button>

        {/* === FOOTER NOTE === */}
        <p className="form-footer">
          Thông tin được bảo mật và chỉ sử dụng cho việc luận giải
        </p>
      </form>
    </div>
  );
};

export default InputForm;
