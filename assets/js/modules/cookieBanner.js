import { $, showToast } from '../utils/dom.js';

export const initCookieBanner = () => {
  const cookie = $('#cookie');
  const cookieOk = $('#cookieOk');
  const cookieNo = $('#cookieNo');
  if (!cookie || !cookieOk || !cookieNo) {
    return;
  }

  const cookieKey = 'cookie_adrenalin_ok';
  const floatCta = $('.floating-cta');
  const floatingCtaMedia = window.matchMedia('(max-width: 980px)');

  const applyCookieState = () => {
    if (!cookie) {
      document.body.classList.remove('cookie-banner-visible');
      document.body.style.removeProperty('--cookie-offset');
      return false;
    }

    const visible = window.getComputedStyle(cookie).display !== 'none';
    document.body.classList.toggle('cookie-banner-visible', visible);

    if (visible) {
      const offset = cookie.offsetHeight + 16;
      document.body.style.setProperty('--cookie-offset', `${offset}px`);
    } else {
      document.body.style.removeProperty('--cookie-offset');
    }

    return visible;
  };

  const updateFloatingCtaState = () => {
    if (!floatCta) {
      document.body.classList.remove('has-floating-cta');
      return;
    }

    const shouldShow = floatingCtaMedia.matches;
    if (shouldShow) {
      floatCta.style.removeProperty('display');
    } else {
      floatCta.style.display = 'none';
    }

    document.body.classList.toggle('has-floating-cta', shouldShow);
  };

  const updateState = () => {
    applyCookieState();
    updateFloatingCtaState();
  };

  if (!localStorage.getItem(cookieKey)) {
    cookie.style.display = 'block';
  }

  updateState();

  if (typeof floatingCtaMedia.addEventListener === 'function') {
    floatingCtaMedia.addEventListener('change', updateState);
  } else if (typeof floatingCtaMedia.addListener === 'function') {
    floatingCtaMedia.addListener(updateState);
  }

  window.addEventListener('resize', applyCookieState);

  cookieOk.addEventListener('click', () => {
    localStorage.setItem(cookieKey, 'all');
    cookie.style.display = 'none';
    updateState();
    showToast('Спасибо!');
  });

  cookieNo.addEventListener('click', () => {
    localStorage.setItem(cookieKey, 'necessary');
    cookie.style.display = 'none';
    updateState();
    showToast('Только необходимые cookie');
  });
};
