import { $ } from '../utils/dom.js';

export const initBackToTop = () => {
  const button = $('#toTop');
  if (!button) {
    return;
  }

  window.addEventListener('scroll', () => {
    button.style.display = window.scrollY > 600 ? 'inline-flex' : 'none';
  });

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};
