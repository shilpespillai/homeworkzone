// Symmetric Encryption and Decryption utility using native browser Web Crypto API (AES-GCM)

// Helper to convert a string (teacherCode) into a stable 256-bit AES key
async function getEncryptionKey(teacherCode) {
  const enc = new TextEncoder();
  // Ensure the key material is exactly 32 bytes (256 bits) by padding/slicing
  const cleanCode = (teacherCode || '').trim().toUpperCase();
  const keyData = enc.encode(cleanCode.padEnd(32, '0').slice(0, 32));
  
  return window.crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts a plain text string using the teacher's code as the secret.
 * @param {string} text - The API key or secret to encrypt.
 * @param {string} teacherCode - The unique teacher code.
 * @returns {Promise<string>} The ciphertext formatted as "ivHex:cipherHex"
 */
export async function encryptText(text, teacherCode) {
  if (!text) return '';
  if (!teacherCode) throw new Error("Teacher Code is required for encryption!");
  
  try {
    const key = await getEncryptionKey(teacherCode);
    const enc = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV (standard for AES-GCM)
    
    const ciphertext = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      enc.encode(text)
    );
    
    // Convert IV and ciphertext to hex representations
    const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
    const cipherBytes = new Uint8Array(ciphertext);
    const cipherHex = Array.from(cipherBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    
    return `${ivHex}:${cipherHex}`;
  } catch (err) {
    console.error("Encryption failed:", err);
    throw err;
  }
}

/**
 * Decrypts a ciphertext string formatted as "ivHex:cipherHex" using the teacher's code.
 * @param {string} encryptedString - The "ivHex:cipherHex" encrypted string.
 * @param {string} teacherCode - The unique teacher code.
 * @returns {Promise<string>} The decrypted plain text.
 */
export async function decryptText(encryptedString, teacherCode) {
  if (!encryptedString) return '';
  if (!teacherCode) return '';
  
  try {
    // If it's a legacy plain-text key, return as-is
    if (!encryptedString.includes(':')) {
      return encryptedString;
    }
    
    const [ivHex, cipherHex] = encryptedString.split(':');
    if (!ivHex || !cipherHex) return '';
    
    // Parse hex strings back to byte arrays
    const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const cipherBytes = new Uint8Array(cipherHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    
    const key = await getEncryptionKey(teacherCode);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      cipherBytes
    );
    
    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (err) {
    console.error("Decryption failed:", err);
    return ''; // Return empty string on failure (e.g., wrong/invalid code)
  }
}
