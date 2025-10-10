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

export const addMediaQueryListener = (mediaQueryList, handler) => {
  if (typeof mediaQueryList.addEventListener === 'function') {
    mediaQueryList.addEventListener('change', handler);
  } else if (typeof mediaQueryList.addListener === 'function') {
    mediaQueryList.addListener(handler);
  }
};

export const removeMediaQueryListener = (mediaQueryList, handler) => {
  if (typeof mediaQueryList.removeEventListener === 'function') {
    mediaQueryList.removeEventListener('change', handler);
  } else if (typeof mediaQueryList.removeListener === 'function') {
    mediaQueryList.removeListener(handler);
  }
};
