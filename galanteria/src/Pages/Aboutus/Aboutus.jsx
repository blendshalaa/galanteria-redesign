/* eslint-disable no-unused-vars */
import React from 'react'
import './Aboutus.scss'
import NavBar from '../../Components/NavBar/NavBar'
import aboutimg from '../../assets/images/aboutus.png'


const Aboutus = () => {
  return (
    <div>
      <NavBar/>
      <div className='about-us-header'>
        <div className='aboutusheaderP'>
        <h1 className='aboutus-h1'>Who we are</h1>
        <p className='aboutus-p'>At Galanteria, we’re here to help you create a space that reflects you and what<br></br> you love. We’ll put it all together for you. Free one-on-one design help, in our<br></br> store or in your home!</p>
        </div>
        <div className='img-container'>
        <img className='aboutimg' src={aboutimg}></img>
        </div>
        <div className='statsTable'>
  <div className='stats-text'>
    <div>
      <h2 className='stats-h2'>600+</h2>
      <p className='stats-p'>Models Finished</p>
    </div>
    <div>
      <h2 className='stats-h2'>200+</h2>
      <p className='stats-p'>Unique assortments</p>
    </div>
    <div>
      <h2 className='stats-h2'>30+</h2>
      <p className='stats-p'>Across the country</p>
    </div>
  </div>
</div>

</div>
      
      </div>
  )
}

export default Aboutus