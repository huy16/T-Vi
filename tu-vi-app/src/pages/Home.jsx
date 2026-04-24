import React, { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InputForm from '../components/InputForm';
import TuViChart from '../components/TuViChart';
import HeroSection from '../components/HeroSection';
import TongQuanSection from '../components/TongQuanSection';
import LuanGiai12Cung from '../components/LuanGiai12Cung';
import VanHanSection from '../components/VanHanSection';
import { SuNghiepSection, TinhDuyenSection, TaiLocSection, SucKhoeSection } from '../components/DetailSections';
import { ConCaiSection, GiaiDoanSection, VanTrinh12ThangSection, PhongThuySection, ThanSatSection, DienTrachSection } from '../components/AdvancedSections';
import LoadingScreen from '../components/LoadingScreen';
import ChatBot from '../components/ChatBot';
import ExportPDF from '../components/ExportPDF';
import { lapLaSo } from '../utils/tuviEngine';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';

const Home = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedChi, setSelectedChi] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Load chart from Dashboard if passed via router state
  useEffect(() => {
    if (location.state && location.state.chartData) {
      setChartData(location.state.chartData);
      // Clear state so refresh doesn't keep it forever
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleFormSubmit = useCallback(async (data) => {
    try {
      setIsLoading(true);
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
            lunar_day: data.day, // simplified for now
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
      setIsLoading(false);
    }
  }, [user]);

  const handleLoadingComplete = useCallback(() => {
    setChartData(pendingData);
    setIsLoading(false);
    setPendingData(null);
    setSelectedChi(null);
    setTimeout(() => {
      try {
        document.getElementById('chart-section')?.scrollIntoView({ behavior: 'smooth' });
      } catch (e) {
        console.warn('Scroll failed:', e);
      }
    }, 300);
  }, [pendingData]);

  const handleCungSelect = (chi) => {
    setSelectedChi(chi === selectedChi ? null : chi);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <main className="app-main">
      {/* Top Navbar */}
      <header className="home-header">
         <div className="home-header-title">☯ Mệnh Thư Đại Sư</div>
         <div className="home-header-actions">
           {user ? (
             <button className="btn-dashboard" onClick={() => navigate('/dashboard')}>
               Kho Lá Số của {user.email.split('@')[0]}
             </button>
           ) : (
             <button className="btn-login" onClick={() => navigate('/auth')}>
               Đăng nhập / Đăng ký
             </button>
           )}
         </div>
      </header>

      {/* Form Input */}
      {!chartData && (
        <section className="input-section">
          <div className="hero-content animate-fade-in">
            <div className="hero-badge">Tử Vi Đẩu Số Chuyên Sâu</div>
            <h1 className="hero-title">Mệnh Thư Đại Sư</h1>
            <p className="hero-quote">
              "Vận mệnh không phải là sự sắp đặt cố định, <br/>
              mà là bản đồ của những khả năng."
            </p>
            <div className="hero-divider"></div>
            <p className="hero-desc">
              Hệ thống luận giải tử vi chuyên sâu, kết hợp tinh hoa thuật số cổ phương Đông và công nghệ hiện đại, giúp bạn thấu hiểu bản thân, nắm bắt thời cơ.
            </p>
          </div>
          <div className="form-container">
            <InputForm onSubmit={handleFormSubmit} />
          </div>
        </section>
      )}

      {/* Result Page */}
      {chartData && (
        <div className="result-page">

          <HeroSection chartData={chartData} />

          <section id="chart-section" className="chart-view-section animate-slide-up">
            <TuViChart 
              chartData={chartData} 
              selectedChi={selectedChi} 
              onCungSelect={handleCungSelect} 
            />
          </section>

          <TongQuanSection chartData={chartData} />
          <ChatBot chartData={chartData} />
          <LuanGiai12Cung chartData={chartData} />
          <VanHanSection chartData={chartData} />
          <SuNghiepSection chartData={chartData} />
          <TinhDuyenSection chartData={chartData} />
          <TaiLocSection chartData={chartData} />
          <SucKhoeSection chartData={chartData} />
          <ConCaiSection chartData={chartData} />
          <GiaiDoanSection chartData={chartData} />
          <VanTrinh12ThangSection chartData={chartData} />
          <PhongThuySection chartData={chartData} />
          <ThanSatSection chartData={chartData} />
          <DienTrachSection chartData={chartData} />

          <ExportPDF chartData={chartData} />
        </div>
      )}
    </main>
  );
};

export default Home;
