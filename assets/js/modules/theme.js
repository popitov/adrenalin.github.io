import { $ } from '../utils/dom.js';

export const initTheme = () => {
  const themeToggle = $('#themeToggle');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeToggle) {
    return;
  }

  const prefersLightMql = window.matchMedia('(prefers-color-scheme: light)');
  const storedTheme = localStorage.getItem('theme');
  let hasManualSelection = Boolean(storedTheme);

  const updateThemeButton = () => {
    const isLight = document.body.classList.contains('light');
    themeToggle.textContent = isLight ? '🌙' : '☀️';
  };

  const applyTheme = (themeName, { save = false } = {}) => {
    document.body.classList.toggle('light', themeName === 'light');
    themeToggle.setAttribute('aria-pressed', themeName === 'light' ? 'true' : 'false');
    if (themeColorMeta) {
      themeColorMeta.content = themeName === 'light' ? '#eff1f5' : '#0f172a';
    }
    updateThemeButton();
    if (save) {
      localStorage.setItem('theme', themeName);
    }
  };

  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    applyTheme(prefersLightMql.matches ? 'light' : 'dark');
  }

  prefersLightMql.addEventListener('change', (event) => {
    if (!hasManualSelection) {
      applyTheme(event.matches ? 'light' : 'dark');
    }
  });

  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('light') ? 'dark' : 'light';
    hasManualSelection = true;
    applyTheme(nextTheme, { save: true });
  });
};
