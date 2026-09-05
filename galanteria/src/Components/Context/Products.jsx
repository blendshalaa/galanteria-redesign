import { createContext, useEffect, useReducer } from 'react';
import Reducer from "./Reducer";
import { SUPPORTED_LANGS } from "../../i18n/ui";

const stored = typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;

const initialState = {
    lang: SUPPORTED_LANGS.includes(stored) ? stored : "en",
};

export const Context = createContext([initialState, () => {}]);

const Products = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    // Keep the document language in sync. It was hardcoded `lang="en"` in
    // index.html on a trilingual site, which misleads screen readers about
    // pronunciation and search engines about the page's language.
    useEffect(() => {
        document.documentElement.lang = state.lang;
    }, [state.lang]);

    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    );
};

export default Products;
