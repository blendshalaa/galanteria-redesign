import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Project1.scss';
import useLang from '../../Hooks/useLang';
import useSEO from '../../Hooks/useSEO';
import Lightbox from '../../Components/Lightbox/Lightbox';

/**
 * Project detail view.
 *
 * Three real bugs fixed here:
 *
 * 1. IT CRASHED. The gallery rendered `data.name2[index]` as a caption, but
 *    `name2` was never part of what Project1Page passed in — so any project
 *    with at least one photo threw a TypeError and blanked the page.
 *
 * 2. It rendered its own `<NavBar/>` and `<Footer/>` while already inside
 *    `<Layout/>`, giving this page two stacked fixed navbars and two footers,
 *    the same defect the category pages had.
 *
 * 3. `handleBackClick` read a `scrollPosition` key out of sessionStorage that
 *    nothing in the codebase has ever written, then scrolled to it.
 *
 * The description was also fetched and never displayed, exactly as on the
 * product page.
 */
const Project1 = ({ data = {} }) => {
  const { t } = useLang();
  const navigate = useNavigate();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const photos = data.photos || [];
  const thumbs = data.thumbnails?.length ? data.thumbnails : photos;

  useSEO({
    title: `${data.name} | Galanteria Group`,
    description:
      data.description?.slice(0, 300) ||
      `${data.name} — a completed project by Galanteria Group.`,
    image: photos[0],
    type: 'article',
  });

  return (
    <div className="project1-wrapper">
      <div className="product-topbar">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('back')}
        </button>

        <nav className="product-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">{t('home')}</Link>
          <span aria-hidden="true">/</span>
          <Link to="/Projects">{t('projects')}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{data.name}</span>
        </nav>
      </div>

      <div className="project">
        <div className="project-image">
          {data.firstphoto && (
            <button
              type="button"
              className="project-main-photo"
              onClick={() => setLightboxIndex(0)}
              aria-label={`${data.name} — ${t('gallery')}`}
            >
              <img src={data.firstphoto} alt={data.name} decoding="async" />
            </button>
          )}
        </div>

        <div className="project-text">
          {(data.location || data.year) && (
            <h4>{[data.location, data.year].filter(Boolean).join(' · ')}</h4>
          )}
          <h5>{data.name}</h5>
          {data.description && <p className="project-description">{data.description}</p>}
        </div>
      </div>

      {photos.length > 0 && (
        <div className="project-images">
          {photos.map((photo, index) => (
            <button
              type="button"
              key={photo}
              className="project-image-container"
              onClick={() => setLightboxIndex(index)}
              aria-label={`${data.name} ${index + 1}`}
            >
              <img
                src={thumbs[index] || photo}
                alt={`${data.name} ${index + 1}`}
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={photos}
          startIndex={lightboxIndex}
          alt={data.name}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
};

export default Project1;
