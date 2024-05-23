import React, { useContext, useState, useEffect } from 'react';
import './MeetingTable.scss';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../Footer/Footer';
import m1 from '../../assets/images/MT001.jpg';
import m2 from '../../assets/images/MT002.jpg';
import m3 from '../../assets/images/MT003.jpg';
import m4 from '../../assets/images/MT004.jpg';
import m5 from '../../assets/images/MT005.jpg';
import m6 from '../../assets/images/MT006.jpg';
import m7 from '../../assets/images/MT007.jpg';
import m8 from '../../assets/images/MT008.png';
import m9 from '../../assets/images/MT009.png';
import m10 from '../../assets/images/MT0010.jpg';
import m11 from '../../assets/images/MT0011.jpg';
import m12 from '../../assets/images/R1.png';
import m13 from '../../assets/images/R2.jpg';
import m14 from '../../assets/images/R3.jpg';
import m15 from '../../assets/images/R4.jpg'


import { useNavigate } from 'react-router-dom';
import language from '../../lang';
import { Context } from '../../Components/Context/Products';

const MeetingTable = () => {
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
    { src: m1, alt: "MT001" }, { src: m2, alt: "MT002" }, { src: m3, alt: "MT003" }, { src: m4, alt: "MT004" },
    { src: m5, alt: "MT005" }, { src: m6, alt: "MT006" }, { src: m7, alt: "WS007" }, { src: m8, alt: "MT008" },
    { src: m9, alt: "MT009" }, { src: m10, alt: "MT0010" }, { src: m11, alt: "MT0011" }, { src: m12, alt: "R1" },
    { src: m13, alt: "R2" }, { src: m14, alt: "R3" },  { src: m15, alt: "R4" }, 
    //{ src: m17, alt: "WS0017" }, { src: m18, alt: "WS0018" }, { src: m19, alt: "WS0019" }, { src: m20, alt: "WS0020" },
    //{ src: m21, alt: "WS0021" }, { src: m22, alt: "WS0022" }, { src: m23, alt: "WS0023" }, { src: m24, alt: "WS0024" },
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
          <h1>{language[lang]?.meetingTable[0].title}</h1>
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

export default MeetingTable;
