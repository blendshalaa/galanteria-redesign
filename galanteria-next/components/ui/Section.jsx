import { cn } from '@/lib/cn';

/**
 * The three pieces every section on the site is built from: the accent kicker,
 * the display-face heading, and the block that holds them.
 *
 * Each page used to rebuild these with its own hex codes and its own clamp(),
 * which is how the same rank of heading ended up three different sizes on
 * three different routes.
 */

export function Section({ sunken = false, className, children, ...props }) {
  return (
    <section
      className={cn(
        'px-gutter py-section',
        sunken && 'border-y border-line bg-sunken',
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

/** Section title + optional action, aligned along their baseline. */
export function SectionHead({ className, children }) {
  return (
    <div className={cn('mb-[clamp(2rem,4vw,3.5rem)] flex flex-wrap items-end justify-between gap-6', className)}>
      {children}
    </div>
  );
}

/**
 * The kicker above a heading. The trailing rule was a `::after` pseudo-element
 * in the stylesheet; here it is a real element, which is the same picture with
 * one fewer thing to remember.
 */
export function Eyebrow({ className, children }) {
  return (
    <span
      className={cn(
        'mb-4 flex items-center gap-4 font-sans text-xs font-semibold uppercase',
        'tracking-eyebrow whitespace-nowrap text-accent',
        className
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="block h-px w-[clamp(40px,8vw,110px)] bg-gradient-to-r from-accent-glow to-transparent"
      />
    </span>
  );
}

export function SectionTitle({ as: Tag = 'h2', className, children }) {
  return (
    <Tag
      className={cn(
        'font-display text-2xl leading-[1.08] font-normal tracking-tight text-balance text-ink',
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function SectionLead({ className, children }) {
  return (
    <p className={cn('mt-4 max-w-[52ch] text-md leading-[1.7] font-light text-ink-soft', className)}>
      {children}
    </p>
  );
}
