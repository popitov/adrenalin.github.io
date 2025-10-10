import { $, $$ } from '../utils/dom.js';

const parseNumber = (value) => {
  const numeric = value.replace(/\s/g, '').replace(/[^\d.,-]/g, '').replace(',', '.');
  const parsed = parseFloat(numeric);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatValue = (value, suffix) => Math.round(value).toLocaleString('ru-RU') + suffix;

export const initCountUp = () => {
  const heroSection = $('#home');
  if (!heroSection) {
    return;
  }

  const runCountUp = () => {
    $$('.stats b[data-count]').forEach((element) => {
      const goal = Number(element.dataset.count);
      const suffix = element.dataset.suffix || '';
      const startValue = parseNumber(element.textContent.trim());
      const diff = goal - startValue;

      if (!Number.isFinite(goal)) {
        return;
      }

      if (diff === 0) {
        element.textContent = formatValue(goal, suffix);
        return;
      }

      const start = performance.now();
      const duration = 1000;

      const step = (time) => {
        const progress = Math.min(1, (time - start) / duration);
        const current = startValue + diff * progress;
        element.textContent = formatValue(current, suffix);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    });
  };

  if (!('IntersectionObserver' in window)) {
    runCountUp();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCountUp();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(heroSection);
};
