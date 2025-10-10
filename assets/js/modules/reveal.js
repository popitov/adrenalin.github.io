import { $$ } from '../utils/dom.js';

export const initRevealAnimations = () => {
  const revealElements = $$('.reveal');
  if (!revealElements.length) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('show'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  revealElements.forEach((element) => observer.observe(element));
};
