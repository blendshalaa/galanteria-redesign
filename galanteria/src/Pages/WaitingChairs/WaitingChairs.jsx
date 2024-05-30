import React, { useContext, useEffect } from 'react'
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

  const goToProject = (e) => {
    navigate(`/project/${e}`);
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
              <img onClick={() => goToProject('barcelona')} src={b} alt="" />
              <h4>Barcelona</h4>

            </div>
            <div>
              <img onClick={() => goToProject('padova')} src={padova} alt="" />
              <h4>Padova</h4>

            </div>
            <div>
              <img onClick={() => goToProject('monza')} src={monza} alt="" />
              <h4>Monza</h4>
            </div>
            <div>
              <img onClick={() => goToProject('milano')} src={milano} alt="" />
              <h4>Milano</h4>
            </div>

          </div>
          <div className='images'>
            <div>
              <img onClick={() => goToProject('celia')} src={celia} alt="" />
              <h4>Celia</h4>
            </div>
            <div>
              <img onClick={() => goToProject('lotus')} src={lotus} alt="" />
              <h4>Lotus</h4>
            </div>
            <div>
              <img onClick={() => goToProject('roma')} src={roma} alt="" />
              <h4>Roma</h4>
            </div>
            <div>
              <img onClick={() => goToProject('relax')} src={relax} alt="" />
              <h4>Relax</h4>

            </div>
          
          </div>
          <div className='images'>
            <div>
              <img onClick={() => goToProject('primo')} src={primo} alt="" />
              <h4>Primo</h4>

            </div>
            <div>
              <img onClick={() => goToProject('foulard22')} src={foulard} alt="" />
              <h4>Fouldard</h4>
            </div>
            <div>
              <img onClick={() => goToProject('theater')} src={theater} alt="" />
              <h4>Theater</h4>
            </div>
            <div>
              <img onClick={() => goToProject('waiting')} src={waiting} alt="" />
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