import React, { useContext, useState } from 'react';
import './Cabinets.scss';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../Footer/Footer';
import c1 from '../../assets/images/CB001.jpg'
import c2 from '../../assets/images/CB002.jpg'
import c3 from '../../assets/images/CB003.jpg'
import c4 from '../../assets/images/CB004.jpg'
import c5 from '../../assets/images/CB005.jpg'
import c6 from '../../assets/images/CB006.jpg'
import c7 from '../../assets/images/CB007.jpg'
import c8 from '../../assets/images/CB008.jpg'
import c9 from '../../assets/images/CB009.jpg'
import c10 from '../../assets/images/CB0010.jpg'
import c11 from '../../assets/images/CB0011.jpg'
import c12 from '../../assets/images/CB0012.jpg'
import c13 from '../../assets/images/CB0013.jpg'
import c14 from '../../assets/images/CB0014.jpg'


import { useNavigate } from 'react-router-dom';
import language from '../../lang';
import { Context } from '../../Components/Context/Products';

const Cabinets = () => {
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
    { src: c1, alt: "CB001" }, { src: c2, alt: "CB002" }, { src: c3, alt: "CB003" }, { src: c4, alt: "CB004" },
    { src: c5, alt: "CB005" }, { src: c6, alt: "CB006" }, { src: c7, alt: "CB007" }, { src: c8, alt: "CB008" },
    { src: c9, alt: "CB009" }, { src: c10, alt: "CB0010" }, { src: c11, alt: "CB0011" }, { src: c12, alt: "CB0012" },
    { src: c13, alt: "CB0013" }, { src: c14, alt: "CB0014" },
    // { src: w25, alt: "WS0025" }, { src: w26, alt: "WS0026" }, { src: w27, alt: "WS0027" }, { src: w28, alt: "WS0028" }
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
          <h1>{language[lang]?.cabinets[0].title}</h1>
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

export default Cabinets;
