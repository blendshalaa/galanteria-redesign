import { useAdminAuth } from './adminAuthContext';
import AdminLogin from '../../Pages/Admin/AdminLogin';
import { Spinner } from '../ui';

/**
 * Gate for /admin.
 *
 * Note what this does and does not do. It decides what renders — it is not the
 * security boundary. Anyone can bypass a React component. What actually stops
 * an unauthenticated person changing data is the Row Level Security policies
 * in supabase/migrations/001_rls.sql, which reject any write that does not
 * carry a valid Supabase Auth session.
 *
 * This exists so an admin sees a login form instead of a broken dashboard.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();

  // Without this, restoring a stored session flashes the login form for a beat
  // on every page load, which reads as "you have been logged out".
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0908',
        }}
      >
        <Spinner size={28} />
      </div>
    );
  }

  if (!isAuthenticated) return <AdminLogin />;

  return children;
};

export default ProtectedRoute;
