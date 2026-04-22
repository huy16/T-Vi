import React, { useState, useCallback, useRef, useEffect } from 'react';
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

/* ===== Helper: tính Can Chi năm ===== */
function canChiNam(year) {
  const canIdx = (year + 6) % 10;
  const chiIdx = (year + 8) % 12;
  return `${CAN[canIdx]} ${CHI[chiIdx]}`;
}

/* ===== Helper: xác định giờ Chi từ hour ===== */
function getGioChiFromHour(h) {
  if (h >= 23 || h < 1) return GIO_CHI[0];
  if (h < 3)  return GIO_CHI[1];
  if (h < 5)  return GIO_CHI[2];
  if (h < 7)  return GIO_CHI[3];
  if (h < 9)  return GIO_CHI[4];
  if (h < 11) return GIO_CHI[5];
  if (h < 13) return GIO_CHI[6];
  if (h < 15) return GIO_CHI[7];
  if (h < 17) return GIO_CHI[8];
  if (h < 19) return GIO_CHI[9];
  if (h < 21) return GIO_CHI[10];
  return GIO_CHI[11];
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
  const [hour, setHour] = useState('02');
  const [minute, setMinute] = useState('00');
  const [selectedGioChi, setSelectedGioChi] = useState(GIO_CHI[1]); // Sửu by default
  const [unknownTime, setUnknownTime] = useState(false);
  const [quanHe, setQuanHe] = useState('hen_ho');

  // Dropdown states
  const [showGioDropdown, setShowGioDropdown] = useState(false);
  const [showQuanHeDropdown, setShowQuanHeDropdown] = useState(false);

  // Lunar conversion
  const [lunarInfo, setLunarInfo] = useState(null);

  // Refs for click-outside
  const gioDropdownRef = useRef(null);
  const quanHeDropdownRef = useRef(null);

  // Auto-convert solar to lunar
  useEffect(() => {
    const d = parseInt(day) || 1;
    const m = parseInt(month) || 1;
    const y = parseInt(year) || 2000;
    if (y >= 1900 && y <= 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      try {
        const lunar = solarToLunar(d, m, y);
        setLunarInfo(lunar);
      } catch {
        setLunarInfo(null);
      }
    } else {
      setLunarInfo(null);
    }
  }, [day, month, year]);

  // Auto-detect giờ Chi from hour input
  useEffect(() => {
    if (!unknownTime) {
      const h = parseInt(hour) || 0;
      setSelectedGioChi(getGioChiFromHour(h));
    }
  }, [hour, unknownTime]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (gioDropdownRef.current && !gioDropdownRef.current.contains(e.target)) {
        setShowGioDropdown(false);
      }
      if (quanHeDropdownRef.current && !quanHeDropdownRef.current.contains(e.target)) {
        setShowQuanHeDropdown(false);
      }
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
      namXem: 2026,
      thangXem: 1,
    };

    onSubmit(submissionData);
  };

  return (
    <div className="tuvi-card">
      {/* Background decorative elements */}
      <div className="card-bg-circle card-bg-circle--top"></div>
      <div className="card-bg-circle card-bg-circle--bottom"></div>

      {/* Header Icon */}
      <div className="card-header">
        <div className="header-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2L19.5 9.5L27 10.5L21.5 16L23 24L16 20L9 24L10.5 16L5 10.5L12.5 9.5L16 2Z" 
                  stroke="#c4836c" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
            <circle cx="16" cy="14" r="4" stroke="#c4836c" strokeWidth="1.2" fill="rgba(196,131,108,0.1)"/>
            <path d="M12 18C12 18 14 20 16 20C18 20 20 18 20 18" stroke="#c4836c" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="card-title">Thông Tin Tín Chủ</h1>
        <p className="card-subtitle">
          Nhập chính xác ngày giờ sinh để nhận được luận giải vận
          <br />mệnh chi tiết nhất
        </p>
      </div>

      <form onSubmit={handleSubmit} className="tuvi-form" id="tuvi-input-form">

        {/* === HỌ VÀ TÊN === */}
        <div className="form-section">
          <label className="form-label">
            <span className="label-icon">👤</span>
            HỌ VÀ TÊN
          </label>
          <input
            id="input-name"
            type="text"
            className="form-input"
            placeholder="Nhập họ và tên..."
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            required
          />
        </div>

        {/* === NGÀY SINH + GIỚI TÍNH === */}
        <div className="form-row form-row--split">
          {/* Ngày sinh */}
          <div className="form-section form-section--date">
            <label className="form-label">
              <span className="label-icon">📅</span>
              NGÀY SINH (DƯƠNG LỊCH)
            </label>
            <div className="date-inputs">
              <div className="date-input-wrapper">
                <input
                  id="input-day"
                  type="text"
                  className="form-input form-input--date"
                  value={day}
                  onChange={(e) => setDay(e.target.value.replace(/\D/g, '').slice(0, 2))}
                  maxLength={2}
                />
                <span className="date-label">Ngày</span>
              </div>
              <div className="date-input-wrapper">
                <input
                  id="input-month"
                  type="text"
                  className="form-input form-input--date"
                  value={month}
                  onChange={(e) => setMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                  maxLength={2}
                />
                <span className="date-label">Tháng</span>
              </div>
              <div className="date-input-wrapper">
                <input
                  id="input-year"
                  type="text"
                  className="form-input form-input--date form-input--year"
                  value={year}
                  onChange={(e) => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                />
                <span className="date-label">Năm</span>
              </div>
            </div>
          </div>

          {/* Giới tính */}
          <div className="form-section form-section--gender">
            <label className="form-label form-label--gender">GIỚI TÍNH</label>
            <div className="gender-toggle">
              <button
                type="button"
                id="gender-nam"
                className={`gender-btn ${gender === 'Nam' ? 'gender-btn--active' : ''}`}
                onClick={() => setGender('Nam')}
              >
                <span className="gender-icon">♂</span>
                NAM
              </button>
              <button
                type="button"
                id="gender-nu"
                className={`gender-btn ${gender === 'Nữ' ? 'gender-btn--active' : ''}`}
                onClick={() => setGender('Nữ')}
              >
                <span className="gender-icon">♀</span>
                NỮ
              </button>
            </div>
          </div>
        </div>

        {/* === LUNAR INFO TAG === */}
        {lunarInfo && (
          <div className="lunar-tag" id="lunar-info">
            <span className="lunar-tag-icon">🌙</span>
            <span>{lunarDisplay}</span>
          </div>
        )}

        {/* === GIỜ SINH + MỐI QUAN HỆ === */}
        <div className="form-row form-row--split">
          {/* Giờ sinh */}
          <div className="form-section form-section--time">
            <label className="form-label">
              <span className="label-icon">🕐</span>
              GIỜ SINH (24H)
            </label>
            <div className="time-row">
              <div className="time-inputs">
                <input
                  id="input-hour"
                  type="text"
                  className="form-input form-input--time"
                  value={unknownTime ? '--' : hour}
                  onChange={(e) => setHour(e.target.value.replace(/\D/g, '').slice(0, 2))}
                  disabled={unknownTime}
                  maxLength={2}
                />
                <span className="time-colon">:</span>
                <input
                  id="input-minute"
                  type="text"
                  className="form-input form-input--time"
                  value={unknownTime ? '--' : minute}
                  onChange={(e) => setMinute(e.target.value.replace(/\D/g, '').slice(0, 2))}
                  disabled={unknownTime}
                  maxLength={2}
                />
              </div>

              {/* Giờ Chi Dropdown */}
              <div className="custom-dropdown" ref={gioDropdownRef}>
                <button
                  type="button"
                  id="dropdown-gio"
                  className="dropdown-trigger dropdown-trigger--gio"
                  onClick={() => setShowGioDropdown(!showGioDropdown)}
                  disabled={unknownTime}
                >
                  <span className="dropdown-emoji">{selectedGioChi.emoji}</span>
                  <span className="dropdown-text">Giờ {selectedGioChi.name}</span>
                  <span className={`dropdown-arrow ${showGioDropdown ? 'dropdown-arrow--open' : ''}`}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
                {showGioDropdown && (
                  <div className="dropdown-menu dropdown-menu--gio">
                    {GIO_CHI.map((g) => (
                      <button
                        key={g.key}
                        type="button"
                        className={`dropdown-item ${selectedGioChi.key === g.key ? 'dropdown-item--active' : ''}`}
                        onClick={() => {
                          setSelectedGioChi(g);
                          setShowGioDropdown(false);
                        }}
                      >
                        <span className="dropdown-item-emoji">{g.emoji}</span>
                        <span className="dropdown-item-name">{g.name}</span>
                        {selectedGioChi.key === g.key && (
                          <span className="dropdown-item-dot"></span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Không nhớ giờ */}
            <label className="checkbox-label" id="checkbox-unknown-time">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={unknownTime}
                onChange={(e) => setUnknownTime(e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">Không nhớ giờ</span>
            </label>
          </div>

          {/* Mối quan hệ */}
          <div className="form-section form-section--relation">
            <label className="form-label">
              <span className="label-icon">💗</span>
              MỐI QUAN HỆ
            </label>
            <div className="custom-dropdown" ref={quanHeDropdownRef}>
              <button
                type="button"
                id="dropdown-quanhe"
                className="dropdown-trigger dropdown-trigger--quanhe"
                onClick={() => setShowQuanHeDropdown(!showQuanHeDropdown)}
              >
                <span className="dropdown-text">
                  {QUAN_HE.find(q => q.value === quanHe)?.label}
                </span>
                <span className={`dropdown-arrow ${showQuanHeDropdown ? 'dropdown-arrow--open' : ''}`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
              {showQuanHeDropdown && (
                <div className="dropdown-menu dropdown-menu--quanhe">
                  {QUAN_HE.map((q) => (
                    <button
                      key={q.value}
                      type="button"
                      className={`dropdown-item ${quanHe === q.value ? 'dropdown-item--active' : ''}`}
                      onClick={() => {
                        setQuanHe(q.value);
                        setShowQuanHeDropdown(false);
                      }}
                    >
                      <span className="dropdown-item-name">{q.label}</span>
                      {q.icon && <span className="dropdown-item-icon">{q.icon}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* === SUBMIT BUTTON === */}
        <button type="submit" className="submit-btn" id="btn-submit">
          <span className="submit-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="9" stroke="white" strokeWidth="1.5"/>
              <path d="M11 6V11L14 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="submit-text">LẬP LÁ SỐ TỬ VI</span>
          <span className="submit-arrow">→</span>
        </button>

        {/* === FOOTER NOTE === */}
        <p className="form-footer">
          <span className="footer-icon">🔒</span>
          Thông tin của bạn được bảo mật và chỉ sử dụng cho việc luận giải
        </p>
      </form>
    </div>
  );
};

export default InputForm;
