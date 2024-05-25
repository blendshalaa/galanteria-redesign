import React, { useContext , useState,useEffect} from 'react';
import { Context } from '../Context/Products';
import LangFlag from './LangFlag';
import './NavBar.scss'

const Language = () => {
    const [{ lang }, dispatch] = useContext(Context);
    const [activeItem, setActiveItem] = useState('');

    useEffect(() => {
      const { pathname } = location;
  
      setActiveItem(pathname);
    }, [location]);
  
    const changeLang = (newLang) => {
      dispatch({
        type: "LANG",
        payland: { lang: newLang }
      });
      localStorage.setItem("lang", newLang);
    }

  return (
    <div className="language">
      <a className={activeItem ? 'lang' : 'link'} onClick={() => changeLang("sq")}>
        <LangFlag lang="sq" />
      </a>
      <a className="lang" onClick={() => changeLang("en")}>
        <LangFlag lang="en" />
      </a>
      <a className="lang" onClick={() => changeLang("de")}>
        <LangFlag lang="de" />
      </a>
    </div>
  )
}

export default Language;
