'use server';

import { revalidatePath } from 'next/cache';

/**
 * Drop the cached render of the public site.
 *
 * Public pages are static and revalidate on a timer (see
 * lib/supabase/server.js), which means an edit made in the admin panel would
 * otherwise take up to five minutes to appear. Every admin screen calls this
 * after a successful write, so the client sees their change immediately rather
 * than reloading the homepage twice and concluding the panel is broken.
 *
 * It is a server action, not a public route handler: Next gives it an
 * unguessable per-deployment id and only accepts it as a POST from the app
 * itself, so it cannot be turned into a cache-busting endpoint by a stranger.
 */
export async function revalidateSite() {
  revalidatePath('/', 'layout');
}
