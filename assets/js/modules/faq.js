import { $, $$ } from '../utils/dom.js';

export const initFaq = () => {
  $$('.faq-item').forEach((item, index) => {
    const question = $('.faq-q', item);
    const answer = $('.faq-a', item);
    const toggle = $('.x', question);
    if (!question || !answer || !toggle) {
      return;
    }

    if (!toggle.id) {
      toggle.id = `faqToggle${index + 1}`;
    }

    item.classList.add('js-collapsible');

    const setState = (open) => {
      item.classList.toggle('open', open);
      if (item.classList.contains('js-collapsible')) {
        answer.style.height = open ? `${answer.scrollHeight}px` : '0px';
      }
      toggle.textContent = open ? '−' : '+';
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Скрыть' : 'Открыть');
    };

    setState(item.classList.contains('open'));

    question.addEventListener('click', (event) => {
      if (!event.target.closest('.faq-q')) {
        return;
      }
      setState(!item.classList.contains('open'));
    });
  });
};
