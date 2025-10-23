import CryptoJS from 'crypto-js';
import usersSeed from '../data/users.json';
import catalogsSeed from '../data/catalogs.json';
import templatesSeed from '../data/templatesBC.json';

const USERS_KEY = 'metrored_users';
const SESSION_KEY = 'metrored_session';
const CATALOGS_KEY = 'metrored_catalogs';
const TEMPLATES_KEY = 'metrored_templatesBC';

/**
 * Seeds the initial datasets into localStorage if they are not already
 * present. This includes users, catalogs and BC templates. This
 * function should be idempotent so that repeated calls do not
 * overwrite user changes.
 */
export function seedData() {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(usersSeed));
  }
  if (!localStorage.getItem(CATALOGS_KEY)) {
    localStorage.setItem(CATALOGS_KEY, JSON.stringify(catalogsSeed));
  }
  if (!localStorage.getItem(TEMPLATES_KEY)) {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templatesSeed));
  }
}

/**
 * Attempts to authenticate a user with the provided credentials. The
 * passwords in storage are salted and hashed using PBKDF2/SHA‑256.
 * Returns a user object on success or null on failure.
 * @param {string} username
 * @param {string} password
 */
export function authenticate(username, password) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const user = users.find(u => u.username === username);
  if (!user) return null;
  const saltBytes = CryptoJS.enc.Hex.parse(user.salt);
  const derivedKey = CryptoJS.PBKDF2(password, saltBytes, {
    keySize: 256 / 32,
    iterations: 100000,
    hasher: CryptoJS.algo.SHA256,
  });
  const derivedHex = derivedKey.toString(CryptoJS.enc.Hex);
  if (derivedHex === user.hash) {
    // store session (exclude hash & salt)
    const { hash, salt, ...safeUser } = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    return safeUser;
  }
  return null;
}

/**
 * Returns the current user from localStorage or null if not logged
 * in.
 */
export function getCurrentUser() {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

/**
 * Logs the current user out by removing the session from
 * localStorage.
 */
export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Returns catalogs data.
 */
export function getCatalogs() {
  return JSON.parse(localStorage.getItem(CATALOGS_KEY) || '{}');
}

/**
 * Returns BC templates.
 */
export function getTemplates() {
  return JSON.parse(localStorage.getItem(TEMPLATES_KEY) || '[]');
}