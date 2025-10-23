import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

/**
 * LoginPage renders a simple login form. Credentials are checked
 * against the local user database using the auth service. On
 * successful login, users are redirected back to the location they
 * attempted to access or the dashboard.
 */
const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await login(username.trim(), password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-grayLight">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <div className="mb-6 text-center">
          <img
            src="/logo.png"
            alt="Metrored logo"
            className="mx-auto h-16 w-16 mb-2"
          />
          <h1 className="text-2xl font-semibold text-blue">Metrored Cartera</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray mb-1">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue"
              required
            />
          </div>
          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-blue text-white rounded hover:bg-cyan focus:outline-none focus:ring-2 focus:ring-cyan">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;