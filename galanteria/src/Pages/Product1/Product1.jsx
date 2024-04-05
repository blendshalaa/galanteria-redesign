import React, {useContext} from 'react'
import './Product1.scss';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../Footer/Footer';
  import b5 from '../../assets/images/s2.png'
  import language from '../../lang';
import Language from '../../Components/NavBar/Language';
import { Context } from '../../Components/Context/Products';

const Product1 = ({data}) => {
  console.log("Data received in Product1:", data);



  const [{ lang }] = useContext(Context);

  return (
    <div className='product1-wrapper'>
      <NavBar/>


<div className="product">
  <div className='product-images'>
<img src={b5} alt="" />
  </div>
  <div className='product-text'>
    <h4>{data?.category}</h4>
    <h5>{data?.name}</h5>
    <p>{data?.description}</p>
  </div>
</div>
<hr />
      <Footer/>
      </div>
  )
}

export default Product1