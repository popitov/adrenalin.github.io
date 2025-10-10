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

  menuBtn.addEventListener('click', () => {
    const open = !navLinks.classList.contains('open');
    navLinks.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
    syncMenuButton(open);
    if (open) {
      const firstLink = navLinks.querySelector('a');
      firstLink?.focus();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
      syncMenuButton(false);
    }
  });

  $$('#navLinks a').forEach((link) =>
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
      syncMenuButton(false);
    }),
  );
};
