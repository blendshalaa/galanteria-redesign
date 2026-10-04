import Link from 'next/link';
import { cn } from '@/lib/cn';

/**
 * The site's buttons.
 *
 * In the SCSS build these were `.btn` / `.btn-primary` / `.btn-ghost` /
 * `.btn-quiet` declared once in index.css and then referenced as bare strings
 * in a dozen files. The classes are gone; the three variants are not, and this
 * is now the one place they are described.
 */

const BASE =
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap ' +
  'rounded-sm border border-transparent font-sans text-sm font-semibold uppercase ' +
  'tracking-[0.1em] transition-all duration-200 ' +
  '[&_svg]:transition-transform [&_svg]:duration-200 hover:[&_svg]:translate-x-1 ' +
  'disabled:cursor-not-allowed disabled:opacity-55';

const VARIANTS = {
  primary: 'px-7 py-3.5 bg-accent border-accent text-[#16120c] hover:bg-accent-light hover:border-accent-light',
  ghost: 'px-7 py-3.5 bg-transparent border-line-hover text-ink hover:border-accent hover:text-accent',
  /* The quieter variant that sits beside a section title. */
  quiet: 'px-5 py-2.5 bg-transparent border-line text-ink-soft hover:border-accent hover:text-accent',
};

export function buttonClasses(variant = 'primary', className = '') {
  return cn(BASE, VARIANTS[variant] ?? VARIANTS.primary, className);
}

export function Button({ variant = 'primary', className, type = 'button', ...props }) {
  return <button type={type} className={buttonClasses(variant, className)} {...props} />;
}

/** A `next/link` wearing the same clothes. Use for in-app navigation. */
export function ButtonLink({ variant = 'primary', className, ...props }) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}

/** The arrow that sits inside every forward-moving button on the site. */
export function Arrow({ className = '' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
