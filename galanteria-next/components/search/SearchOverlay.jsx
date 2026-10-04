'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { localized } from '@/i18n/ui';
import { useLang } from '@/components/providers/LanguageProvider';
import { Spinner } from '@/components/ui/states';

const DEBOUNCE_MS = 250;
const MIN_QUERY = 2;
const LIMIT = 12;

/**
 * Product search.
 *
 * The site had no search of any kind — on a catalogue of 50+ products across
 * ten categories, the only way to find a specific item was to guess its
 * category and scroll.
 *
 * This is one of the few public surfaces that still queries from the browser,
 * and rightly so: the query is whatever the visitor is typing, so there is
 * nothing for the server to have rendered in advance.
 */
export default function SearchOverlay({ onClose, categories = [] }) {
  const { lang, t } = useLang();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [mounted, setMounted] = useState(false);

  const inputRef = useRef(null);
  const restoreFocusRef = useRef(null);

  // `createPortal` needs a DOM to aim at, which does not exist during the
  // server render.
  useEffect(() => setMounted(true), []);

  const categoryNames = useMemo(() => {
    const map = {};
    categories.forEach((category) => {
      map[category.slug] = localized(category, 'name', lang);
    });
    return map;
  }, [categories, lang]);

  useEffect(() => {
    restoreFocusRef.current = document.activeElement;
    inputRef.current?.focus();
    return () => restoreFocusRef.current?.focus?.();
  }, [mounted]);

  useEffect(() => {
    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < MIN_QUERY) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    let cancelled = false;

    const timer = setTimeout(async () => {
      // `%` and `_` are wildcards in ILIKE; escaping them keeps a literal
      // search for "100% wool" from matching everything.
      const escaped = trimmed.replace(/[%_\\]/g, (ch) => `\\${ch}`);

      const { data, error } = await supabase
        .from('products')
        .select('id, name, slug, images, thumbnails, category_slug')
        .ilike('name', `%${escaped}%`)
        .limit(LIMIT);

      if (cancelled) return;
      if (error) console.error('[Galanteria] Search failed', error);

      setResults(error ? [] : data || []);
      setSearched(true);
      setLoading(false);
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  if (!mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('search')}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          onClose();
        }
      }}
      onClick={(event) => event.target === event.currentTarget && onClose()}
      className="fixed inset-0 z-9500 flex animate-fade-in justify-center bg-[rgba(8,7,6,0.82)] px-5 pt-[6vh] pb-10 backdrop-blur-[10px] md:pt-[12vh]"
    >
      <div className="flex max-h-[74vh] w-full max-w-[620px] flex-col overflow-hidden rounded-lg border border-line bg-card shadow-[0_40px_90px_rgba(0,0,0,0.6)]">
        <div className="flex shrink-0 items-center gap-3 border-b border-line px-4.5 py-4 text-ink-soft">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('search')}
            autoComplete="off"
            className="min-w-0 flex-1 border-none bg-transparent py-1 text-[1rem] text-ink outline-none placeholder:text-ink/32 [&::-webkit-search-cancel-button]:invert-[0.6]"
          />

          {loading && <Spinner size={16} />}

          <button
            type="button"
            onClick={onClose}
            aria-label={t('close')}
            className="flex cursor-pointer p-1 text-inherit transition-colors hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div aria-live="polite" className="overflow-y-auto p-2">
          {query.trim().length < MIN_QUERY && <p className={hintClasses}>{t('searchHint')}</p>}

          {searched && !loading && results.length === 0 && (
            <p className={hintClasses}>
              {t('searchNoResults')} “{query.trim()}”
            </p>
          )}

          {results.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              onClick={onClose}
              className="flex items-center gap-3.5 rounded-[10px] px-3 py-2.5 transition-colors duration-150 hover:bg-white/4 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
            >
              {/* A plain <img>: these are Supabase URLs at thumbnail size, and
                  routing a 56px avatar through the image optimiser would cost
                  more than it saves. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.thumbnails?.[0] || product.images?.[0] || 'https://placehold.co/80x80/1a1815/555?text=%20'}
                alt=""
                loading="lazy"
                width="56"
                height="56"
                className="size-14 shrink-0 rounded-[7px] bg-[#111009] object-cover"
              />
              <span className="flex min-w-0 flex-col gap-[3px]">
                <span className="truncate text-[0.94rem] font-medium text-ink">{product.name}</span>
                {categoryNames[product.category_slug] && (
                  <span className="text-[0.74rem] uppercase tracking-[0.08em] text-ink-muted">
                    {categoryNames[product.category_slug]}
                  </span>
                )}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

const hintClasses = 'px-4.5 py-8.5 text-center text-base text-ink-muted';
