'use client';

import { AdminAuthProvider, useAdminAuth } from './AdminAuthProvider';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { Spinner } from '@/components/ui/states';

/**
 * Decides what the /admin route renders. Note what it does not do: it is not
 * the security boundary. Anyone can bypass a React component; what stops an
 * unauthenticated write is Row Level Security. This exists so an admin sees a
 * login form instead of a broken dashboard.
 */
export default function AdminGate() {
  return (
    <AdminAuthProvider>
      <Gate />
    </AdminAuthProvider>
  );
}

function Gate() {
  const { isAuthenticated, loading } = useAdminAuth();

  // Without this, restoring a stored session flashes the login form for a beat
  // on every page load, which reads as "you have been logged out".
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sunken">
        <Spinner size={28} />
      </div>
    );
  }

  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
}
