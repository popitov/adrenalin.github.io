export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

export const showToast = (message) => {
  const toast = $('#toast');
  if (!toast) {
    return;
  }
  toast.textContent = message;
  toast.style.display = 'block';
  clearTimeout(showToast._timeoutId);
  showToast._timeoutId = setTimeout(() => {
    toast.style.display = 'none';
  }, 3500);
};
