/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from 'react'
import './Aboutus.scss'
import NavBar from '../../Components/NavBar/NavBar'
import aboutimg from '../../assets/images/o001.jpg'
// import periudhaimg from '../../assets/images/p3.png'
// import periudhaimg1 from '../../assets/images/periudha1.png'
import Footer from '../Footer/Footer'
import language from '../../lang'
import { Context } from '../../Components/Context/Products'





const Aboutus = () => {

  useEffect(() => {
    // Scroll to the top of the page with smooth behavior when the component mounts
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
      <div className='solutions'>
        {/* <h2 className='solution-h2'>WE ARE BEST SOLUTIONS<br/> FOR YOUR HOME</h2> */}

        <div className='boxes'>
          <div className='box'>
            <h2 className='box-h2'>{language[lang]?.about[0].bottom1}</h2>
            <p className='box-p'>{language[lang]?.about[0].bottom12}</p>
          </div>
          {/* <div className='box'>
      <h2 className='box-h2'>WHAT WE OFFER</h2>
      <p className='box-p'>Office furniture, School Furniture,<br/>  University Furniture, Hotel Furniture<br/>  Working desks, shelves, cupboards,<br/> conference  tables, hangnails etc.</p>
    </div> */}
          <div className='box'>
            <h2 className='box-h2'>{language[lang]?.about[0].bottom2}</h2>
            <p className='box-p'>{language[lang]?.about[0].bottom21}</p>
          </div>
        </div>
      </div>
      <div className='line'>

      </div>

      {/* <div className='periudhat'>
  <div className='periudha-1'>
    <div className='pimg-container'>
      <img src={periudhaimg} alt='foto'></img>
    </div>
    <div className='text-periudha'>
      <h3 className='h3-periudha'>Periudha <span className='periudha-span'>1987-1999</span></h3>
      <p className='periudha-p'>Excellence and development of human,<br/> technical and technological capacities,<br/> for the fulfillment of the companys mission.</p>
    </div>
  </div>
  <div className='periudha-2'>
    
    <div className='text-periudha'>
      <h3 className='h3-periudha'>Periudha <span className='periudha-span'>1987-1999</span></h3>
      <p className='periudha-p'>Excellence and development of human,<br/> technical and technological capacities,<br/> for the fulfillment of the companys mission.</p>
    </div>
    <div className='pimg-container'>
      <img src={periudhaimg1}></img>
    </div>
  </div>

</div> */}




      {/* <div className='periudhat-2'>
<div className='periudha-1'>
    <div className='pimg-container'>
      <img src={periudhaimg} alt='foto'></img>
    </div>
    <div className='text-periudha'>
      <h3 className='h3-periudha'>Periudha <span className='periudha-span'>1987-1999</span></h3>
      <p className='periudha-p'>Excellence and development of human,<br/> technical and technological capacities,<br/> for the fulfillment of the companys mission.</p>
    </div>
  </div>
  <div className='periudha-2'>
    
    <div className='text-periudha'>
      <h3 className='h3-periudha'>Periudha <span className='periudha-span'>1987-1999</span></h3>
      <p className='periudha-p'>Excellence and development of human,<br/> technical and technological capacities,<br/> for the fulfillment of the companys mission.</p>
    </div>
    <div className='pimg-container'>
      <img src={periudhaimg1}></img>
    </div>
  </div>
</div> */}
      {/* <div className='line'>
</div> */}

      <Footer />

    </div>
  )
}

export default Aboutus