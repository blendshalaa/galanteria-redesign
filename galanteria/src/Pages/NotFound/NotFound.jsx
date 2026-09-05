import { Link } from 'react-router-dom';
import useLang from '../../Hooks/useLang';
import useSEO from '../../Hooks/useSEO';
import './NotFound.scss';

/**
 * The app previously had no `path="*"` route at all, so a mistyped or expired
 * URL rendered the navbar, the footer, and nothing in between. Two 404
 * components existed in the repo (Components/NotFound.jsx, Pages/Error/) but
 * neither was ever imported.
 */
const NotFound = () => {
  const { t } = useLang();

  useSEO({
    title: `404 — ${t('notFoundTitle')} | Galanteria Group`,
    description: t('notFoundBody'),
    noIndex: true,
  });

  return (
    <div className="notfound-page">
      <p className="notfound-code">404</p>
      <h1>{t('notFoundTitle')}</h1>
      <p className="notfound-body">{t('notFoundBody')}</p>
      <Link to="/" className="notfound-link">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        {t('backHome')}
      </Link>
    </div>
  );
};

export default NotFound;
