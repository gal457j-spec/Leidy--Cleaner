/**
 * Preferences Manager - controla preferências de usuário (font-size, accent)
 */
const PREF_KEY = 'vamos_prefs_v1';

const DEFAULTS = {
  fontSize: 'normal', // 'small' | 'normal' | 'large'
  accent: 'cyan' // 'cyan' | 'green' | 'purple'
};

export function getStoredPrefs() {
  if (typeof window === 'undefined' || !window.localStorage) return DEFAULTS;
  try {
    const raw = localStorage.getItem(PREF_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed };
  } catch (e) {
    return DEFAULTS;
  }
}

export function savePrefs(prefs) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
    // Also persist as cookie for SSR
    try {
      document.cookie = `${PREF_KEY}=${encodeURIComponent(JSON.stringify(prefs))}; path=/; max-age=${60 * 60 * 24 * 365}`;
    } catch (e) {
      // ignore
    }
  } catch (e) {
    // ignore
  }
}

export function applyPrefs(prefs) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // Font size
  if (prefs.fontSize === 'small') {
    root.style.fontSize = '14px';
  } else if (prefs.fontSize === 'large') {
    root.style.fontSize = '18px';
  } else {
    root.style.fontSize = '';
  }

  // Accent color -- define a CSS variable
  const accents = {
    cyan: 'rgb(6 182 212)',
    /* match darkened green from theme for accessibility */
    green: 'rgb(6 120 80)',
    purple: 'rgb(124 58 237)'
  };

  const accent = accents[prefs.accent] || accents.cyan;
  root.style.setProperty('--accent-color', accent);
}

export function setPref(key, value) {
  const prefs = getStoredPrefs();
  prefs[key] = value;
  savePrefs(prefs);
  applyPrefs(prefs);
}

export default {
  getStoredPrefs,
  savePrefs,
  applyPrefs,
  setPref
};
