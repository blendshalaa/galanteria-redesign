'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

/**
 * Every category, including the hidden ones, for the admin screens.
 *
 * The public site reads categories on the server; this is the browser-side
 * equivalent for the panel, which needs inactive rows too — a product may
 * legitimately sit in a category the client has temporarily hidden.
 */
export default function useAdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('categories').select('*').order('sort_order');

    if (error) console.error('[Galanteria] Failed to load categories', error);
    setCategories(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { categories, loading, refresh: load };
}
