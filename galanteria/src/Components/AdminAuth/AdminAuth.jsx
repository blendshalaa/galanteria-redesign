import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('galanteria_admin_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  const login = (password) => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'galanteria2024';
    if (password === adminPassword) {
      sessionStorage.setItem('galanteria_admin_auth', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('galanteria_admin_auth');
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
