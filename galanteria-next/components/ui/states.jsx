import { cn } from '@/lib/cn';

/**
 * Loading, empty and error states.
 *
 * A failed fetch used to be indistinguishable from an empty result: every page
 * did `if (!error && data) setState(data)` and then rendered "no products in
 * this category" when the network or an RLS policy had actually rejected the
 * request. Error has its own state here, with a way out of it.
 */

export function Spinner({ size = 18, className }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{ width: size, height: size }}
      className={cn(
        'inline-block shrink-0 animate-spin-slow rounded-full',
        'border-2 border-white/12 border-t-accent',
        'motion-reduce:[animation-duration:1.6s]',
        className
      )}
    />
  );
}

const STATE_SHELL =
  'flex flex-col items-center justify-center gap-3 px-6 py-20 text-center text-ink-soft';

export function LoadingState({ label }) {
  return (
    <div className={cn(STATE_SHELL, 'flex-row py-25')}>
      <Spinner size={22} />
      <p className="text-base">{label}</p>
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className={STATE_SHELL}>
      <BoxIcon />
      {title && <h3 className="text-[1.05rem] font-semibold text-ink">{title}</h3>}
      {description && <p className="max-w-[42ch] text-base leading-relaxed">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title, description, onRetry, retryLabel = 'Retry' }) {
  return (
    <div className={STATE_SHELL} role="alert">
      <AlertIcon />
      {title && <h3 className="text-[1.05rem] font-semibold text-ink">{title}</h3>}
      {description && <p className="max-w-[42ch] text-base leading-relaxed">{description}</p>}
      {onRetry && (
        <button type="button" className={quietPillClasses} onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  );
}

/** The pill used by retry buttons and by the "back home" links beside them. */
export const quietPillClasses =
  'mt-1.5 cursor-pointer rounded-full border border-line bg-white/5 px-5.5 py-2.5 ' +
  'text-base font-semibold text-ink transition-colors duration-200 ' +
  'hover:border-accent/45 hover:bg-accent/14';

/** Grey placeholder tiles that hold a grid's shape while data loads. */
export function SkeletonGrid({ count = 8, className }) {
  return (
    <div
      aria-hidden="true"
      className={cn('grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-7', className)}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className={cn(shimmerClasses, 'aspect-4/5 rounded-md')} />
          <div className={cn(shimmerClasses, 'h-[13px] w-[62%] rounded-[3px]')} />
        </div>
      ))}
    </div>
  );
}

const shimmerClasses =
  'animate-shimmer bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_0px,rgba(255,255,255,0.075)_200px,rgba(255,255,255,0.035)_400px)] ' +
  'bg-[length:800px_100%] motion-reduce:animate-none';

function BoxIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" className="text-ink/18">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" className="text-[rgba(220,80,60,0.45)]">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
