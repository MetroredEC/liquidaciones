import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

/**
 * Component that guards routes requiring authentication. If the user
 * is not logged in it redirects to the login page and preserves
 * the originally requested location so it can be resumed after
 * authentication.
 */
const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default RequireAuth;