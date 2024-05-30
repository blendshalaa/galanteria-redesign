import React, { useContext, useState, useEffect } from 'react';
import './Workstation.scss';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../Footer/Footer';
import w1 from '../../assets/images/WS001.jpg';
import w2 from '../../assets/images/WS002.jpg';
import w3 from '../../assets/images/WS003.jpg';
import w4 from '../../assets/images/WS004.jpg';
import w5 from '../../assets/images/WS005.jpg';
import w6 from '../../assets/images/WS006.jpg';
import w7 from '../../assets/images/WS007.jpg';
import w8 from '../../assets/images/WS008.jpg';
import w9 from '../../assets/images/WS009.jpg';
import w10 from '../../assets/images/WS0010.jpg';
import w11 from '../../assets/images/WS0011.jpg';
import w12 from '../../assets/images/WS0012.jpg';
import w13 from '../../assets/images/WS0013.jpg';
import w14 from '../../assets/images/WS0014.jpg';
import w15 from '../../assets/images/WS0015.jpg';
import w16 from '../../assets/images/WS0016.jpg';
import w17 from '../../assets/images/WS0017.png';
import w18 from '../../assets/images/WS0018.jpg';
import w19 from '../../assets/images/WS0019.jpg';
import w20 from '../../assets/images/WS0020.jpg';
import w21 from '../../assets/images/WS0021.jpg';
import w22 from '../../assets/images/WS0022.jpg';
import w23 from '../../assets/images/WS0023.jpg';
import w24 from '../../assets/images/WS0024.png';
import w25 from '../../assets/images/WS0025.jpg';
import w26 from '../../assets/images/WS0026.jpg';
import w27 from '../../assets/images/WS0027.jpg';
import w28 from '../../assets/images/WS0028.jpg';

import { useNavigate } from 'react-router-dom';
import language from '../../lang';
import { Context } from '../../Components/Context/Products';

const Workstation = () => {
  useEffect(() => {
    // Scroll to the top of the page with smooth behavior when the component mounts
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);
  const [{ lang }] = useContext(Context);
  const [expandedImage, setExpandedImage] = useState(null);

  const navigate = useNavigate();

  const goToProject = (e) => {
    navigate(`/project/${e}`);
    console.log("here", e);
  }

  const handleImageClick = (photo) => {
    setExpandedImage(photo);
  };

  const handleCloseExpandedImage = () => {
    setExpandedImage(null);
  };

  const images = [
    { src: w1, alt: "WS001" }, { src: w2, alt: "WS002" }, { src: w3, alt: "WS003" }, { src: w4, alt: "WS004" },
    { src: w5, alt: "WS005" }, { src: w6, alt: "WS006" }, { src: w7, alt: "WS007" }, { src: w8, alt: "WS008" },
    { src: w9, alt: "WS009" }, { src: w10, alt: "WS0010" }, { src: w11, alt: "WS0011" }, { src: w12, alt: "WS0012" },
    { src: w13, alt: "WS0013" }, { src: w14, alt: "WS0014" }, { src: w15, alt: "WS0015" }, { src: w16, alt: "WS0016" },
    { src: w17, alt: "WS0017" }, { src: w18, alt: "WS0018" }, { src: w19, alt: "WS0019" }, { src: w20, alt: "WS0020" },
    { src: w21, alt: "WS0021" }, { src: w22, alt: "WS0022" }, { src: w23, alt: "WS0023" }, { src: w24, alt: "WS0024" },
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
          <h1>{language[lang]?.workingstation[0].title}</h1>
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

export default Workstation;
