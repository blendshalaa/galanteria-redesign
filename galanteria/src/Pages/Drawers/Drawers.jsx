import React, { useContext, useState } from 'react';
import './Drawers.scss';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../Footer/Footer';
import s1 from '../../assets/images/ST.jpg'
import s2 from '../../assets/images/ST001.png'
import s3 from '../../assets/images/ST002.jpg'
import s4 from '../../assets/images/ST003.png'
import s5 from '../../assets/images/ST004.jpg'
import s6 from '../../assets/images/ST005.png'



import { useNavigate } from 'react-router-dom';
import language from '../../lang';
import { Context } from '../../Components/Context/Products';

const Drawers = () => {
  const [{ lang }] = useContext(Context);
  const [expandedImage, setExpandedImage] = useState(null);

  const navigate = useNavigate();

  const goToProduct = (e) => {
    navigate(`/product/${e}`);
    console.log("here", e);
  }

  const handleImageClick = (photo) => {
    setExpandedImage(photo);
  };

  const handleCloseExpandedImage = () => {
    setExpandedImage(null);
  };

  const images = [
    { src: s1, alt: "ST" }, { src: s2, alt: "ST001" }, { src: s3, alt: "ST002" }, { src: s4, alt: "ST003" },
    { src: s5, alt: "ST004" }, { src: s6, alt: "ST005" },
  ];

  return (
    <div>
      <NavBar />
      <div className='workstation-wrapper'>
        {expandedImage && (
          <div className="expanded-image-overlay" onClick={handleCloseExpandedImage}>
            <img src={expandedImage} alt="Expanded" />
          </div>
        )}
        <div className='workstation-text'>
          <h1>{language[lang]?.drawers[0].title}</h1>
        </div>
        <div className='workstation-images'>
          {images.map((image, index) => (
            <div key={index} className='image-container'>
              <img src={image.src} alt={image.alt} onClick={() => handleImageClick(image.src)} />
              <h4>{image.alt}</h4>
            </div>
          ))}
        </div>
        <hr className='office' />
        <Footer />
      </div>
    </div>
  );
}

export default Drawers;
