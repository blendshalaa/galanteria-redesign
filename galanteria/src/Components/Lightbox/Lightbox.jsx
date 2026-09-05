import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useLang from '../../Hooks/useLang';
import './Lightbox.scss';

/**
 * Accessible image lightbox.
 *
 * Replaces the inline overlay previously written into Product1.jsx and
 * Project1.jsx, which was a bare `<div onClick>` rendered inside the page hero.
 * It had no close button, no Escape handler, no way to move between photos, no
 * dialog semantics, no focus management, and the page kept scrolling behind it.
 * Clicking the photo itself closed it, because nothing stopped propagation.
 *
 * Also replaces the never-imported Components/Modal, which had the same
 * problems plus no z-index.
 */
const Lightbox = ({ images = [], startIndex = 0, captions = [], alt = '', onClose }) => {
  const { t } = useLang();
  const [index, setIndex] = useState(startIndex);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const restoreFocusRef = useRef(null);
  const touchStartX = useRef(null);

  const count = images.length;
  const hasMultiple = count > 1;

  const goPrev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);
  const goNext = useCallback(() => setIndex((i) => (i + 1) % count), [count]);

  useEffect(() => setIndex(startIndex), [startIndex]);

  // Remember what had focus so it can be handed back on close, and move focus
  // into the dialog so the keyboard is not left behind on the page.
  useEffect(() => {
    restoreFocusRef.current = document.activeElement;
    closeButtonRef.current?.focus();
    return () => restoreFocusRef.current?.focus?.();
  }, []);

  // Stop the page behind from scrolling, without the layout shift that comes
  // from the scrollbar disappearing.
  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (hasMultiple && event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
        return;
      }

      if (hasMultiple && event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
        return;
      }

      // Focus trap: keep Tab cycling inside the dialog.
      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    },
    [goNext, goPrev, hasMultiple, onClose]
  );

  const onTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event) => {
    if (touchStartX.current === null || !hasMultiple) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) (delta > 0 ? goPrev : goNext)();
    touchStartX.current = null;
  };

  if (!count) return null;

  const caption = captions?.[index];

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={alt || t('gallery')}
      ref={dialogRef}
      onKeyDown={handleKeyDown}
      // Only a click on the backdrop itself closes — not one that bubbled up
      // from the image, which is what made the old overlay so frustrating.
      onClick={(event) => event.target === event.currentTarget && onClose()}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        type="button"
        className="lightbox-close"
        onClick={onClose}
        aria-label={t('close')}
        ref={closeButtonRef}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {hasMultiple && (
        <button
          type="button"
          className="lightbox-nav lightbox-nav--prev"
          onClick={goPrev}
          aria-label={t('previousImage')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      <figure className="lightbox-figure">
        <img src={images[index]} alt={caption ? `${alt} — ${caption}` : alt} />
        {(caption || hasMultiple) && (
          <figcaption>
            {caption && <span className="lightbox-caption">{caption}</span>}
            {hasMultiple && (
              <span className="lightbox-counter">
                {index + 1} / {count}
              </span>
            )}
          </figcaption>
        )}
      </figure>

      {hasMultiple && (
        <button
          type="button"
          className="lightbox-nav lightbox-nav--next"
          onClick={goNext}
          aria-label={t('nextImage')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
    </div>,
    document.body
  );
};

export default Lightbox;
