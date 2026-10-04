import { cn } from '@/lib/cn';

/**
 * The admin panel's shared class strings.
 *
 * AdminDashboard.scss was 1,302 lines describing a card, a table, a modal, a
 * form field and three button variants — and it opened with a global
 * `*, *::before, *::after` reset plus its own `:root` block redefining the
 * palette under different names (`--admin-bg`, `--admin-card`, …) that happened
 * to hold the same values as the site's tokens.
 *
 * The palette is the site's; these constants are the repeated shapes. Anything
 * used once lives inline at its call site, where it can be read next to the
 * markup it applies to.
 */

export const card = 'overflow-hidden rounded-2xl border border-line bg-card';

export const pageHeader = 'mb-8 flex flex-wrap items-end justify-between gap-4';

export const btn = {
  base:
    'inline-flex cursor-pointer items-center gap-2 rounded-[10px] px-5 py-2.5 text-[0.85rem] ' +
    'font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-55',
  primary: 'bg-accent text-[#16120c] hover:bg-accent-light',
  ghost: 'border border-line bg-transparent text-ink-soft hover:border-line-hover hover:text-ink',
  danger: 'border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20',
};

export function adminBtn(variant = 'primary', className) {
  return cn(btn.base, btn[variant] ?? btn.primary, className);
}

export const iconBtn =
  'flex size-8.5 cursor-pointer items-center justify-center rounded-lg border border-line ' +
  'text-ink-muted transition-all duration-150 hover:border-line-hover hover:text-ink ' +
  'disabled:cursor-not-allowed disabled:opacity-40';

export const iconBtnDanger =
  'flex size-8.5 cursor-pointer items-center justify-center rounded-lg border border-red-500/25 ' +
  'text-red-300/80 transition-all duration-150 hover:bg-red-500/15 hover:text-red-200';

export const table = {
  root: 'w-full border-collapse text-left',
  head: 'border-b border-line bg-white/2 px-5 py-3.5 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-ink-muted',
  cell: 'border-b border-line px-5 py-3.5 align-middle text-base text-ink-soft last:text-right',
  row: 'transition-colors hover:bg-white/2',
  name: 'font-semibold text-ink',
  sub: 'mt-0.5 text-sm text-ink-muted',
  thumb: 'size-13 rounded-lg border border-line bg-white/3 object-cover',
};

export const field = {
  group: 'flex flex-col gap-2',
  label: 'text-xs font-semibold uppercase tracking-eyebrow text-ink-muted',
  control:
    'w-full rounded-[10px] border border-line bg-page/60 px-3.5 py-2.5 font-sans text-base text-ink ' +
    'outline-none transition-colors duration-150 placeholder:text-ink/25 focus:border-accent',
  hint: 'text-sm text-ink-muted',
};

export const modal = {
  overlay:
    'fixed inset-0 z-200 flex animate-fade-in items-center justify-center bg-black/75 p-6 backdrop-blur-[8px]',
  panel:
    'max-h-[90vh] w-full max-w-160 animate-fade-up overflow-y-auto rounded-[20px] border border-line ' +
    'bg-card shadow-[0_40px_80px_rgba(0,0,0,0.7)]',
  header: 'flex items-center justify-between gap-4 border-b border-line px-7 py-6',
  title: 'font-display text-xl font-normal text-ink',
  body: 'flex flex-col gap-5 px-7 py-6',
  footer: 'flex flex-wrap justify-end gap-3 border-t border-line px-7 py-5',
};

export const emptyState =
  'flex flex-col items-center justify-center gap-3 px-6 py-20 text-center text-ink-soft';
