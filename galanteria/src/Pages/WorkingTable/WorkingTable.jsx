import React, { useContext, useEffect } from 'react'
import './WorkingTable.scss'
import NavBar from '../../Components/NavBar/NavBar'
import Footer from '../Footer/Footer'
import rea from '../../assets/images/r004.jpg'
import nice from '../../assets/images/001.jpg'
import hera from '../../assets/images/h002.png'
import hermes from '../../assets/images/004.jpg'
import noble from '../../assets/images/n002.jpg'
import mild from '../../assets/images/m002.jpg'
import lito from '../../assets/images/l001.jpg'
import genius from '../../assets/images/g003.jpg'
import easy from '../../assets/images/e003.jpg'
import fors from '../../assets/images/f001.jpg'
import truva from '../../assets/images/t002.jpg'
import windowimg from '../../assets/images/w002.jpg'
import artemis from '../../assets/images/a003.jpg'
import prisma from '../../assets/images/p001.jpg'
import optima from '../../assets/images/o001.jpg'
import kronos from '../../assets/images/k002.jpg'
import uranus from '../../assets/images/u001.jpg'
import others from '../../assets/images/TP001.jpg'

import { useNavigate } from 'react-router-dom'
import language from '../../lang'
import { Context } from '../../Components/Context/Products'


const WorkingTable = () => {

  const [{ lang }] = useContext(Context);

  useEffect(() => {
    // Scroll to the top of the page with smooth behavior when the component mounts
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  


  const navigate = useNavigate();

  const goToProject = (e) => {
    navigate(`/project/${e}`);
    console.log("here", e);
  }

  return (
    <div>
     <NavBar />
      <div className='workingtables-wrapper'>


        <div className='workingtables-text'>
          <h1> {language[lang]?.workingTable[0].title}</h1>
        </div>
        <div className='workingtables-images'>
          <div className='images'>
            <div>
              <img onClick={() => goToProject('rea')} src={rea} alt="" />
              <h4>Rea</h4>
            </div>
            <div>
              <img onClick={() => goToProject('nice')} src={nice} alt="" />
              <h4>Nice</h4>

            </div>
            <div>
              <img onClick={() => goToProject('hera')} src={hera} alt="" />
              <h4>Hera</h4>
            </div>
            <div>
              <img onClick={() => goToProject('hermes')} src={hermes} alt="" />
              <h4>Hermes</h4>
            </div>

          </div>
          <div className='images'>
            <div>
              <img onClick={() => goToProject('noble')} src={noble} alt="" />
              <h4>Noble</h4>
            </div>
            <div>
              <img onClick={() => goToProject('mild')} src={mild} alt="" />
              <h4>Mild</h4>
            </div>
            <div>
              <img onClick={() => goToProject('lito')} src={lito} alt="" />
              <h4>Lito</h4>
            </div>

          </div>
          <div className='images'>
            <div>
              <img onClick={() => goToProject('genius')} src={genius} alt="" />
              <h4>Genius</h4>

            </div>
            <div>
              <img onClick={() => goToProject('easy')} src={easy} alt="" />
              <h4>Easy</h4>
            </div>
            <div>
              <img onClick={() => goToProject('fors')} src={fors} alt="" />
              <h4>Fors</h4>
            </div>
            <div>
              <img onClick={() => goToProject('truva')} src={truva} alt="" />
              <h4>Truva</h4>

            </div>


          </div>

          <div className='images'>
            <div>
              <img onClick={() => goToProject('window')} src={windowimg} alt="" />
              <h4>Truva Window</h4>

            </div>


            <div>
              <img onClick={() => goToProject('artemis')} src={artemis} alt="" />
              <h4>Artemis</h4>
            </div>
            <div>
              <img onClick={() => goToProject('prisma')} src={prisma} alt="" />
              <h4>Prisma</h4>
            </div>

          </div>

          <div className='images'>
            <div>
              <img onClick={() => goToProject('optima')} src={optima} alt="" />
              <h4>Optima</h4>

            </div>
            <div>
              <img onClick={() => goToProject('kronos')} src={kronos} alt="" />
              <h4>Kronos</h4>
            </div>
            <div>
              <img onClick={() => goToProject('uranus')} src={uranus} alt="" />
              <h4>Uranus</h4>
            </div>
            <div>
              <img onClick={() => goToProject('others')} src={others} alt="" />
              <h4>Others</h4>

            </div>


          </div>



        </div>


        <hr className='office' />

        <Footer />
      </div>
    </div>

  )
}

export default WorkingTable;