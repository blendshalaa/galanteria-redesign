'use client';

import { useLang } from '@/components/providers/LanguageProvider';

/**
 * Lets a keyboard user jump past the navigation, which is otherwise about
 * fifteen tab stops on every single page. Visible only while focused.
 */
export default function SkipLink() {
  const { t } = useLang();

  return (
    <a
      href="#main-content"
      className="fixed left-1/2 top-0 z-2000 -translate-x-1/2 -translate-y-[120%] rounded-b-md bg-accent px-6 py-3 text-[0.85rem] font-semibold text-page-2 transition-transform duration-200 focus:translate-y-0"
    >
      {t('skipToContent')}
    </a>
  );
}
