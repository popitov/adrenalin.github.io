import { $ } from '../utils/dom.js';

export const initScrollProgress = () => {
  const progress = $('#scrollProgress');
  if (!progress) {
    return;
  }

  const onScroll = () => {
    const root = document.documentElement;
    const scrolled = (root.scrollTop / (root.scrollHeight - root.clientHeight)) * 100;
    progress.style.width = `${scrolled}%`;
  };

  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
};
