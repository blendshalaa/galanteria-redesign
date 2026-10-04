'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLang } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/cn';

/**
 * Accessible image lightbox.
 *
 * Replaces the inline overlay that used to be written into Product1.jsx and
 * Project1.jsx: a bare `<div onClick>` with no close button, no Escape handler,
 * no way to move between photos, no dialog semantics and no focus management —
 * and the page kept scrolling behind it. Clicking the photo itself closed it,
 * because nothing stopped propagation.
 */
export default function Lightbox({ images = [], startIndex = 0, captions = [], alt = '', onClose }) {
  const { t } = useLang();
  const [index, setIndex] = useState(startIndex);
  const [mounted, setMounted] = useState(false);

  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const restoreFocusRef = useRef(null);
  const touchStartX = useRef(null);

  const count = images.length;
  const hasMultiple = count > 1;

  const goPrev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);
  const goNext = useCallback(() => setIndex((i) => (i + 1) % count), [count]);

  useEffect(() => setMounted(true), []);
  useEffect(() => setIndex(startIndex), [startIndex]);

  // Remember what had focus so it can be handed back on close, and move focus
  // into the dialog so the keyboard is not left behind on the page.
  useEffect(() => {
    if (!mounted) return undefined;
    restoreFocusRef.current = document.activeElement;
    closeButtonRef.current?.focus();
    return () => restoreFocusRef.current?.focus?.();
  }, [mounted]);

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

  if (!count || !mounted) return null;

  const caption = captions?.[index];

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={alt || t('gallery')}
      onKeyDown={handleKeyDown}
      // Only a click on the backdrop itself closes — not one that bubbled up
      // from the image, which is what made the old overlay so frustrating.
      onClick={(event) => event.target === event.currentTarget && onClose()}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null || !hasMultiple) return;
        const delta = event.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) (delta > 0 ? goPrev : goNext)();
        touchStartX.current = null;
      }}
      className="fixed inset-0 z-10000 flex animate-fade-in cursor-zoom-out items-center justify-center bg-[rgba(6,5,4,0.94)] px-3 py-14 backdrop-blur-[8px] md:px-18 md:py-16"
    >
      <button
        type="button"
        ref={closeButtonRef}
        onClick={onClose}
        aria-label={t('close')}
        className={cn(roundButtonClasses, 'absolute right-5 top-5 size-11')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {hasMultiple && (
        <button type="button" onClick={goPrev} aria-label={t('previousImage')} className={cn(roundButtonClasses, navButtonClasses, 'left-[24%] md:left-4')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      <figure className="flex max-h-full max-w-full cursor-default flex-col items-center gap-3.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt={caption ? `${alt} — ${caption}` : alt}
          className="h-auto max-h-[calc(100vh-160px)] w-auto max-w-full rounded-[3px] object-contain shadow-[0_30px_90px_rgba(0,0,0,0.6)]"
        />
        {(caption || hasMultiple) && (
          <figcaption className="flex items-center gap-3.5 text-[0.8rem] uppercase tracking-[0.08em] text-ink/60">
            {caption && <span className="font-semibold text-accent">{caption}</span>}
            {hasMultiple && (
              <span className="tabular-nums">
                {index + 1} / {count}
              </span>
            )}
          </figcaption>
        )}
      </figure>

      {hasMultiple && (
        <button type="button" onClick={goNext} aria-label={t('nextImage')} className={cn(roundButtonClasses, navButtonClasses, 'right-[24%] md:right-4')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
    </div>,
    document.body
  );
}

const roundButtonClasses =
  'flex cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/6 ' +
  'text-ink/75 transition-all duration-200 hover:bg-white/14 hover:text-white';

/* On a phone the arrows would sit on top of the photograph; swiping covers
   that, and the buttons move to the bottom so they stay reachable for anyone
   who cannot swipe. */
const navButtonClasses = 'absolute bottom-4 size-11.5 hover:scale-105 md:bottom-auto md:top-1/2 md:size-13 md:-translate-y-1/2 md:hover:scale-105';
