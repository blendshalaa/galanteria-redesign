import React, { useContext, useEffect } from 'react'
import './Aboutus.scss'
import NavBar from '../../Components/NavBar/NavBar'
import aboutimg from '../../assets/images/about.png'
import Footer from '../Footer/Footer'
import language from '../../lang'
import { Context } from '../../Components/Context/Products'





const Aboutus = () => {

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  const [{ lang }] = useContext(Context);

  return (
    <div className='mainAbout'>
      <NavBar />
      <div className='about-us-header'>
        <div className='aboutusheaderP'>
          <h1 className='aboutus-h1'>{language[lang]?.about[0].right1}</h1>
          <p className='aboutus-p'>{language[lang]?.about[0].right2}</p>
        </div>
        <div className='img-container'>
          <img className='aboutimg' src={aboutimg}></img>
        </div>
        <div className='stats-container'>
  <div className='statsTable'>
    <div className='stats-text'>
      <div>
        <h2 className='stats-h2'>1000+</h2>
        <p className='stats-p'>{language[lang]?.about[0].left1}</p>
      </div>
      <div>
        <h2 className='stats-h2'>200+</h2>
        <p className='stats-p'>{language[lang]?.about[0].left2}</p>
      </div>
      <div>
        <h2 className='stats-h2'>15+</h2>
        <p className='stats-p'>{language[lang]?.about[0].left3}</p>
      </div>
    </div>
  </div>
</div>


      </div>
      <div className='solutions'>

        <div className='boxes'>
          <div className='box'>
            <h2 className='box-h2'>{language[lang]?.about[0].bottom1}</h2>
            <p className='box-p'>{language[lang]?.about[0].bottom12}</p>
          </div>
        
          <div className='box'>
            <h2 className='box-h2'>{language[lang]?.about[0].bottom2}</h2>
            <p className='box-p'>{language[lang]?.about[0].bottom21}</p>
          </div>
        </div>
      </div>
 <hr className="line"></hr>

      <Footer />
    </div>
  )
}

export default Aboutus