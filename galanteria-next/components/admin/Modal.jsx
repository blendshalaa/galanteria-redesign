'use client';

import { useEffect } from 'react';
import { modal } from './ui';
import { cn } from '@/lib/cn';

/**
 * The admin panel's dialog shell.
 *
 * Escape closes it and the page behind it stops scrolling — neither of which
 * the three hand-rolled overlays in the SCSS build did.
 */
export function Modal({ label, title, onClose, children, footer }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      className={modal.overlay}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal="true" aria-label={label || title} className={modal.panel}>
        <div className={modal.header}>
          <h2 className={modal.title}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Mbyll"
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-white/6 hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={modal.body}>{children}</div>

        {footer && <div className={modal.footer}>{footer}</div>}
      </div>
    </div>
  );
}

/** Label + control + error/hint, the shape every admin form field takes. */
export function Field({ label, htmlFor, error, hint, className, children }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <span className="text-sm text-red-300">{error}</span>
      ) : (
        hint && <span className="text-sm text-ink-muted">{hint}</span>
      )}
    </div>
  );
}
