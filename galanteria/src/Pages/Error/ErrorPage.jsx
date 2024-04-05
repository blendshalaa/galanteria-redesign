import React from 'react'
import './Error.scss'
import { useNavigate } from 'react-router-dom';

const Error = () => {
    const navigate = useNavigate();

  const backToHome = () => {
    navigate("/");
  }
  return (
<div className="error-page">
<div className='circle'></div>
<h2>404</h2>
      <h1>Not found</h1>
      
      <button onClick={() => backToHome()}>Back to Home!</button>
    </div>  )
}

export default Error