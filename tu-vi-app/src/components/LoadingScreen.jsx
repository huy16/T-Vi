import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';

const ZODIAC_ICONS = [
  '🐀', '🐂', '🐅', '🐇', '🐉', '🐍',
  '🐴', '🐐', '🐒', '🐓', '🐕', '🐖'
];

const LOADING_STEPS = [
  'Đang đồng bộ vận mệnh...',
  'Đang an sao Tử Vi...',
  'Đang lập Thiên bàn...',
  'Đang phân tích cung mệnh...',
  'Hoàn tất khởi tạo!'
];

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const duration = 3500; // total ms
    const interval = 30;
    const increment = (100 / (duration / interval));
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setTimeout(() => {
          onComplete?.();
        }, 400);
      }
      setProgress(current);
      // Update step text
      const idx = Math.min(
        Math.floor((current / 100) * LOADING_STEPS.length),
        LOADING_STEPS.length - 1
      );
      setStepIndex(idx);
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="loading-screen">
      {/* Cosmic circles */}
      <div className="cosmic-container">
        {/* Outer orbit ring 1 */}
        <div className="orbit-ring orbit-ring--1">
          {ZODIAC_ICONS.map((icon, i) => (
            <div
              key={i}
              className="orbit-icon"
              style={{
                '--angle': `${(i * 30)}deg`,
                '--delay': `${i * 0.15}s`
              }}
            >
              <span className="orbit-icon-inner">{icon}</span>
            </div>
          ))}
        </div>

        {/* Middle ring 2 */}
        <div className="orbit-ring orbit-ring--2"></div>

        {/* Inner ring 3 */}
        <div className="orbit-ring orbit-ring--3">
          {/* Small decorative dots */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <div
              key={i}
              className="ring-dot"
              style={{ '--dot-angle': `${angle}deg` }}
            ></div>
          ))}
        </div>

        {/* Center compass icon */}
        <div className="center-compass">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="20" height="20" rx="4" 
                  transform="rotate(45 20 20)"
                  stroke="#c4836c" strokeWidth="1.8" fill="rgba(196,131,108,0.08)"/>
            <circle cx="20" cy="20" r="3" fill="#c4836c" opacity="0.6"/>
            <line x1="20" y1="8" x2="20" y2="14" stroke="#c4836c" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
            <line x1="20" y1="26" x2="20" y2="32" stroke="#c4836c" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
            <line x1="8" y1="20" x2="14" y2="20" stroke="#c4836c" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
            <line x1="26" y1="20" x2="32" y2="20" stroke="#c4836c" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1 className="loading-title">MỆNH THƯ</h1>

      {/* Status text */}
      <p className="loading-status">Đang khởi tạo mệnh thư...</p>
      <p className="loading-step">{LOADING_STEPS[stepIndex]}</p>

      {/* Progress bar */}
      <div className="loading-progress-track">
        <div
          className="loading-progress-bar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
