import { useEffect } from 'react';
import './ui.scss';

/**
 * Small shared primitives.
 *
 * These existed already, but copy-pasted: the Toast was duplicated across three
 * admin files, and the spinner was re-declared as a large inline `style={{}}`
 * object in five places (with `@keyframes spin` defined three separate times in
 * three different SCSS files, one of which only worked because SCSS hoists
 * keyframes and that file happened to always be in the bundle).
 */

export const Spinner = ({ size = 18, className = '' }) => (
  <span
    className={`ui-spinner ${className}`}
    style={{ width: size, height: size }}
    role="status"
    aria-label="Loading"
  />
);

export const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!onClose) return undefined;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`admin-toast ${type}`} role="status" aria-live="polite">
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
        <button type="button" className="toast-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      )}
    </div>
  );
};

export const LoadingState = ({ label }) => (
  <div className="ui-state ui-state--loading">
    <Spinner size={22} />
    <p>{label}</p>
  </div>
);

export const EmptyState = ({ title, description, action }) => (
  <div className="ui-state">
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
    {title && <h3>{title}</h3>}
    {description && <p>{description}</p>}
    {action}
  </div>
);

/**
 * A failed fetch used to be indistinguishable from an empty result: every page
 * did `if (!error && data) setState(data)` and then rendered "no products in
 * this category" when the network or an RLS policy had actually rejected the
 * request. This gives that case its own state, with a way out.
 */
export const ErrorState = ({ title, description, onRetry, retryLabel = 'Retry' }) => (
  <div className="ui-state ui-state--error" role="alert">
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
    {title && <h3>{title}</h3>}
    {description && <p>{description}</p>}
    {onRetry && (
      <button type="button" className="ui-retry-btn" onClick={onRetry}>
        {retryLabel}
      </button>
    )}
  </div>
);

/** Grey placeholder tiles that hold the grid's shape while data loads. */
export const SkeletonGrid = ({ count = 8, className = '' }) => (
  <div className={`ui-skeleton-grid ${className}`} aria-hidden="true">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="ui-skeleton-card">
        <div className="ui-skeleton-image" />
        <div className="ui-skeleton-line" />
      </div>
    ))}
  </div>
);
