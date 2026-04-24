import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import './SidebarLogin.css';

const SidebarLogin = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { user } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.href // Redirect back to current results page
        }
      });
      if (error) throw error;
    } catch (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="sidebar-login-container">
      {!user ? (
        <div className="sidebar-auth-box">
          <h3 className="sidebar-auth-title">Lưu Trữ Lá Số</h3>
          <p className="sidebar-auth-desc">Đăng nhập để lưu lại luận giải này vào kho cá nhân của bạn.</p>
          {errorMsg && <div className="auth-alert error">{errorMsg}</div>}
          <button 
            className="sidebar-google-btn" 
            onClick={handleGoogleLogin}
            disabled={loading}
          >
             <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" alt="G" width="18" />
             Đăng nhập Google
          </button>
        </div>
      ) : (
        <div className="sidebar-user-box">
          <div className="user-avatar-placeholder">☯</div>
          <div className="user-info">
            <p className="user-email">{user.email}</p>
            <button className="logout-link" onClick={handleLogout}>Đăng xuất</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarLogin;
