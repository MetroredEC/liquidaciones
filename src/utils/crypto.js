import CryptoJS from 'crypto-js';

/**
 * Computes a PBKDF2/SHA‑256 hash of a password with the given salt.
 * Returns the hexadecimal representation of the derived key.
 * @param {string} password
 * @param {string} saltHex – hex encoded salt
 * @param {number} iterations
 */
export function pbkdf2(password, saltHex, iterations = 100000) {
  const salt = CryptoJS.enc.Hex.parse(saltHex);
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations,
    hasher: CryptoJS.algo.SHA256,
  }).toString();
}

/**
 * Computes the SHA‑256 digest of a word array or string and
 * returns it as a hexadecimal string.
 * @param {ArrayBuffer|CryptoJS.lib.WordArray|string} data
 */
export function sha256(data) {
  let wordArray;
  if (data instanceof ArrayBuffer) {
    wordArray = CryptoJS.lib.WordArray.create(data);
  } else if (typeof data === 'string') {
    wordArray = CryptoJS.enc.Utf8.parse(data);
  } else {
    wordArray = data;
  }
  return CryptoJS.SHA256(wordArray).toString();
}