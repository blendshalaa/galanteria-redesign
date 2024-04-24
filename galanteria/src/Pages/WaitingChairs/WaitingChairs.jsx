import React, { useContext } from 'react'
import './WaitingChairs.scss'
import NavBar from '../../Components/NavBar/NavBar'
import Footer from '../Footer/Footer'
import b from '../../assets/images/BARCELONA.png'
import padova from '../../assets/images/PADOVA.jpg'
import monza from '../../assets/images/MONZA.jpg'
import milano from '../../assets/images/MILANO.jpg'
import celia from '../../assets/images/CELIA.jpg'
import lotus from '../../assets/images/LOTUS.jpg'
import roma from '../../assets/images/ROMA.jpg'
import relax from '../../assets/images/RELAX.jpg'
import primo from '../../assets/images/PRIMO.jpg'
import foulard from '../../assets/images/FOULARDD.jpg'
import theater from '../../assets/images/THEATER.png'
import waiting from '../../assets/images/wchairs.png'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import language from '../../lang'
import LangFlag from '../../Components/NavBar/LangFlag'
import Language from '../../Components/NavBar/Language'
import { Context } from '../../Components/Context/Products'


const WaitingChairs = () => {
  const [{ lang }] = useContext(Context);


  const navigate = useNavigate();

  const goToProduct = (e) => {
    navigate(`/product/${e}`);
    console.log("here", e);
  }

  return (
    <>
      <NavBar />
      <div className='waitingchairs-wrapper'>


        <div className='waitingchairs-text'>
          <h1> {language[lang]?.waitingChairs[0].title}</h1>
        </div>
        <div className='waitingchairs-images'>
          <div className='images'>
            <div>
              <img onClick={() => goToProduct('barcelona')} src={b} alt="" />
              <h4>Barcelona</h4>

            </div>
            <div>
              <img onClick={() => goToProduct('padova')} src={padova} alt="" />
              <h4>Padova</h4>

            </div>
            <div>
              <img onClick={() => goToProduct('monza')} src={monza} alt="" />
              <h4>Monza</h4>
            </div>
            <div>
              <img onClick={() => goToProduct('milano')} src={milano} alt="" />
              <h4>Milano</h4>
            </div>

          </div>
          <div className='images'>
            <div>
              <img onClick={() => goToProduct('celia')} src={celia} alt="" />
              <h4>Celia</h4>
            </div>
            <div>
              <img onClick={() => goToProduct('lotus')} src={lotus} alt="" />
              <h4>Lotus</h4>
            </div>
            <div>
              <img onClick={() => goToProduct('roma')} src={roma} alt="" />
              <h4>Roma</h4>
            </div>
            <div>
              <img onClick={() => goToProduct('relax')} src={relax} alt="" />
              <h4>Relax</h4>

            </div>
          
          </div>
          <div className='images'>
            <div>
              <img onClick={() => goToProduct('primo')} src={primo} alt="" />
              <h4>Primo</h4>

            </div>
            <div>
              <img onClick={() => goToProduct('foulard22')} src={foulard} alt="" />
              <h4>Fouldard</h4>
            </div>
            <div>
              <img onClick={() => goToProduct('theater')} src={theater} alt="" />
              <h4>Theater</h4>
            </div>
            <div>
              <img onClick={() => goToProduct('waiting')} src={waiting} alt="" />
              <h4>Waiting Chairs</h4>

            </div>
           

          </div>

       


        </div>


        <hr className='office' />

        <Footer />
      </div>
    </>

  )
}

export default WaitingChairs