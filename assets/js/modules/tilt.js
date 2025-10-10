import { $$ } from '../utils/dom.js';

const tiltElement = (event, element) => {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const rotateX = ((y / rect.height) - 0.5) * -6;
  const rotateY = ((x / rect.width) - 0.5) * 6;
  element.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
};

const resetTilt = (element) => {
  element.style.transform = '';
};

export const initTilt = () => {
  const tiltElements = $$('.tilt');
  if (!tiltElements.length) {
    return;
  }

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const tiltHandlers = new WeakMap();
  let tiltListenersActive = false;

  const ensureHandlers = (element) => {
    if (tiltHandlers.has(element)) {
      return tiltHandlers.get(element);
    }
    const handlers = {
      mousemove: (event) => tiltElement(event, element),
      mouseleave: () => resetTilt(element),
      blur: () => resetTilt(element),
    };
    tiltHandlers.set(element, handlers);
    return handlers;
  };

  const addTiltListeners = () => {
    if (tiltListenersActive) {
      return;
    }
    tiltElements.forEach((element) => {
      const handlers = ensureHandlers(element);
      element.addEventListener('mousemove', handlers.mousemove);
      element.addEventListener('mouseleave', handlers.mouseleave);
      element.addEventListener('blur', handlers.blur);
    });
    tiltListenersActive = true;
  };

  const removeTiltListeners = () => {
    if (!tiltListenersActive) {
      return;
    }
    tiltElements.forEach((element) => {
      const handlers = tiltHandlers.get(element);
      if (!handlers) {
        return;
      }
      element.removeEventListener('mousemove', handlers.mousemove);
      element.removeEventListener('mouseleave', handlers.mouseleave);
      element.removeEventListener('blur', handlers.blur);
      resetTilt(element);
    });
    tiltListenersActive = false;
  };

  const applyReducedMotionPreference = (query) => {
    if (query.matches) {
      removeTiltListeners();
    } else {
      addTiltListeners();
    }
  };

  applyReducedMotionPreference(reducedMotionQuery);

  const reducedMotionChangeHandler = (event) => {
    applyReducedMotionPreference(event);
  };

  if (typeof reducedMotionQuery.addEventListener === 'function') {
    reducedMotionQuery.addEventListener('change', reducedMotionChangeHandler);
  } else if (typeof reducedMotionQuery.addListener === 'function') {
    reducedMotionQuery.addListener(reducedMotionChangeHandler);
  }
};
