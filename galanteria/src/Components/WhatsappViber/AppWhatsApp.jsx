/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'



function AppWhatsApp({phoneNumber}) {

    const handleClick=()=>{
        const url = `https://wa.me/${phoneNumber}`;
        window.open(url, '_blank');

    }
  return (
    <div onClick={handleClick} style={{cursor:"pointer"}}>
         <FontAwesomeIcon icon={faWhatsapp} size="2x" color="#25D366" />
    </div>
  )
}

export default AppWhatsApp