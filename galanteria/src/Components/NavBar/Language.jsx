import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Context/Products';
import LangFlag from './LangFlag';
import './NavBar.scss';

const Language = () => {
    const [{ lang }, dispatch] = useContext(Context);
    const [activeItem, setActiveItem] = useState('');

    useEffect(() => {
        const { pathname } = location;
        setActiveItem(pathname);

        // Check for language preference in local storage
        const storedLang = localStorage.getItem("lang");
        if (storedLang) {
            dispatch({
                type: "LANG",
                payland: { lang: storedLang }
            });
        } else {
            // If no language is set in local storage, default to English
            dispatch({
                type: "LANG",
                payland: { lang: "en" }
            });
        }
    }, [location, dispatch]);

    const changeLang = (newLang) => {
        dispatch({
            type: "LANG",
            payland: { lang: newLang }
        });
        localStorage.setItem("lang", newLang);
    };

    return (
        <div className="language">
              <a className="lang" onClick={() => changeLang("sq")}>
                <LangFlag lang="sq" />
            </a>
            <a className="lang" onClick={() => changeLang("en")}>
                <LangFlag lang="en" />
            </a> 
         
            <a className="lang" onClick={() => changeLang("de")}>
                <LangFlag lang="de" />
            </a>
        </div>
    );
};

export default Language;
