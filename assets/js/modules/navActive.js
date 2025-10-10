import { $$ } from '../utils/dom.js';

export const initNavActive = () => {
  const sectionIds = ['about', 'courses', 'schedule', 'pricing', 'instructors', 'fleet', 'reviews', 'faq', 'contacts'];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (!sections.length) {
    return;
  }

  const navLinks = $$('#navLinks a');
  const linkById = Object.fromEntries(navLinks.map((link) => [link.getAttribute('href').slice(1), link]));

  if (!('IntersectionObserver' in window)) {
    navLinks.forEach((link) => link.classList.remove('active'));
    navLinks[0]?.classList.add('active');
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          Object.values(linkById).forEach((link) => link.classList.remove('active'));
          linkById[id]?.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0% -50% 0%', threshold: 0.1 },
  );

  sections.forEach((section) => observer.observe(section));
};
