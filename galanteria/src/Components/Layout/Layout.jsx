import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import Footer from '../../Pages/Footer/Footer';
import ScrollToTop from '../ScrollToTop/ScrollToTop';

const Layout = () => {
  return (
    <>
      <ScrollToTop />
      <NavBar />
      <main className="page-transition">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
