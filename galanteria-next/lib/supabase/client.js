import { createClient } from '@supabase/supabase-js';

/**
 * The browser client.
 *
 * Used by everything that runs in the visitor's browser: the admin panel (which
 * needs the Auth session), the search overlay, and the handful of public
 * components that still load on demand.
 *
 * Public pages do NOT use this — they are server components and read through
 * lib/supabase/server.js, so their content is in the HTML rather than fetched
 * after hydration.
 *
 * The variables are `NEXT_PUBLIC_` rather than `VITE_` now. Both prefixes mean
 * the same thing: this value is compiled into the JavaScript the browser
 * downloads. That is fine for the anon key, which is designed to be public and
 * is constrained by the Row Level Security policies in supabase/migrations/.
 * It is never fine for the service_role key.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.error(
    '[Galanteria] Missing NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Copy .env.example to .env.local and fill it in — see supabase/README.md.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://unconfigured.supabase.co',
  supabaseAnonKey || 'unconfigured',
  {
    auth: {
      // The admin session lives in localStorage and is refreshed in the
      // background, so a logged-in editor is not thrown out mid-edit.
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
