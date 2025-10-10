import { $ } from '../utils/dom.js';

export const initYear = () => {
  const yearEl = $('#year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
};
