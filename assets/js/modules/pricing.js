import { $$ } from '../utils/dom.js';

const formatPrice = (value, suffix = ' ₽') => {
  const num = Number(value);
  const formatted = Number.isFinite(num) ? num.toLocaleString('ru-RU') : value;
  return formatted + suffix;
};

export const initPricingToggle = () => {
  const toggleButtons = $$('.toggle button');
  const prices = $$('[data-price]');

  if (!toggleButtons.length || !prices.length) {
    return;
  }

  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      toggleButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });

      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');

      const mode = button.dataset.bill;
      prices.forEach((priceElement) => {
        const onceSuffix = priceElement.dataset.onceSuffix || ' ₽';
        const monthlySuffix = priceElement.dataset.monthlySuffix || ' ₽ / мес';
        if (mode === 'monthly' && priceElement.dataset.billing !== 'once') {
          priceElement.textContent = formatPrice(priceElement.dataset.monthly, monthlySuffix);
        } else {
          priceElement.textContent = formatPrice(priceElement.dataset.once, onceSuffix);
        }
      });
    });
  });
};
