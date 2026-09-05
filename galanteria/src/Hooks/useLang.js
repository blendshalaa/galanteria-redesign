import { useCallback, useContext, useMemo } from 'react';
import { Context } from '../Components/Context/Products';
import { t as translate, SUPPORTED_LANGS } from '../i18n/ui';

/**
 * The language context, plus a bound `t()`.
 *
 * Replaces the pattern repeated in every component:
 *
 *   const [{ lang }] = useContext(Context);
 *   ...
 *   {lang === 'sq' ? 'Shiko' : lang === 'de' ? 'Ansehen' : 'View'}
 *
 * Those inline three-way ternaries are why several strings were only ever
 * written in one language.
 */
export default function useLang() {
  const [state, dispatch] = useContext(Context);

  const lang = SUPPORTED_LANGS.includes(state?.lang) ? state.lang : 'en';

  const t = useCallback((key) => translate(lang, key), [lang]);

  const setLang = useCallback(
    (next) => {
      if (!SUPPORTED_LANGS.includes(next)) return;
      localStorage.setItem('lang', next);
      dispatch({ type: 'LANG', payload: { lang: next } });
    },
    [dispatch]
  );

  return useMemo(() => ({ lang, t, setLang }), [lang, t, setLang]);
}
