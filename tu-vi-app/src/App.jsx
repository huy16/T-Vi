import React, { useState, useCallback } from 'react';
import './App.css';
import InputForm from './components/InputForm';
import TuViChart from './components/TuViChart';
import HeroSection from './components/HeroSection';
import TongQuanSection from './components/TongQuanSection';
import LuanGiai12Cung from './components/LuanGiai12Cung';
import VanHanSection from './components/VanHanSection';
import { SuNghiepSection, TinhDuyenSection, TaiLocSection, SucKhoeSection } from './components/DetailSections';
import { ConCaiSection, GiaiDoanSection, VanTrinh12ThangSection, PhongThuySection, ThanSatSection, DienTrachSection } from './components/AdvancedSections';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { lapLaSo } from './utils/tuviEngine';

function App() {
  const [chartData, setChartData] = useState(null);
  const [selectedChi, setSelectedChi] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const handleFormSubmit = useCallback((data) => {
    console.log("App received form data:", data);
    try {
      const generatedData = lapLaSo(data);
      console.log("Chart data generated successfully:", generatedData);
      setPendingData(generatedData);
      setIsLoading(true);
    } catch (err) {
      console.error("CRITICAL ERROR in lapLaSo engine:", err);
      alert("Lỗi engine Tử Vi: " + err.message);
    }
  }, []);

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

  // Loading Screen
  if (isLoading) {
    return (
      <div className="app-container">
        <LoadingScreen onComplete={handleLoadingComplete} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="app-container">
        <main className="app-main">
          {/* Form Input */}
          {!chartData && (
            <section className="input-section">
              <InputForm onSubmit={handleFormSubmit} />
            </section>
          )}

          {/* Result Page */}
          {chartData && (
            <div className="result-page">
              {/* Back button */}
              <button 
                className="nhap-lai-btn" 
                onClick={() => { setChartData(null); setSelectedChi(null); }}
              >
                ← Nhập lại
              </button>

              {/* Hero Section */}
              <HeroSection chartData={chartData} />

              {/* Chart Section */}
              <section id="chart-section" className="chart-view-section animate-slide-up">
                <TuViChart 
                  chartData={chartData} 
                  selectedChi={selectedChi} 
                  onCungSelect={handleCungSelect} 
                />
              </section>

              {/* Tổng Quan Vận Mệnh */}
              <TongQuanSection chartData={chartData} />

              {/* Luận Giải 12 Cung */}
              <LuanGiai12Cung chartData={chartData} />

              {/* Vận Hạn Hiện Tại */}
              <VanHanSection chartData={chartData} />

              {/* Sự Nghiệp & Nghề Phù Hợp */}
              <SuNghiepSection chartData={chartData} />

              {/* Tình Duyên */}
              <TinhDuyenSection chartData={chartData} />

              {/* Tài Lộc */}
              <TaiLocSection chartData={chartData} />

              {/* Sức Khỏe */}
              <SucKhoeSection chartData={chartData} />

              {/* Con Cái */}
              <ConCaiSection chartData={chartData} />

              {/* Các Giai Đoạn Cuộc Đời */}
              <GiaiDoanSection chartData={chartData} />

              {/* Vận Trình 12 Tháng */}
              <VanTrinh12ThangSection chartData={chartData} />

              {/* Phong Thủy & Vật Phẩm */}
              <PhongThuySection chartData={chartData} />

              {/* Thần Sát & Quý Nhân */}
              <ThanSatSection chartData={chartData} />

              {/* Điền Trạch & Nhà Đất */}
              <DienTrachSection chartData={chartData} />
            </div>
          )}
        </main>

        <footer className="app-footer">
          {chartData && <p>✦ Huyền Diệu Tử Vi • Chiêm nghiệm vận mệnh ✦</p>}
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
