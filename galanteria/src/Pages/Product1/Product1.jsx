import React, { useContext } from 'react';
import './Product1.scss';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../Footer/Footer';
import language from '../../lang';
import { Context } from '../../Components/Context/Products';

const Product1 = ({ data }) => {
  const [{ lang }] = useContext(Context);

  return (
    <div className='product1-wrapper'>
      <NavBar />
      <div className="product">
        <div className="product-image">


          <img src={data?.firstphoto} alt="" />

        </div>

        <div className='product-text'>
          <h4>{data?.category}</h4>
          <h5>{data?.name}</h5>
          <p>{data?.description}</p>
        </div>
      </div>
      <div className='product-images'>
        {data?.photos.map((photo, index) => (
          <img key={index} src={photo} alt="" />
        ))}
      </div>
      <hr />
      <Footer />
    </div>
  );
}

export default Product1;
