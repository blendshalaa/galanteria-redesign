import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Reads the content the admin panel writes but that nothing on the public site
 * was ever reading.
 *
 * Three admin tabs were effectively write-only:
 *
 *   - "Hero Slider" managed the `hero_images` table, but HomePage rendered six
 *     hardcoded `import` statements. The client could upload hero photos all
 *     day and the homepage never changed.
 *   - "Cilësimet" saved `about_text` into `settings`, but Aboutus.jsx read
 *     src/lang.js.
 *   - The same tab managed a `testimonials` table, while HomePage built its
 *     carousel from a hardcoded local array.
 *
 * Every hook here takes a fallback, so the site degrades to its current content
 * if a table is empty rather than rendering a blank section.
 */

export function useHeroImages(fallback = []) {
  const [images, setImages] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const { data, error } = await supabase
        .from('hero_images')
        .select('id, url, sort_order')
        .order('sort_order', { ascending: true });

      if (!active) return;
      if (error) console.error('[Galanteria] Failed to load hero images', error);

      setImages(data?.length ? data.map((row) => row.url) : fallback);
      setLoading(false);
    })();

    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { images, loading };
}

export function useTestimonials(fallback = []) {
  const [testimonials, setTestimonials] = useState(fallback);

  useEffect(() => {
    let active = true;

    (async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, name, company, text')
        .order('created_at', { ascending: true });

      if (!active) return;
      if (error) console.error('[Galanteria] Failed to load testimonials', error);

      setTestimonials(data?.length ? data : fallback);
    })();

    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return testimonials;
}

/**
 * One row out of the `settings` table, keyed by name. `about_text` holds
 * `{ sq, en, de }`.
 */
export function useSetting(key, fallback = null) {
  const [value, setValue] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', key)
        .maybeSingle();

      if (!active) return;
      if (error) console.error(`[Galanteria] Failed to load setting "${key}"`, error);

      setValue(data?.value ?? fallback);
      setLoading(false);
    })();

    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { value, loading };
}
