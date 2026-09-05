import useLang from '../../Hooks/useLang';
import { SUPPORTED_LANGS } from '../../i18n/ui';
import LangFlag from './LangFlag';

/**
 * Language switcher.
 *
 * Previously three `<a className="lang" onClick={...}>` elements with no href,
 * which means they were not focusable, were not announced as controls, and
 * could not be activated from a keyboard. There was also no indication of
 * which language was currently active, and the component ran a mount effect
 * that re-dispatched the stored language on every render pass — while being
 * mounted twice (once for desktop, once for mobile), so it fired twice.
 *
 * The initial language is read once in Components/Context/Products.jsx, which
 * is where it belongs.
 */
const Language = () => {
  const { lang, setLang } = useLang();

  return (
    <div className="language" role="group" aria-label="Language">
      {SUPPORTED_LANGS.map((code) => (
        <button
          key={code}
          type="button"
          className={`lang ${lang === code ? 'lang--active' : ''}`}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          lang={code}
        >
          <LangFlag lang={code} />
        </button>
      ))}
    </div>
  );
};

export default Language;
