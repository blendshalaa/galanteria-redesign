'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

/**
 * Admin authentication, backed by Supabase Auth.
 *
 * The implementation this replaces compared a password in the browser against
 * `import.meta.env.VITE_ADMIN_PASSWORD || 'galanteria2024'`. A bundler inlines
 * that into the shipped JavaScript, so the password was readable by anyone who
 * viewed source — and the check could be skipped entirely by setting a
 * sessionStorage flag from the console.
 *
 * More importantly, that check never protected the *data*. Every write goes
 * browser → Supabase with the public anon key; the real security boundary is
 * the Row Level Security policies in supabase/migrations/001_rls.sql, which
 * only permit writes carrying a valid Auth session. This provider is what
 * obtains that session. What it renders is a convenience, not a gate.
 */

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(null);
  // Starts true so the gate can show a spinner instead of flashing the login
  // form while a stored session is being restored.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data?.session ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      active = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session),
      loading,

      /** Resolves to `{ error }` — `error` is null on success. */
      login: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        return { error };
      },

      logout: async () => {
        await supabase.auth.signOut();
      },
    }),
    [session, loading]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used inside <AdminAuthProvider>');
  return context;
}
