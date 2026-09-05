import { useState } from 'react';
import { useAdminAuth } from '../../Components/AdminAuth/adminAuthContext';
import './AdminLogin.scss';

/**
 * Supabase Auth login. Previously this compared a password shipped in the
 * JavaScript bundle, behind a fake 600ms delay that only slowed down the
 * honest user. Errors now come from the auth server.
 */
const AdminLogin = () => {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const translateError = (authError) => {
    const raw = authError?.message || '';
    if (/invalid login credentials/i.test(raw)) {
      return 'Email-i ose fjalëkalimi është i gabuar.';
    }
    if (/email not confirmed/i.test(raw)) {
      return 'Ky llogari nuk është konfirmuar ende. Kontaktoni administratorin.';
    }
    if (/rate limit|too many/i.test(raw)) {
      return 'Shumë përpjekje. Provoni sërish pas pak minutash.';
    }
    if (/failed to fetch|network/i.test(raw)) {
      return 'Nuk u lidh me serverin. Kontrolloni internetin.';
    }
    return raw || 'Hyrja dështoi. Provoni sërish.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!email.trim() || !password) {
      setError('Plotësoni email-in dhe fjalëkalimin.');
      return;
    }

    setLoading(true);
    setError('');

    const { error: authError } = await login(email, password);

    if (authError) {
      setError(translateError(authError));
      setLoading(false);
    }
    // On success the auth listener in AdminAuthProvider swaps this screen out,
    // so there is nothing to do here — and no setState on an unmounted form.
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
        <p>Hyni me llogarinë tuaj për të menaxhuar faqen</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="emri@galanteriagroup.com"
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Fjalëkalimi</label>
            <div className="input-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="login-error" role="alert">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <a href="/" className="back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Kthehu në faqen kryesore
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
