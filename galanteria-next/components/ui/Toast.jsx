'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/cn';

/**
 * The admin panel's confirmation banner. It was copy-pasted across three admin
 * files before, each with its own timeout handling.
 */
export function Toast({ message, type = 'success', onClose, duration = 3500 }) {
  useEffect(() => {
    if (!onClose) return undefined;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-6 left-1/2 z-100 flex -translate-x-1/2 items-center gap-2.5',
        'rounded-full border px-5 py-3 text-base font-medium shadow-lg backdrop-blur-md',
        type === 'success'
          ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200'
          : 'border-red-400/30 bg-red-500/15 text-red-200'
      )}
    >
      {type === 'success' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )}
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="ml-1 cursor-pointer px-0.5 text-sm leading-none opacity-55 hover:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  );
}
