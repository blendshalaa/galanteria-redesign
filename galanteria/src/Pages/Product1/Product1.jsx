import React, { useContext, useState, useEffect } from 'react';
import './Product1.scss';
import language from '../../lang';
import { Context } from '../../Components/Context/Products';
import { useNavigate } from 'react-router-dom';

const Product1 = ({ data = {} }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [{ lang }] = useContext(Context);
  const [expandedImage, setExpandedImage] = useState(null);
  const [activePhoto, setActivePhoto] = useState(null);
  const navigate = useNavigate();

  const handleBackClick = () => {
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    navigate(-1);
    if (scrollPosition) {
      setTimeout(() => window.scrollTo({ top: parseInt(scrollPosition, 10), behavior: 'smooth' }), 0);
    }
  };

  const photos = data.photos || [];
  const codes = data.codep || [];
  const mainPhoto = activePhoto || data.firstphoto;

  return (
    <div className='product1-wrapper'>

      {/* Back navigation */}
      <button className='back-btn' onClick={handleBackClick}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {lang === 'sq' ? 'Kthehu' : lang === 'de' ? 'Zurück' : 'Back'}
      </button>

      {/* Hero — full-width split */}
      <div className='product-hero'>
        <div className='product-hero-image'>
          {expandedImage && (
            <div className='expanded-image-overlay' onClick={() => setExpandedImage(null)}>
              <img src={expandedImage} alt="Expanded" />
            </div>
          )}
          <img
            src={mainPhoto}
            alt={data.name}
            onClick={() => setExpandedImage(mainPhoto)}
          />
        </div>

        <div className='product-hero-info'>
          <span className='product-eyebrow'>{data.category}</span>
          <h1 className='product-title'>{data.name}</h1>

          {/* Thumbnail strip */}
          {photos.length > 0 && (
            <div className='product-thumbs'>
              <div
                className={`thumb ${!activePhoto ? 'thumb--active' : ''}`}
                onClick={() => setActivePhoto(null)}
              >
                <img src={data.firstphoto} alt="" />
              </div>
              {photos.slice(0, 5).map((p, i) => (
                <div
                  key={i}
                  className={`thumb ${activePhoto === p ? 'thumb--active' : ''}`}
                  onClick={() => setActivePhoto(p)}
                >
                  <img src={p} alt="" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full gallery grid */}
      {photos.length > 0 && (
        <div className='product-gallery'>
          <div className='gallery-header'>
            <span className='eyebrow-label'>
              {lang === 'sq' ? 'Galeria' : lang === 'de' ? 'Galerie' : 'Gallery'}
            </span>
          </div>
          <div className='gallery-grid'>
            {photos.map((photo, index) => (
              <div
                key={index}
                className='gallery-item'
                onClick={() => setExpandedImage(photo)}
              >
                <img src={photo} alt={data.name2?.[index] || ''} />
                {data.name2?.[index] && (
                  <span className='gallery-caption'>{data.name2[index]}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Product1;
