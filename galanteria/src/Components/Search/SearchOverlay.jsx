import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import useLang from '../../Hooks/useLang';
import useCategories from '../../Hooks/useCategories';
import { Spinner } from '../ui';
import { localized } from '../../i18n/ui';
import './SearchOverlay.scss';

const DEBOUNCE_MS = 250;
const MIN_QUERY = 2;
const LIMIT = 12;

/**
 * Product search.
 *
 * The site had no search of any kind — on a catalogue with 50+ products across
 * ten categories, the only way to find a specific item was to guess its
 * category and scroll.
 *
 * Matching is a case-insensitive `ilike` on the product name, run against
 * Supabase rather than over a client-side copy of the catalogue, so it stays
 * correct as the client adds products and costs nothing on first paint.
 */
const SearchOverlay = ({ onClose }) => {
  const { lang, t } = useLang();
  const { categories } = useCategories();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const inputRef = useRef(null);
  const restoreFocusRef = useRef(null);

  const categoryNames = useMemo(() => {
    const map = {};
    categories.forEach((c) => { map[c.slug] = localized(c, 'name', lang); });
    return map;
  }, [categories, lang]);

  useEffect(() => {
    restoreFocusRef.current = document.activeElement;
    inputRef.current?.focus();
    return () => restoreFocusRef.current?.focus?.();
  }, []);

  useEffect(() => {
    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = 'hidden';
    return () => { body.style.overflow = previous; };
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

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
    }
  };

  return createPortal(
    <div
      className="search-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t('search')}
      onKeyDown={handleKeyDown}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="search-panel">
        <div className="search-input-row">
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
          />

          {loading && <Spinner size={16} />}

          <button type="button" className="search-close" onClick={onClose} aria-label={t('close')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="search-results" aria-live="polite">
          {query.trim().length < MIN_QUERY && (
            <p className="search-hint">{t('searchHint')}</p>
          )}

          {searched && !loading && results.length === 0 && (
            <p className="search-hint">
              {t('searchNoResults')} “{query.trim()}”
            </p>
          )}

          {results.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="search-result"
              onClick={onClose}
            >
              <img
                src={
                  product.thumbnails?.[0] ||
                  product.images?.[0] ||
                  'https://placehold.co/80x80/1a1815/555?text=%20'
                }
                alt=""
                loading="lazy"
                width="56"
                height="56"
              />
              <span className="search-result-text">
                <span className="search-result-name">{product.name}</span>
                {categoryNames[product.category_slug] && (
                  <span className="search-result-category">
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
};

export default SearchOverlay;
