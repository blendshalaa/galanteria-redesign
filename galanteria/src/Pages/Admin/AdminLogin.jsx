import React, { useState } from 'react';
import { useAdminAuth } from '../../Components/AdminAuth/AdminAuth';
import './AdminLogin.scss';

const AdminLogin = () => {
  const { login } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const ok = login(password);
      if (!ok) {
        setError('Fjalëkalimi është i gabuar.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="admin-login">
      <div className="login-bg">
        <div className="login-glow" />
      </div>

      <div className="login-card">
        <div className="login-logo">
          <div className="logo-mark">G</div>
          <span>Galanteria Admin</span>
        </div>

        <h1>Mirë se vini</h1>
        <p>Futhni fjalëkalimin tuaj për të hyrë në panel</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Fjalëkalimi</label>
            <div className="input-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="login-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                Hyr
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <a href="/" className="back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Kthehu në faqen kryesore
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
