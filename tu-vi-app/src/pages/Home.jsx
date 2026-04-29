import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TuViChart from '../components/TuViChart';

import TongQuanSection from '../components/TongQuanSection';
import LuanGiai12Cung from '../components/LuanGiai12Cung';
import VanHanSection from '../components/VanHanSection';
import { SuNghiepSection, TinhDuyenSection, TaiLocSection, SucKhoeSection } from '../components/DetailSections';
import { ConCaiSection, GiaiDoanSection, VanTrinh12ThangSection, PhongThuySection, ThanSatSection, DienTrachSection } from '../components/AdvancedSections';
import ChatBot from '../components/ChatBot';
import ExportPDF from '../components/ExportPDF';
import { useAuth } from '../contexts/AuthContext';
import SidebarLogin from '../components/SidebarLogin';

const Home = () => {
  const location = useLocation();
  const [chartData] = useState(() => location.state?.chartData || null);
  const [selectedChi, setSelectedChi] = useState(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Clear route state after loading a chart from Dashboard/Auth.
  useEffect(() => {
    if (location.state && location.state.chartData) {
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleCungSelect = (chi) => {
    setSelectedChi(chi === selectedChi ? null : chi);
    if (chi) {
      document.getElementById('chart-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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
            <div className="sidebar-actions">
               <ExportPDF chartData={chartData} />
            </div>
            <SidebarLogin />
          </aside>

          <div className="result-page">


            <section id="chart-section" className="chart-view-section animate-slide-up">
              <TuViChart 
                chartData={chartData} 
                selectedChi={selectedChi} 
                onCungSelect={handleCungSelect} 
              />
            </section>

            <TongQuanSection chartData={chartData} />
            <LuanGiai12Cung chartData={chartData} onCungSelect={handleCungSelect} />
            <VanHanSection chartData={chartData} />
            <SuNghiepSection chartData={chartData} />
            <TinhDuyenSection chartData={chartData} />
            <TaiLocSection chartData={chartData} />
            <SucKhoeSection chartData={chartData} />
            <ConCaiSection chartData={chartData} />
            <DienTrachSection chartData={chartData} />
            <GiaiDoanSection chartData={chartData} />
            <PhongThuySection chartData={chartData} />
            <VanTrinh12ThangSection chartData={chartData} />
            <ThanSatSection chartData={chartData} />
          </div>
        </div>
      )}
      {chartData && <ChatBot chartData={chartData} />}
    </main>
  );
};

export default Home;
