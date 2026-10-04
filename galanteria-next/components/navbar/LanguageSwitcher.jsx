'use client';

import { SUPPORTED_LANGS } from '@/i18n/ui';
import { useLang } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/cn';

/**
 * Language switcher.
 *
 * These were three `<a className="lang" onClick>` elements with no href, so
 * they were not focusable, were not announced as controls, and could not be
 * activated from a keyboard — and nothing indicated which language was
 * currently selected. They are buttons with `aria-pressed` now.
 */

const LABELS = { en: 'EN', sq: 'AL', de: 'DE' };

export default function LanguageSwitcher({ size = 'sm', className }) {
  const { lang, setLang } = useLang();

  return (
    <div role="group" aria-label="Language" className={cn('flex items-center gap-0.5', className)}>
      {SUPPORTED_LANGS.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={cn(
            'cursor-pointer rounded-sm font-semibold tracking-[0.08em] transition-colors duration-150',
            size === 'lg' ? 'px-4 py-2.5 text-[0.82rem]' : 'px-2.5 py-1.5 text-xs',
            lang === code ? 'bg-accent-dim text-accent' : 'text-ink hover:text-accent'
          )}
        >
          {LABELS[code] ?? String(code).toUpperCase()}
        </button>
      ))}
    </div>
  );
}
