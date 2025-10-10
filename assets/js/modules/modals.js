import { $ } from '../utils/dom.js';

const getFocusableElements = (root) =>
  Array.from(root.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])'))
    .filter((element) => !element.disabled && element.offsetParent !== null);

const trapFocus = (event, modal) => {
  if (event.key !== 'Tab') {
    return;
  }
  const focusable = getFocusableElements(modal);
  if (!focusable.length) {
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

export const initModals = () => {
  const modals = {
    enroll: $('#modalEnroll'),
    details: $('#modalDetails'),
    call: $('#modalCall'),
    policy: $('#modalPolicy'),
  };

  const findModalName = (element) => {
    if (!element) {
      return null;
    }
    const entry = Object.entries(modals).find(([, modalEl]) => modalEl === element);
    return entry ? entry[0] : null;
  };

  const openModal = (name, { returnFocus } = {}) => {
    const modal = modals[name];
    if (!modal || modal.getAttribute('aria-hidden') === 'false') {
      return;
    }

    const fallback = document.activeElement;
    const focusTarget = returnFocus instanceof HTMLElement
      ? returnFocus
      : typeof returnFocus === 'string'
        ? document.querySelector(returnFocus)
        : null;

    modal._restoreFocus = focusTarget || fallback;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');

    const first = getFocusableElements(modal)[0];
    first?.focus();

    modal._handler = (event) => trapFocus(event, modal);
    document.addEventListener('keydown', modal._handler);
  };

  const closeModal = (name) => {
    const modal = modals[name];
    if (!modal || modal.getAttribute('aria-hidden') === 'true') {
      return;
    }

    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');

    if (modal._handler) {
      document.removeEventListener('keydown', modal._handler);
      modal._handler = null;
    }

    const focusBack = modal._restoreFocus;
    modal._restoreFocus = null;
    if (focusBack && typeof focusBack.focus === 'function') {
      focusBack.focus();
    }
  };

  const closeAllModals = () => {
    Object.keys(modals).forEach(closeModal);
  };

  document.addEventListener('click', (event) => {
    const openButton = event.target.closest('[data-open-modal]');
    if (openButton) {
      event.preventDefault();
      if (openButton.tagName === 'BUTTON') {
        event.stopPropagation();
      }
      const name = openButton.dataset.openModal;
      if (name === 'enroll') {
        const course = openButton.dataset.course || '';
        const instructor = openButton.dataset.instructor || '';
        if (course) {
          $('#enrollForm [name="course"]').value = course;
        }
        if (instructor) {
          $('#enrollForm [name="instructor"]').value = instructor;
        }
      }
      if (name === 'details') {
        const course = openButton.dataset.course || 'Курс';
        $('#detailsTitle').textContent = `Подробности: ${course}`;
        $('#detailsBody').innerHTML = `
            <ul>
              <li>• Подробный план занятий</li>
              <li>• Требования к ученикам, документы</li>
              <li>• Экзаменационные маршруты</li>
              <li>• Гарантии и условия возврата</li>
            </ul>
            <p style="margin-top:.5rem;">Оставьте заявку, и администратор пришлёт PDF с программой и договором.</p>`;
      }
      openModal(name, { returnFocus: openButton.dataset.returnFocus });
    }

    const closeButton = event.target.matches('[data-close-modal]') ? event.target : null;
    if (closeButton) {
      const backdrop = closeButton.closest('.modal-backdrop');
      const modalName = findModalName(backdrop);
      if (modalName) {
        closeModal(modalName);
      }
    } else if (event.target.classList?.contains('modal-backdrop')) {
      const modalName = findModalName(event.target);
      if (modalName) {
        closeModal(modalName);
      }
    }
  });

  $('#openPolicy')?.addEventListener('click', (event) => {
    event.preventDefault();
    openModal('policy');
  });
  $('#openPolicy2')?.addEventListener('click', (event) => {
    event.preventDefault();
    openModal('policy');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAllModals();
    }
  });

  return { openModal, closeModal, closeAllModals };
};
