import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

/**
 * The category list, fetched once and shared.
 *
 * Categories used to be a hardcoded array in AdminProducts.jsx and ten
 * hardcoded route elements in App.jsx, which meant adding one required a
 * developer and a redeploy. They now live in the `categories` table.
 *
 * A tiny module-level cache keeps navigation between category pages from
 * re-fetching the same ten rows on every click. `refresh()` bypasses it, which
 * is what the admin panel uses after an edit.
 */

let cache = null;
let inFlight = null;

async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export function invalidateCategories() {
  cache = null;
  inFlight = null;
}

export default function useCategories({ activeOnly = true } = {}) {
  const [categories, setCategories] = useState(cache || []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState(null);

  const load = useCallback(async (force = false) => {
    if (force) invalidateCategories();

    if (cache && !force) {
      setCategories(cache);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // De-duplicate concurrent mounts (nav + page both ask on first paint).
      inFlight = inFlight || fetchCategories();
      const data = await inFlight;
      cache = data;
      setCategories(data);
    } catch (err) {
      console.error('[Galanteria] Failed to load categories', err);
      setError(err);
    } finally {
      inFlight = null;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = activeOnly ? categories.filter((c) => c.is_active !== false) : categories;

  return { categories: visible, loading, error, refresh: () => load(true) };
}
