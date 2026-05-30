// localStorage wrapper with namespace prefix.
// All keys are stored as tava.v1.<key> to avoid collisions.

const NS = 'tava.v1.';

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(NS + key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(NS + key, JSON.stringify(value));
    } catch {
      // localStorage full or unavailable — silently skip
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(NS + key);
    } catch {
      // ignore
    }
  },
};
