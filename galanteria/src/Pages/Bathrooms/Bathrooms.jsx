import React, {useContext} from 'react'
import './Bathrooms.scss'
import NavBar from '../../Components/NavBar/NavBar'
import Footer from '../Footer/Footer'
import b1 from '../../assets/images/Frame 16.png'
import b2 from '../../assets/images/Frame 15.png'
import b3 from '../../assets/images/s1.png'
import b4 from '../../assets/images/Frame 18.png'
import b5 from '../../assets/images/s2.png'
import b6 from '../../assets/images/Frame 17.png'
import b7 from '../../assets/images/s3.png'
import b8 from '../../assets/images/s4.png'
import b9 from '../../assets/images/Frame 15.png'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import language from '../../lang'
import LangFlag from '../../Components/NavBar/LangFlag'
import Language from '../../Components/NavBar/Language'
import { Context } from '../../Components/Context/Products'


const Bathrooms = () => {
  const [{ lang }] = useContext(Context);


  const navigate = useNavigate();

  const goToProduct = (e) => {
    navigate(`/product/${e}`);
    console.log("here", e);
  }

  return (
    <> 
     <NavBar/>
    <div className='bathrooms-wrapper'>
    

      <div className='bathrooms-text'>
        <h1> {language[lang]?.bathroom[0].title}</h1>
      </div>
      <div className='bathrooms-images'>
        <div className='images'>
          <img onClick={() => goToProduct('first')}  src={b1} alt="" />

          <img onClick={() => goToProduct('first')}  src={b2} alt="" />
          <img onClick={() => goToProduct('first')}  src={b3} alt="" />

        </div>
        <div className='images'>
        <img onClick={() => goToProduct('first')}  src={b4} alt="" />
        <img onClick={() => goToProduct('first')}  src={b5} alt="" />
        <img onClick={() => goToProduct('first')}  src={b6} alt="" />

        </div>
        <div className='images'>
        <img onClick={() => goToProduct('first')}  src={b7} alt="" />
        <img onClick={() => goToProduct('first')}  src={b8} alt="" />
        <img onClick={() => goToProduct('first')}  src={b9} alt="" />

        </div>
        
      
      </div>


<hr className='bath' />

      <Footer/>
      </div>
    </>
    
  )
}

export default Bathrooms