import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  authenticate,
  getCurrentUser,
  logout as authLogout,
  seedData,
} from './authService';

// Define an AuthContext for sharing auth state through the app
const AuthContext = createContext(null);

/**
 * AuthProvider component – wraps its children in an auth context and
 * handles login/logout functionality as well as seeding initial
 * datasets and session restoration. It also manages automatic
 * expiration of sessions after 30 minutes of inactivity.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Seed data and restore session on mount
  useEffect(() => {
    seedData();
    const existing = getCurrentUser();
    if (existing) {
      setUser(existing);
    }
  }, []);

  // Listen for user activity to reset inactivity timer
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
    };
  }, []);

  // Periodically check for inactivity (30 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (user && now - lastActivity > 30 * 60 * 1000) {
        // Auto logout
        handleLogout();
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [user, lastActivity]);

  const handleLogin = async (username, password) => {
    const loggedUser = authenticate(username, password);
    if (loggedUser) {
      setUser(loggedUser);
      return { success: true };
    }
    return { success: false, error: 'Credenciales inválidas' };
  };

  const handleLogout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access the auth context.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};