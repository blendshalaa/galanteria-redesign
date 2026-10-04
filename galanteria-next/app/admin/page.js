import AdminGate from '@/components/admin/AdminGate';

export const metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

/**
 * The admin panel.
 *
 * It is a client island by design: every screen is a form over live data,
 * behind a Supabase Auth session that exists only in the browser. There is
 * nothing here worth server-rendering, and `robots` keeps it out of the index —
 * a courtesy to crawlers, not a security measure. What actually stops an
 * unauthenticated person changing data is the Row Level Security policies in
 * supabase/migrations/001_rls.sql.
 */
export default function AdminPage() {
  return <AdminGate />;
}
