import { $, $$ } from '../utils/dom.js';

export const initMenu = () => {
  const menuBtn = $('#menuBtn');
  const navLinks = $('#navLinks');
  if (!menuBtn || !navLinks) {
    return;
  }

  const syncMenuButton = (isOpen) => {
    menuBtn.textContent = isOpen ? '×' : '☰';
    menuBtn.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Меню');
    menuBtn.classList.toggle('open', isOpen);
  };

  const closeMenu = () => {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    syncMenuButton(false);
  };

  menuBtn.addEventListener('click', () => {
    const shouldOpen = !navLinks.classList.contains('open');
    if (shouldOpen) {
      navLinks.classList.add('open');
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
      syncMenuButton(true);
      const firstLink = navLinks.querySelector('a');
      firstLink?.focus();
    } else {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  $$('#navLinks a').forEach((link) =>
    link.addEventListener('click', () => {
      closeMenu();
    }),
  );

  const desktopQuery = window.matchMedia('(min-width: 1201px)');
  const handleDesktopChange = (event) => {
    if (event.matches) {
      closeMenu();
    }
  };

  if (typeof desktopQuery.addEventListener === 'function') {
    desktopQuery.addEventListener('change', handleDesktopChange);
  } else {
    desktopQuery.addListener(handleDesktopChange);
  }

  handleDesktopChange(desktopQuery);
};
