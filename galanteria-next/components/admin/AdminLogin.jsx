'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from './AdminAuthProvider';
import { Spinner } from '@/components/ui/states';
import { field } from './ui';
import { cn } from '@/lib/cn';

/**
 * Supabase Auth login. This used to compare a password shipped inside the
 * JavaScript bundle, behind a fake 600ms delay that only slowed down the honest
 * user. The errors below are the auth server's, translated.
 */
export default function AdminLogin() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const translateError = (authError) => {
    const raw = authError?.message || '';
    if (/invalid login credentials/i.test(raw)) return 'Email-i ose fjalëkalimi është i gabuar.';
    if (/email not confirmed/i.test(raw)) return 'Kjo llogari nuk është konfirmuar ende. Kontaktoni administratorin.';
    if (/rate limit|too many/i.test(raw)) return 'Shumë përpjekje. Provoni sërish pas pak minutash.';
    if (/failed to fetch|network/i.test(raw)) return 'Nuk u lidh me serverin. Kontrolloni internetin.';
    return raw || 'Hyrja dështoi. Provoni sërish.';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
    // On success the auth listener swaps this screen out, so there is nothing
    // to do here — and no setState on an unmounted form.
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sunken px-5 py-16">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/4 size-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />

      <div className="relative w-full max-w-[420px] rounded-[20px] border border-line bg-card p-8 shadow-[0_40px_80px_rgba(0,0,0,0.6)] sm:p-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex size-9.5 items-center justify-center rounded-[10px] bg-gradient-to-br from-accent to-accent-light text-[1.1rem] font-bold text-white">
            G
          </span>
          <span className="text-base font-semibold text-ink">Galanteria Admin</span>
        </div>

        <h1 className="font-display text-2xl font-normal text-ink">Mirë se vini</h1>
        <p className="mb-8 mt-2 text-base text-ink-soft">
          Hyni me llogarinë tuaj për të menaxhuar faqen
        </p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div className={field.group}>
            <label htmlFor="email" className={field.label}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="emri@galanteriagroup.com"
              autoFocus
              className={field.control}
            />
          </div>

          <div className={field.group}>
            <label htmlFor="password" className={field.label}>Fjalëkalimi</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••••"
              className={field.control}
            />
          </div>

          {error && (
            <p role="alert" className="flex items-center gap-2 rounded-lg border border-red-500/25 bg-red-500/10 px-3.5 py-2.5 text-base text-red-200">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              'mt-1 inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-accent px-6 py-3',
              'text-[0.85rem] font-semibold uppercase tracking-[0.1em] text-[#16120c]',
              'transition-colors duration-200 hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-60'
            )}
          >
            {loading ? (
              <Spinner size={16} />
            ) : (
              <>
                Hyr
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-line pt-6">
          <Link href="/" className="inline-flex items-center gap-2 text-base text-ink-muted transition-colors hover:text-accent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Kthehu në faqen kryesore
          </Link>
        </div>
      </div>
    </div>
  );
}
