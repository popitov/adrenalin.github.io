import { $, $$, showToast } from '../utils/dom.js';

const serialize = (form) => Object.fromEntries(new FormData(form).entries());
const isSpam = (data) => data.company && data.company.trim().length > 0;

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '');
  let normalized = digits;
  if (normalized.startsWith('8')) {
    normalized = '7' + normalized.slice(1);
  }
  if (!normalized.startsWith('7')) {
    normalized = '7' + normalized;
  }
  normalized = normalized.slice(0, 11);
  const p1 = normalized.slice(1, 4);
  const p2 = normalized.slice(4, 7);
  const p3 = normalized.slice(7, 9);
  const p4 = normalized.slice(9, 11);
  let output = '+7';
  if (p1) output += ` (${p1}`;
  if (p1 && p1.length === 3) output += ')';
  if (p2) output += ` ${p2}`;
  if (p3) output += `-${p3}`;
  if (p4) output += `-${p4}`;
  return output;
};

const validateForm = (form) => {
  let isValid = true;
  form.querySelectorAll('.input, .select').forEach((element) => element.classList.remove('error'));
  const data = serialize(form);
  if (!data.name || data.name.trim().length < 2) {
    isValid = false;
    form.querySelector('[name="name"]').classList.add('error');
  }
  const phoneDigits = (data.phone?.match(/\d/g) || []).length;
  if (!data.phone || phoneDigits < 11) {
    isValid = false;
    form.querySelector('[name="phone"]').classList.add('error');
  }
  const consent = form.querySelector('input[type="checkbox"][required]');
  if (consent && !consent.checked) {
    isValid = false;
    consent.focus();
  }
  if (isSpam(data)) {
    isValid = false;
  }
  return isValid;
};

const attachSubmit = (form, successMessage, closeAllModals) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateForm(form)) {
      showToast('Проверьте поля формы');
      return;
    }
    form.reset();
    showToast(successMessage);
    closeAllModals?.();
  });
};

export const initForms = ({ closeAllModals } = {}) => {
  $$('.phone').forEach((element) => {
    element.addEventListener('input', () => {
      element.value = formatPhone(element.value);
    });
    element.addEventListener('blur', () => {
      element.value = formatPhone(element.value);
    });
  });

  const closeModals = typeof closeAllModals === 'function' ? closeAllModals : null;
  const closeHandler = closeModals ? () => closeModals() : null;

  const contactForm = $('#contactForm');
  const enrollForm = $('#enrollForm');
  const callForm = $('#callForm');

  contactForm && attachSubmit(contactForm, 'Сообщение отправлено — свяжемся с вами!', closeHandler);
  enrollForm && attachSubmit(enrollForm, 'Заявка на обучение принята!', closeHandler);
  callForm && attachSubmit(callForm, 'В ближайшее время перезвоним!', closeHandler);
};
