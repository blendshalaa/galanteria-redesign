import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * The server client used by every public page.
 *
 * This is the half of the migration that changes what a visitor — and a
 * crawler — actually receives. In the Vite build, a category page arrived as an
 * empty shell and then fetched its products from the browser; anything that
 * does not execute JavaScript saw nothing at all. Here the same query runs
 * during the render, so the products are in the HTML.
 *
 * CACHING
 * -------
 * supabase-js issues plain `fetch` calls, so handing it a fetch that carries
 * Next's `revalidate` option is enough to put the whole data layer behind the
 * framework's cache: identical queries within the window are served from it,
 * and a page is rebuilt at most once every `REVALIDATE_SECONDS`. Content edited
 * in the admin panel appears within that window without a redeploy.
 *
 * It reads the same anon key as the browser and therefore has exactly the same
 * permissions — the Row Level Security policies in supabase/migrations/ are
 * still what decide who may read and write what. Nothing here escalates.
 */

export const REVALIDATE_SECONDS = 300;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.error(
    '[Galanteria] Missing NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY — ' +
      'every page will render its empty state. Copy .env.example to .env.local.'
  );
}

export const supabaseServer = createClient(
  supabaseUrl || 'https://unconfigured.supabase.co',
  supabaseAnonKey || 'unconfigured',
  {
    auth: {
      // There is no browser here to persist a session into, and a shared
      // module-level client must never pick one up.
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (url, options = {}) =>
        fetch(url, { ...options, next: { revalidate: REVALIDATE_SECONDS } }),
    },
  }
);
