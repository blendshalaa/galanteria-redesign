import { createContext, useContext } from 'react';

/**
 * The context and its hook live here, separate from the provider component in
 * AdminAuth.jsx, so that file exports only a component. Mixing components and
 * non-component exports in one module breaks React Fast Refresh — every edit
 * to the provider would do a full reload instead of a hot update.
 */
export const AdminAuthContext = createContext(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used inside <AdminAuthProvider>');
  }
  return context;
};
