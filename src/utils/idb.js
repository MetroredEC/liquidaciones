import { get, set, del, clear, keys } from 'idb-keyval';

/**
 * Simple wrapper around idb-keyval to provide namespaced storage
 * methods. Namespacing prevents collisions between different data
 * sets.
 */
export function getItem(key) {
  return get(key);
}

export function setItem(key, value) {
  return set(key, value);
}

export function removeItem(key) {
  return del(key);
}

export function clearAll() {
  return clear();
}

export function listKeys() {
  return keys();
}