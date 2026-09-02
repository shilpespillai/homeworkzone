/**
 * Recursively sanitizes an object or array for Firestore write operations (addDoc, setDoc, updateDoc).
 * - Removes keys with `undefined` values from objects
 * - Converts `undefined` elements in arrays to `null`
 * - Flattens and eliminates any nested arrays (Firestore strictly forbids nested arrays)
 * - Preserves Firestore FieldValue sentinels (e.g. serverTimestamp()) and Date/Timestamp objects
 *
 * @param {*} data - The data payload to sanitize
 * @returns {*} The sanitized data payload free of `undefined` and nested arrays
 */
export function cleanFirestorePayload(data) {
  if (data === undefined) return null;
  if (data === null || typeof data !== 'object') return data;

  // Preserve special non-plain objects like Firestore FieldValue (serverTimestamp, etc.), Timestamp, Date
  if (data.constructor && data.constructor.name !== 'Object' && data.constructor.name !== 'Array') {
    return data;
  }

  if (Array.isArray(data)) {
    // Flatten any directly nested multi-dimensional arrays
    const flat = data.flat(Infinity);
    return flat.map(item => {
      if (item === undefined) return null;
      if (Array.isArray(item)) {
        // As an ultimate guard, convert any lingering inner array to safe primitive representation
        return item.map(sub => (typeof sub === 'object' ? JSON.stringify(sub) : String(sub ?? ''))).join(', ');
      }
      return cleanFirestorePayload(item);
    });
  }

  const cleaned = {};
  for (const key of Object.keys(data)) {
    const value = data[key];
    if (value !== undefined) {
      cleaned[key] = cleanFirestorePayload(value);
    }
  }
  return cleaned;
}
