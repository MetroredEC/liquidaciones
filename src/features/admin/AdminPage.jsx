import React, { useState, useEffect } from 'react';
import { getCatalogs, getTemplates } from '../../auth/authService';

/**
 * AdminPage – basic administrative interface. In a production
 * implementation this would allow CRUD operations on users,
 * catalogs and templates. Here we simply display the current
 * contents of the catalogs and templates with a form to add
 * additional users to the local database.
 */
const AdminPage = () => {
  const [catalogs, setCatalogs] = useState({});
  const [templates, setTemplates] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'Analista' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    setCatalogs(getCatalogs());
    setTemplates(getTemplates());
  }, []);

  const addUser = e => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('metrored_users') || '[]');
    if (users.find(u => u.username === newUser.username)) {
      setMessage('El usuario ya existe');
      return;
    }
    // Create a new salt and hash using CryptoJS
    const CryptoJS = require('crypto-js');
    const salt = CryptoJS.lib.WordArray.random(16).toString();
    const saltWA = CryptoJS.enc.Hex.parse(salt);
    const hash = CryptoJS.PBKDF2(newUser.password, saltWA, {
      keySize: 256 / 32,
      iterations: 100000,
      hasher: CryptoJS.algo.SHA256,
    }).toString();
    const record = {
      username: newUser.username,
      salt,
      hash,
      role: newUser.role,
    };
    localStorage.setItem('metrored_users', JSON.stringify([...users, record]));
    setMessage('Usuario añadido');
    setNewUser({ username: '', password: '', role: 'Analista' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-blue">Administración</h2>
      <section>
        <h3 className="text-lg font-medium text-blue">Catálogos</h3>
        {Object.keys(catalogs).map(key => (
          <div key={key} className="mb-2">
            <h4 className="font-semibold text-gray">{key}</h4>
            <ul className="list-disc list-inside">
              {catalogs[key].map(item => (
                <li key={item.id}>{item.id} – {item.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <section>
        <h3 className="text-lg font-medium text-blue">Plantillas BC</h3>
        <ul className="list-disc list-inside">
          {templates.map(t => (
            <li key={t.id}>{t.id} – {t.name}: {t.description}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="text-lg font-medium text-blue">Gestión de usuarios</h3>
        <form onSubmit={addUser} className="space-y-2 max-w-sm">
          <div>
            <label className="block text-sm">Usuario</label>
            <input
              type="text"
              value={newUser.username}
              onChange={e => setNewUser({ ...newUser, username: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm">Contraseña</label>
            <input
              type="password"
              value={newUser.password}
              onChange={e => setNewUser({ ...newUser, password: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm">Rol</label>
            <select
              value={newUser.role}
              onChange={e => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="Administrador">Administrador</option>
              <option value="Analista">Analista</option>
              <option value="Asistente">Asistente</option>
            </select>
          </div>
          <button type="submit" className="px-4 py-2 bg-blue text-white rounded">
            Crear usuario
          </button>
        </form>
        {message && <p className="text-sm text-green-700 mt-2">{message}</p>}
      </section>
    </div>
  );
};

export default AdminPage;