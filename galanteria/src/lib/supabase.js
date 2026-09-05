import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// The previous version fell back to a placeholder URL when these were missing,
// which meant a misconfigured deploy shipped happily and rendered an entirely
// empty catalogue with nothing in the UI to say why. Fail loudly instead.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  const message =
    '[Galanteria] Missing VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY. ' +
    'Copy .env.example to .env and fill it in — see supabase/README.md.';

  if (import.meta.env.DEV) {
    // Stop immediately in development so this is impossible to miss.
    throw new Error(message);
  }
  console.error(message);
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
