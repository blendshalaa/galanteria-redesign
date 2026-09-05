import { Outlet } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import Footer from '../../Pages/Footer/Footer';
import useLang from '../../Hooks/useLang';

/**
 * `ScrollToTop` is rendered once, in App.jsx. It used to be rendered here as
 * well, so every navigation ran it twice.
 */
const Layout = () => {
  const { t } = useLang();

  return (
    <>
      {/* Lets a keyboard user jump past the navigation, which is otherwise
          ~15 tab stops on every single page. */}
      <a className="skip-link" href="#main-content">
        {t('skipToContent')}
      </a>

      <NavBar />

      <main id="main-content">
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default Layout;
