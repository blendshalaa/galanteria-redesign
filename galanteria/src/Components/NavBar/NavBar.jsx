import React, { useState, useEffect, useRef, useContext } from 'react';
import './NavBar.scss';
import logo from '../../assets/images/LOGO_G.png';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import pdf from './Catalog.pdf';
import pdf2 from './Catalog2.pdf'
import language from '../../lang';
import { Context } from '../Context/Products';
import Language from './Language';
import { NavLink } from 'react-router-dom';


const NavBar = () => {

  const [{ lang }] = useContext(Context);


  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);

  const [showHomeFurnitureList, setShowHomeFurnitureList] = useState(false);
  const [ChairsList, setChairsList] = useState(false);
  const [DesksList, setDesksList] = useState(false);


  const categoriesRef = useRef(null);
  const ecatalogueRef = useRef(null);
  const [toggleBtn, setToggleBtn] = useState(false);

  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    const { pathname } = location;

    setActiveItem(pathname);
  }, [location]);

  const toggleMenu = () => {
    setToggleBtn(!toggleBtn);
    document.body.classList.toggle("scroll-y");
    window.scrollTo(0, 0);
    console.log("here I am");
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target) &&
        ecatalogueRef.current &&
        !ecatalogueRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setShowHomeFurnitureList(false);
        document.body.classList.remove("scroll-y");
      }
    };

    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        ecatalogueRef.current &&
        !ecatalogueRef.current.contains(event.target)
      ) {
        setShowDropdown2(false);
        document.body.classList.remove("scroll-y");
      }
    };

    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    setShowHomeFurnitureList(false);
  };


  const toggleDropdown2 = () => {
    setShowDropdown2(!showDropdown2);
  };


  const toggleHomeFurnitureList = () => {
    setShowHomeFurnitureList(!showHomeFurnitureList);
  };
  const toggleChairsList = () => {
    setChairsList(!ChairsList);
  };

  const toggleDesksList = () => {
    setDesksList(!DesksList);
  };

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  return (
    <div className='navbar-wrapper'>
      <div className='left'>
        <div className='logo'>
          <Link to='/'>
            <img src={logo} alt='' />
          </Link>
        </div>

        <ul onClick={() => toggleMenu()} className={`${toggleBtn ? "header-menu" : ""} links`}><div>

        </div>
          <Link to="/"><li className={activeItem === '/' ? 'active-link' : 'link'}>
            {language[lang]?.menuHeader[0].name}

          </li></Link>

          <div className="categories" ref={categoriesRef} onClick={stopPropagation}>
            <div className='c'>
              <li onClick={toggleDropdown} className={activeItem === '/categories' ? 'active-link' : 'link'}>
                {language[lang]?.menuHeader[1].name}

              </li>
              <svg className='s' onClick={toggleDropdown} fill="#eee" width="15px" height="15px" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" id="memory-menu-down-fill"><path d="M17 9V8H5V9H6V10H7V11H8V12H9V13H10V14H12V13H13V12H14V11H15V10H16V9" /></svg>
            </div>

            {showDropdown && (
              <ul className='dropdown' onClick={stopPropagation}>
                <li className='nes'>
                  <Link onClick={toggleHomeFurnitureList}>{language[lang]?.menuHeader[2].name}</Link>
                  {showHomeFurnitureList && (
                    <ul className="nested-list">
                    
                     
                      <li className='nes'>
                        <Link onClick={toggleDesksList}>{language[lang]?.menuHeader[4].name}</Link>
                        {DesksList && (
                          <ul className="nested-list">
                            <li className="nes">
                              <Link to="/WorkingTable">{language[lang]?.menuHeader[5].name}</Link>
                            </li>
                            <li className="nes">
                              <Link to="/Workstation">{language[lang]?.menuHeader[6].name}</Link>
                            </li>
                            <li className="nes">
                              <Link to="/MeetingTable">{language[lang]?.menuHeader[7].name}</Link>
                            </li>

                          </ul>
                        )}
                      </li>
                    
                      <li className='nes'>
                        <Link to="/Cabinets">{language[lang]?.menuHeader[8].name}</Link>
                      </li>
                      <li className='nes'>
                        <Link to="/Drawers">{language[lang]?.menuHeader[9].name}</Link>
                      </li>  <li className='nes'>
                        <Link onClick={toggleChairsList} >{language[lang]?.menuHeader[3].name}</Link>
                        {ChairsList && (
                          <ul className="nested-list">
                            <li className="nes">
                              <Link to="/OfficeChairs">{language[lang]?.chairs[0].one}</Link>
                            </li>
                            <li className="nes">
                              <Link to="/MeetingChairs">{language[lang]?.chairs[0].two}</Link>
                            </li>
                            <li className="nes">
                              <Link to="/WaitingChairs">{language[lang]?.chairs[0].three}</Link>
                            </li>

                          </ul>
                        )}
                      </li>
                      <li className='nes'>
                        <Link to="/Others">{language[lang]?.menuHeader[10].name}</Link>
                      </li>
                    </ul>
                  )}
                </li>
                {/* <li className='nes'>
                  <Link to='/category2'>{language[lang]?.menuHeader[11].name}</Link>
                </li> */}
              </ul>
            )}
          </div>

          <Link to="/Projects">
            <li className={activeItem === '/Projects' ? 'active-link' : 'link'}>
              {language[lang]?.menuHeader[12].name}

            </li>
          </Link>


          <div className="ecatalog" ref={ecatalogueRef} onClick={stopPropagation}>
            <div className='c'>
              <li  onClick={toggleDropdown2} className={activeItem === '/ecatalog' ? 'active-link' : 'link'}>
                {language[lang]?.menuHeader[13].name}

              </li>
              <svg className='s' onClick={toggleDropdown2} fill="#eee" width="15px" height="15px" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" id="memory-menu-down-fill"><path d="M17 9V8H5V9H6V10H7V11H8V12H9V13H10V14H12V13H13V12H14V11H15V10H16V9" /></svg>
            </div>

            {showDropdown2 && (
              <ul className='dropdown' onClick={stopPropagation}>

                <a href={pdf} download>
                  <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.625 15C5.625 14.5858 5.28921 14.25 4.875 14.25C4.46079 14.25 4.125 14.5858 4.125 15H5.625ZM4.875 16H4.125H4.875ZM19.275 15C19.275 14.5858 18.9392 14.25 18.525 14.25C18.1108 14.25 17.775 14.5858 17.775 15H19.275ZM11.1086 15.5387C10.8539 15.8653 10.9121 16.3366 11.2387 16.5914C11.5653 16.8461 12.0366 16.7879 12.2914 16.4613L11.1086 15.5387ZM16.1914 11.4613C16.4461 11.1347 16.3879 10.6634 16.0613 10.4086C15.7347 10.1539 15.2634 10.2121 15.0086 10.5387L16.1914 11.4613ZM11.1086 16.4613C11.3634 16.7879 11.8347 16.8461 12.1613 16.5914C12.4879 16.3366 12.5461 15.8653 12.2914 15.5387L11.1086 16.4613ZM8.39138 10.5387C8.13662 10.2121 7.66533 10.1539 7.33873 10.4086C7.01212 10.6634 6.95387 11.1347 7.20862 11.4613L8.39138 10.5387ZM10.95 16C10.95 16.4142 11.2858 16.75 11.7 16.75C12.1142 16.75 12.45 16.4142 12.45 16H10.95ZM12.45 5C12.45 4.58579 12.1142 4.25 11.7 4.25C11.2858 4.25 10.95 4.58579 10.95 5H12.45ZM4.125 15V16H5.625V15H4.125ZM4.125 16C4.125 18.0531 5.75257 19.75 7.8 19.75V18.25C6.61657 18.25 5.625 17.2607 5.625 16H4.125ZM7.8 19.75H15.6V18.25H7.8V19.75ZM15.6 19.75C17.6474 19.75 19.275 18.0531 19.275 16H17.775C17.775 17.2607 16.7834 18.25 15.6 18.25V19.75ZM19.275 16V15H17.775V16H19.275ZM12.2914 16.4613L16.1914 11.4613L15.0086 10.5387L11.1086 15.5387L12.2914 16.4613ZM12.2914 15.5387L8.39138 10.5387L7.20862 11.4613L11.1086 16.4613L12.2914 15.5387ZM12.45 16V5H10.95V16H12.45Z" fill="white" />
                  </svg>

                  <li style={{ color: 'black' }} className={activeItem === '/ecatalog' ? 'active-link' : 'link'}>
                    {language[lang]?.ecatalog[0].one}

                  </li>
                </a>

                <li className='nes'>
                  <a href={pdf2} download>
                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.625 15C5.625 14.5858 5.28921 14.25 4.875 14.25C4.46079 14.25 4.125 14.5858 4.125 15H5.625ZM4.875 16H4.125H4.875ZM19.275 15C19.275 14.5858 18.9392 14.25 18.525 14.25C18.1108 14.25 17.775 14.5858 17.775 15H19.275ZM11.1086 15.5387C10.8539 15.8653 10.9121 16.3366 11.2387 16.5914C11.5653 16.8461 12.0366 16.7879 12.2914 16.4613L11.1086 15.5387ZM16.1914 11.4613C16.4461 11.1347 16.3879 10.6634 16.0613 10.4086C15.7347 10.1539 15.2634 10.2121 15.0086 10.5387L16.1914 11.4613ZM11.1086 16.4613C11.3634 16.7879 11.8347 16.8461 12.1613 16.5914C12.4879 16.3366 12.5461 15.8653 12.2914 15.5387L11.1086 16.4613ZM8.39138 10.5387C8.13662 10.2121 7.66533 10.1539 7.33873 10.4086C7.01212 10.6634 6.95387 11.1347 7.20862 11.4613L8.39138 10.5387ZM10.95 16C10.95 16.4142 11.2858 16.75 11.7 16.75C12.1142 16.75 12.45 16.4142 12.45 16H10.95ZM12.45 5C12.45 4.58579 12.1142 4.25 11.7 4.25C11.2858 4.25 10.95 4.58579 10.95 5H12.45ZM4.125 15V16H5.625V15H4.125ZM4.125 16C4.125 18.0531 5.75257 19.75 7.8 19.75V18.25C6.61657 18.25 5.625 17.2607 5.625 16H4.125ZM7.8 19.75H15.6V18.25H7.8V19.75ZM15.6 19.75C17.6474 19.75 19.275 18.0531 19.275 16H17.775C17.775 17.2607 16.7834 18.25 15.6 18.25V19.75ZM19.275 16V15H17.775V16H19.275ZM12.2914 16.4613L16.1914 11.4613L15.0086 10.5387L11.1086 15.5387L12.2914 16.4613ZM12.2914 15.5387L8.39138 10.5387L7.20862 11.4613L11.1086 16.4613L12.2914 15.5387ZM12.45 16V5H10.95V16H12.45Z" fill="white" />
                    </svg>

                    <li style={{ color: 'black' }} className={activeItem === '/ecatalog' ? 'active-link' : 'link'}>
                      {language[lang]?.ecatalog[0].two}

                    </li>
                  </a>
                </li>
              </ul>
            )}
          </div>


          <Link to="/Aboutus">
            <li className={activeItem === '/Aboutus' ? 'active-link' : 'link'}>
              {language[lang]?.menuHeader[15].name}

            </li></Link>

          <Link to="/Contact">
            <li className={activeItem === '/Contact' ? 'active-link' : 'link'}>
              {language[lang]?.menuHeader[14].name}

            </li></Link>




          <div className="navlang">
            <div className="language">
              <Language className="lang" />
            </div>
          </div>
        </ul>
      </div>
      <div className='right'>
        <IconButton
          onClick={toggleMenu}
          className="menu-btn"
          color="inherit"
          aria-label="open drawer"
          edge="end"
        >
          {toggleBtn ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </div>

    </div>
  );
};

export default NavBar;