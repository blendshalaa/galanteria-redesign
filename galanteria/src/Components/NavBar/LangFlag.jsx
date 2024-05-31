import React from "react";

const LangFlag = ({ lang }) => {  
  if (lang === "en") {
    return (
    <h5  className="l">EN</h5>
    )
  }
  if (lang === "sq") {
    return (
     <h5  className="l">AL </h5> 
    )
  }

  if (lang === "de") {
    return (
      <h5 className="l">DE</h5>
    )
  }
   
}
export default LangFlag;