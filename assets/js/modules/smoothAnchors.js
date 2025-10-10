import { $$ } from '../utils/dom.js';

export const initSmoothAnchors = () => {
  $$('#navLinks a').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href').slice(1);
      const element = document.getElementById(id);
      if (element) {
        event.preventDefault();
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        element.setAttribute('tabindex', '-1');
        element.focus({ preventScroll: true });
        setTimeout(() => element.removeAttribute('tabindex'), 500);
      }
    });
  });
};
