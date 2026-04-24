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
import ChatBot from '../components/ChatBot';
import ExportPDF from '../components/ExportPDF';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';
import SidebarLogin from '../components/SidebarLogin';

const Home = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedChi, setSelectedChi] = useState(null);
  
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

  const handleCungSelect = (chi) => {
    setSelectedChi(chi === selectedChi ? null : chi);
  };

  return (
    <main className="app-main">
      {/* Top Navbar */}
      <header className="home-header">
         <div className="home-header-title">☯ Mệnh Thư Đại Sư</div>
         <div className="home-header-actions">
            {user && (
              <button className="btn-dashboard-icon" onClick={() => navigate('/dashboard')} title="Kho Lá Số">
                ☯
              </button>
            )}
         </div>
      </header>

      {/* Entry Button */}
      {!chartData && (
        <section className="landing-entry-section animate-fade-in">
          <button 
            className="btn-lap-la-so-giant" 
            onClick={() => navigate('/auth')}
          >
            LẬP LÁ SỐ
          </button>
        </section>
      )}

      {/* Result Page */}
      {chartData && (
        <div className="results-wrapper">
          <aside className="results-sidebar-area">
            <SidebarLogin />
            <div className="sidebar-actions">
               <ExportPDF chartData={chartData} />
            </div>
          </aside>

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
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
