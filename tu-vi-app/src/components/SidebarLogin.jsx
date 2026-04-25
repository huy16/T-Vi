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
          {errorMsg && <div className="auth-alert error">{errorMsg}</div>}
          <button 
            className="sidebar-google-btn" 
            onClick={handleGoogleLogin}
            disabled={loading}
          >
             <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
               <path d="M15.53 8.12c0-.52-.04-1.01-.13-1.48H8v2.8h4.22a3.6 3.6 0 0 1-1.56 2.36v1.97h2.52c1.48-1.36 2.35-3.36 2.35-5.65Z" fill="#4285F4"/>
               <path d="M8 15.8c2.1 0 3.87-.7 5.16-1.89l-2.52-1.97c-.7.47-1.6.75-2.64.75-2.03 0-3.75-1.37-4.36-3.21H1.05v2.04A7.8 7.8 0 0 0 8 15.8Z" fill="#34A853"/>
               <path d="M3.64 9.48a4.7 4.7 0 0 1 0-3l.01-.02V4.42H1.05a7.8 7.8 0 0 0 0 7.12l2.59-2.06Z" fill="#FBBC05"/>
               <path d="M8 3.12c1.14 0 2.17.39 2.98 1.16l2.23-2.23A7.8 7.8 0 0 0 1.05 4.42l2.59 2.04c.61-1.84 2.33-3.21 4.36-3.21Z" fill="#EA4335"/>
             </svg>
             <span>Đăng nhập Google</span>
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
