import { $, $$ } from '../utils/dom.js';

const reviewsData = [
  { name: 'Анна', text: 'Отличная автошкола! Теория онлайн — удобно, инструктор спокойно и доходчиво объясняет. Сдала с первого раза 🙌' },
  { name: 'Михаил', text: 'Брал экспресс-курс, в график вписался без проблем. Парковка и развороты перестали быть стрессом. Рекомендую!' },
  { name: 'Марина', text: 'Взяла блок индивидуальных занятий перед экзаменом — уверенности стало в разы больше, всё получилось.' },
];

export const initReviews = () => {
  const track = $('#reviewTrack');
  const dotsWrap = $('#reviewDots');
  if (!track || !dotsWrap) {
    return;
  }

  reviewsData.slice(1).forEach((review) => {
    const article = document.createElement('article');
    article.className = 'review';
    article.innerHTML = `<div class="review-body"><h3>${review.name}</h3><p class="muted">${review.text}</p></div>`;
    track.appendChild(article);
  });

  let index = 0;
  const slides = track.children.length;

  for (let i = 0; i < slides; i += 1) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.dataset.i = i;
    dot.addEventListener('click', () => {
      index = i;
      updateReviews();
      handleInteraction();
    });
    dotsWrap.appendChild(dot);
  }

  const updateReviews = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    $$('.dot', dotsWrap).forEach((dotElement, dotIndex) => {
      dotElement.classList.toggle('active', dotIndex === index);
    });
  };

  const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reviewInterval = null;

  const stopReviewsAuto = () => {
    if (reviewInterval) {
      clearInterval(reviewInterval);
      reviewInterval = null;
    }
  };

  const startReviewsAuto = () => {
    if (reviewInterval || reducedMotionMedia.matches) {
      return;
    }
    reviewInterval = setInterval(() => {
      index = (index + 1) % slides;
      updateReviews();
    }, 4500);
  };

  const handleInteraction = () => {
    stopReviewsAuto();
    startReviewsAuto();
  };

  startReviewsAuto();

  reducedMotionMedia.addEventListener('change', (event) => {
    if (event.matches) {
      stopReviewsAuto();
    } else {
      startReviewsAuto();
    }
  });

  track.addEventListener('mouseenter', stopReviewsAuto);
  track.addEventListener('mouseleave', startReviewsAuto);
  dotsWrap.addEventListener('mouseenter', stopReviewsAuto);
  dotsWrap.addEventListener('mouseleave', startReviewsAuto);
};
