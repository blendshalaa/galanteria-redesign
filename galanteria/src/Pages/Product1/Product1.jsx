import React, { useContext, useState, useEffect } from 'react';
import './Product1.scss';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../Footer/Footer';
import language from '../../lang';
import { Context } from '../../Components/Context/Products';

const Product1 = ({ data }) => {
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

  const handleImageClick = (photo) => {
    setExpandedImage(photo);
  };

  const handleCloseExpandedImage = () => {
    setExpandedImage(null);
  };

  return (
    <div className='product1-wrapper'>
      <NavBar />
      <div className="product">
        <div className="product-image">
          {expandedImage && (
            <div className="expanded-image-overlay" onClick={handleCloseExpandedImage}>
              <img src={expandedImage} alt="Expanded" />
            </div>
          )}
          <img src={data?.firstphoto} alt="" onClick={() => handleImageClick(data?.firstphoto)} />
        </div>
        <div className='product-text'>
          <h4>{data?.category}</h4>
          <h5>{data?.name}</h5>
          <p>{data?.description}</p>
        </div>
      </div>
      <div className='product-images'>
        {data?.photos.map((photo, index) => (
          <img key={index} src={photo} alt="" onClick={() => handleImageClick(photo)} />
        ))}
      </div>
      <hr />
      <Footer />
    </div>
  );
}

export default Product1;
