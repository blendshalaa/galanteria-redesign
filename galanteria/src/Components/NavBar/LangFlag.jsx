
const LABELS = {
  en: 'EN',
  sq: 'AL',
  de: 'DE',
};

/**
 * The two-letter language label.
 *
 * The previous version had three `if` branches and no final return, so any
 * value outside en/sq/de made the component return `undefined` — which React
 * treats as a render error, not as "render nothing".
 */
const LangFlag = ({ lang }) => <span className="l">{LABELS[lang] ?? String(lang).toUpperCase()}</span>;

export default LangFlag;
