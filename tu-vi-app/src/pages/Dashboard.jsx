import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchCharts();
  }, [user, navigate, fetchCharts]);

  const fetchCharts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('charts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCharts(data || []);
    } catch (error) {
      console.error("Error fetching charts:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const openChart = (chartJson) => {
    // Navigate to home page and pass chartJson as state to render it immediately
    navigate('/', { state: { chartData: chartJson } });
  };

  if (loading) {
    return <div className="dashboard-loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-icon">☯</div>
          <h1>Kho Lưu Trữ Lá Số</h1>
        </div>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button className="btn-home" onClick={() => navigate('/')}>Tạo mới +</button>
          <button className="btn-logout" onClick={handleSignOut}>Đăng xuất</button>
        </div>
      </header>

      <main className="dashboard-content">
        {charts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📜</div>
            <h2>Chưa có lá số nào</h2>
            <p>Bạn chưa lưu lá số Tử Vi nào trong kho. Hãy quay lại trang chủ để lập lá số mới nhé.</p>
            <button className="btn-primary" onClick={() => navigate('/')}>Lập Lá Số Ngay</button>
          </div>
        ) : (
          <div className="charts-grid">
            {charts.map((chart) => (
              <div key={chart.id} className="chart-card">
                <div className="chart-card-header">
                  <h3>{chart.full_name}</h3>
                  <span className="gender-badge">{chart.gender}</span>
                </div>
                <div className="chart-card-body">
                  <p><strong>Ngày sinh DL:</strong> {chart.solar_day}/{chart.solar_month}/{chart.solar_year}</p>
                  <p><strong>Ngày sinh AL:</strong> {chart.lunar_day}/{chart.lunar_month}/{chart.lunar_year}</p>
                  <p><strong>Giờ sinh:</strong> {chart.birth_hour}</p>
                  <p className="created-date">Lưu ngày: {new Date(chart.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="chart-card-footer">
                  <button className="btn-view" onClick={() => openChart(chart.chart_json)}>Xem Chi Tiết</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
