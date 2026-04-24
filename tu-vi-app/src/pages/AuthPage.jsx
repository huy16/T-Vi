import React, { useState, useCallback, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import InputForm from '../components/InputForm';
import LoadingScreen from '../components/LoadingScreen';
import { lapLaSo } from '../utils/tuviEngine';
import './AuthPage.css';

const QUOTES = [
  "Vận mệnh không phải là sự sắp đặt cố định, mà là bản đồ của những khả năng.",
  "Tri thiên mệnh để tận nhân lực, hiểu thấu sự đời để sống an nhiên.",
  "Ngôi sao trên trời không chỉ để ngắm, mà là những chỉ dấu cho hành trình của mỗi con người.",
  "Trong mỗi hạt cát đều có thế giới, trong mỗi lá số đều có cả một đời người.",
  "Mệnh là cái có sẵn, Vận là cái đang xoay, thấu hiểu cả hai để làm chủ cuộc đời.",
  "Thời gian là dòng chảy, tử vi là bến đỗ để ta soi lại bóng mình.",
  "Cát hung họa phúc đều có căn nguyên, thấu hiểu mệnh lý để tìm đường hướng thiện."
];

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentQuote, setCurrentQuote] = useState("");
  
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  // Pick a random quote on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setCurrentQuote(QUOTES[randomIndex]);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth` 
        }
      });
      if (error) throw error;
    } catch (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  const handleFormSubmit = useCallback(async (data) => {
    try {
      setIsLoadingChart(true);
      const generatedData = lapLaSo(data);
      setPendingData(generatedData);
      
      // Save to Supabase if logged in
      if (user) {
        try {
          const { error } = await supabase.from('charts').insert([{
            user_id: user.id,
            full_name: data.name || 'Khách',
            gender: data.gender,
            solar_day: data.solarDay || data.day,
            solar_month: data.solarMonth || data.month,
            solar_year: data.solarYear || data.year,
            lunar_day: data.day,
            lunar_month: data.month,
            lunar_year: data.year,
            birth_hour: data.hourDisplay || '',
            chart_json: generatedData
          }]);
          
          if (error) {
            console.error("Failed to save chart to db:", error);
          }
        } catch (dbError) {
          console.error("DB Save Exception:", dbError);
        }
      }
    } catch (err) {
      console.error("CRITICAL ERROR in lapLaSo engine:", err);
      alert("Lỗi engine Tử Vi: " + err.message);
      setIsLoadingChart(false);
    }
  }, [user]);

  const handleLoadingComplete = useCallback(() => {
    // Navigate back to Home with chartData to display results
    navigate('/', { state: { chartData: pendingData } });
  }, [pendingData, navigate]);

  if (isLoadingChart) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="auth-page-container">
      <div className="input-section">
      <div className="auth-merged-card animate-auth-entry">
        <div className="hero-content">
          <div className="hero-badge">☯ Tử Vi Đẩu Số Chuyên Sâu</div>
          <h1 className="hero-title-merged">Mệnh Thư Đại Sư</h1>
          <p className="hero-quote">
            "{currentQuote}"
          </p>
          <div className="hero-divider"></div>
          <p className="hero-desc">
            Hệ thống luận giải tử vi chuyên sâu, kết hợp tinh hoa thuật số cổ phương Đông và công nghệ hiện đại.
          </p>

          {/* Feature Highlights */}
          <ul className="feature-highlights">
            <li className="feature-item">
              <span className="feature-icon">☯</span>
              <div>
                <strong>Luận giải 12 cung</strong>
                <span>Phân tích chi tiết từng cung vị</span>
              </div>
            </li>
            <li className="feature-item">
              <span className="feature-icon">📊</span>
              <div>
                <strong>Vận hạn theo năm</strong>
                <span>Dự báo vận trình & cơ hội</span>
              </div>
            </li>
            <li className="feature-item">
              <span className="feature-icon">🤖</span>
              <div>
                <strong>AI Tử Vi tư vấn</strong>
                <span>Hỏi đáp trực tiếp với AI</span>
              </div>
            </li>
          </ul>

          {user && (
            <div className="user-status-minimal">
              <span className="user-status-dot"></span>
              <p>Xin chào, <strong>{user.email}</strong></p>
            </div>
          )}
          
          <button onClick={() => navigate('/')} className="back-home-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Trở về trang chủ
          </button>
        </div>

        {/* Khối nhập thông tin tín chủ */}
        <div className="form-container">
          <InputForm onSubmit={handleFormSubmit} />
        </div>

        {/* Card footer watermark */}
        <div className="auth-card-footer">
          <span>☯</span> Mệnh Thư Đại Sư · Tử Vi Đẩu Số
        </div>
      </div>
      </div>
    </div>
  );
};

export default AuthPage;
