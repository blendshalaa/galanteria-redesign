import React, { useContext, useEffect } from 'react'
import './OfficeChairs.scss'
import NavBar from '../../Components/NavBar/NavBar'
import Footer from '../Footer/Footer'
import oc1 from '../../assets/images/LIGHT (2).jpg'
import oc2 from '../../assets/images/GIULIA.jpg'
import oc3 from '../../assets/images/JET.png'
import oc4 from '../../assets/images/KING.jpg'
import oc5 from '../../assets/images/MALIQE.png'
import oc6 from '../../assets/images/QUEEN.jpg'
import oc7 from '../../assets/images/KLASS.jpg'
import oc8 from '../../assets/images/KONA.png'
import oc9 from '../../assets/images/REMIX.jpg'
import oc10 from '../../assets/images/DIVAA.jpg'
import oc11 from '../../assets/images/VIOLA.jpg'
import oc12 from '../../assets/images/ANCONA.png'
import oc13 from '../../assets/images/ELECTRA.jpg'
import oc14 from '../../assets/images/MOET.jpg'

import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import language from '../../lang'
import LangFlag from '../../Components/NavBar/LangFlag'
import Language from '../../Components/NavBar/Language'
import { Context } from '../../Components/Context/Products'


const OfficeChairs = () => {
  useEffect(() => {
    // Scroll to the top of the page with smooth behavior when the component mounts
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);
  const [{ lang }] = useContext(Context);


  const navigate = useNavigate();

  const goToProduct = (e) => {
    navigate(`/product/${e}`);
    console.log("here", e);
  }

  return (
    <>
      <NavBar />
      <div className='officechairs-wrapper'>


        <div className='officechairs-text'>
          <h1> {language[lang]?.officeChairs[0].title}</h1>
        </div>
        <div className='officechairs-images'>
          <div className='images'>
            <div>
              <img onClick={() => goToProduct('light')} src={oc1} alt="" />
              <h4>Light</h4>
            </div>
            <div>
              <img onClick={() => goToProduct('giulia')} src={oc2} alt="" />
              <h4>Giulia</h4>

            </div>
            <div>
              <img onClick={() => goToProduct('jet')} src={oc3} alt="" />
              <h4>Jet</h4>
            </div>
            <div>
              <img onClick={() => goToProduct('king')} src={oc4} alt="" />
              <h4>King</h4>
            </div>

          </div>
          <div className='images'>
            <div>
              <img onClick={() => goToProduct('maliqe')} src={oc5} alt="" />
              <h4>Malice</h4>
            </div>
            <div>
              <img onClick={() => goToProduct('queen')} src={oc6} alt="" />
              <h4>Queen</h4>
            </div>
            <div>
              <img onClick={() => goToProduct('klaas')} src={oc7} alt="" />
              <h4>Klaas</h4>
            </div>
          
          </div>
          <div className='images'>
            <div>
              <img onClick={() => goToProduct('kona')} src={oc8} alt="" />
              <h4>Kona</h4>

            </div>
            <div>
              <img onClick={() => goToProduct('remix')} src={oc9} alt="" />
              <h4>Remix</h4>
            </div>
            <div>
              <img onClick={() => goToProduct('diva')} src={oc10} alt="" />
              <h4>Diva</h4>
            </div>
            <div>
              <img onClick={() => goToProduct('viola')} src={oc11} alt="" />
              <h4>Viola</h4>

            </div>
           

          </div>

          <div className='images'>
            <div>
              <img onClick={() => goToProduct('ancona')} src={oc12} alt="" />
              <h4>Ancona</h4>

            </div>
           

            <div>
              <img onClick={() => goToProduct('electra')} src={oc13} alt="" />
              <h4>Electra</h4>
            </div>
            <div>
              <img onClick={() => goToProduct('moet')} src={oc14} alt="" />
              <h4>Moet</h4>
            </div>

            </div>
          


        </div>


        <hr className='office' />

        <Footer />
      </div>
    </>

  )
}

export default OfficeChairs