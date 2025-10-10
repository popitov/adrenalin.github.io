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

  const updateCta = () => {
    if (!floatCta || !cookie) {
      document.body.classList.remove('has-floating-cta');
      return;
    }
    const shouldHide = cookie.style.display === 'block';
    floatCta.style.display = shouldHide ? 'none' : '';
    const isVisible = !shouldHide && floatingCtaMedia.matches;
    document.body.classList.toggle('has-floating-cta', isVisible);
  };

  if (!localStorage.getItem(cookieKey)) {
    cookie.style.display = 'block';
  }

  updateCta();

  if (typeof floatingCtaMedia.addEventListener === 'function') {
    floatingCtaMedia.addEventListener('change', updateCta);
  } else if (typeof floatingCtaMedia.addListener === 'function') {
    floatingCtaMedia.addListener(updateCta);
  }

  cookieOk.addEventListener('click', () => {
    localStorage.setItem(cookieKey, 'all');
    cookie.style.display = 'none';
    updateCta();
    showToast('Спасибо!');
  });

  cookieNo.addEventListener('click', () => {
    localStorage.setItem(cookieKey, 'necessary');
    cookie.style.display = 'none';
    updateCta();
    showToast('Только необходимые cookie');
  });
};
