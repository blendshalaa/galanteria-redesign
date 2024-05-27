/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faViber } from '@fortawesome/free-brands-svg-icons'




function Viber({phoneNumber}) {
const handleClick=()=>{
    const url = `viber://chat?number=${phoneNumber}`;
    window.open(url, '_blank');
}
  return (
    <div onClick={handleClick} style={{cursor:"pointer"}}>
    <FontAwesomeIcon icon={faViber} size="2x" style={{color: "#B197FC",}} />
    </div>
  )
}

export default Viber