import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

/**
 * Sidebar component – vertical navigation that adapts to the user's
 * role. Each NavLink receives an active class when the route is
 * selected. Administrators see an additional Administración option.
 */
const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;
  const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/ingestion', label: 'Cargar' },
    { to: '/reconciliation', label: 'Conciliar' },
    { to: '/exports', label: 'Exportar' },
    { to: '/reports', label: 'Reportes' },
    { to: '/audit', label: 'Auditoría' },
  ];
  if (user.role === 'Administrador') {
    links.push({ to: '/admin', label: 'Administración' });
  }
  return (
    <nav className="w-48 bg-grayLight border-r border-gray p-4 space-y-1 overflow-y-auto">
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          end
          className={({ isActive }) =>
            `block px-3 py-2 rounded hover:bg-cyan hover:text-white ${isActive ? 'bg-blue text-white' : 'text-gray-800'}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Sidebar;