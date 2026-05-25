// localStorage with safe JSON + namespace.
const NS = 'tava.v1.';

export const storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(NS + key);
      if (raw == null) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(NS + key, JSON.stringify(value));
    } catch {
      /* quota/SSR — ignore */
    }
  },
  remove(key) {
    try { localStorage.removeItem(NS + key); } catch { /* ignore */ }
  },
};
