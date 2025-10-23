import React from 'react';
import { useAuth } from '../auth/AuthProvider';

/**
 * Navbar component – fixed bar across the top of the app. Displays
 * the application name and the current user's username with a
 * logout button.
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const logoUrl = `${import.meta.env.BASE_URL}logo.png`;

  return (
    <header className="flex items-center justify-between px-4 h-14 bg-blue text-white shadow">
      <div className="flex items-center gap-2">
        <img src={logoUrl} alt="logo" className="h-8 w-8" />
        <span className="font-semibold">Metrored Cartera</span>
      </div>
      {user && (
        <div className="flex items-center gap-4 text-sm">
          <span>{user.username} ({user.role})</span>
          <button
            onClick={logout}
            className="px-3 py-1 bg-cyan rounded text-white hover:bg-white hover:text-blue transition">
            Salir
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;