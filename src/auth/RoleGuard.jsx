import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

/**
 * RoleGuard restricts access to children based on the user's role.
 * It accepts an array of permitted roles and renders a fallback
 * element if the current user does not have permission.
 */
const RoleGuard = ({ roles = [], children, fallback = null }) => {
  const { user } = useAuth();
  if (!user) return null;
  if (roles.includes(user.role)) {
    return children;
  }
  // Default fallback is a simple unauthorized message. You could
  // redirect to the dashboard or display a custom component here.
  return fallback || <div className="p-4 text-red-600">No autorizado</div>;
};

export default RoleGuard;