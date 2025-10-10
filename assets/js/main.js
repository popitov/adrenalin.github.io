// ---------- HELPERS ----------
const $ = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];
const showToast = (msg) => {
  const t = $('#toast');
  t.textContent = msg;
  t.style.display = 'block';
  clearTimeout(showToast._id);
  showToast._id = setTimeout(()=> t.style.display = 'none', 3500);
};

// ---------- THEME ----------
const themeToggle = $('#themeToggle');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const prefersLightMql = window.matchMedia('(prefers-color-scheme: light)');
const storedTheme = localStorage.getItem('theme');
let hasManualSelection = Boolean(storedTheme);

const updateThemeBtn = () => {
  const isLight = document.body.classList.contains('light');
  themeToggle.textContent = isLight ? '🌙' : '☀️';
};
const applyTheme = (name, { save = false } = {}) => {
  document.body.classList.toggle('light', name === 'light');
  themeToggle.setAttribute('aria-pressed', name === 'light' ? 'true' : 'false');
  if (themeColorMeta) {
themeColorMeta.content = name === 'light' ? '#eff1f5' : '#0f172a';
  }
  updateThemeBtn();
  if (save) {
localStorage.setItem('theme', name);
  }
};

if (storedTheme) {
  applyTheme(storedTheme);
} else {
  applyTheme(prefersLightMql.matches ? 'light' : 'dark');
}

prefersLightMql.addEventListener('change', (event) => {
  if (!hasManualSelection) {
applyTheme(event.matches ? 'light' : 'dark');
  }
});
themeToggle.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('light') ? 'dark' : 'light';
  hasManualSelection = true;
  applyTheme(nextTheme, { save: true });
});

// ---------- MENU ----------
const menuBtn = $('#menuBtn');
const navLinks = $('#navLinks');
const syncMenuButton = (isOpen) => {
  menuBtn.textContent = isOpen ? '×' : '☰';
  menuBtn.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Меню');
  menuBtn.classList.toggle('open', isOpen);
};
menuBtn.addEventListener('click', () => {
  const open = !navLinks.classList.contains('open');
  navLinks.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('no-scroll', open);
  syncMenuButton(open);
  open && navLinks.querySelector('a')?.focus();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
navLinks.classList.remove('open');
menuBtn.setAttribute('aria-expanded', 'false');
document.body.classList.remove('no-scroll');
syncMenuButton(false);
  }
});
$$('#navLinks a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('no-scroll');
  syncMenuButton(false);
}));

// ---------- YEAR ----------
$('#year').textContent = new Date().getFullYear();

// ---------- REVEAL on scroll ----------
const io = new IntersectionObserver((entries)=>{
  for(const e of entries){
if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); }
  }
}, { threshold: .15 });
$$('.reveal').forEach(el => io.observe(el));

// ---------- COUNT-UP STATS ----------
const runCountUp = () => {
  $$('.stats b[data-count]').forEach(el => {
const goal = Number(el.dataset.count);
const suffix = el.dataset.suffix || '';
const parseNumber = (value) => {
  const numeric = value
.replace(/\s/g, '')
.replace(/[^\d.,-]/g, '')
.replace(',', '.');
  const parsed = parseFloat(numeric);
  return Number.isFinite(parsed) ? parsed : 0;
};
const startValue = parseNumber(el.textContent.trim());
const diff = goal - startValue;
const formatValue = (num) => Math.round(num).toLocaleString('ru-RU') + suffix;
if (!Number.isFinite(goal)) {
  return;
}
if (diff === 0) {
  el.textContent = formatValue(goal);
  return;
}
const start = performance.now();
const dur = 1000;
const step = (t) => {
  const p = Math.min(1, (t - start) / dur);
  const current = startValue + diff * p;
  el.textContent = formatValue(current);
  if (p < 1) requestAnimationFrame(step);
};
requestAnimationFrame(step);
  });
};
const heroIO = new IntersectionObserver((entries)=>{
  entries.forEach(e => { if (e.isIntersecting) { runCountUp(); heroIO.disconnect(); } });
}, { threshold: .3 });
heroIO.observe($('#home'));

// ---------- BROCHURE DOWNLOAD ----------
$('#downloadBrochure').addEventListener('click', (e) => {
  e.preventDefault();
  const txt = `Автошкола «Адреналин» — программа курса (пример)
— Теория: 8 модулей (ПДД, знаки, разметка, безопасность, психология, первая помощь, устройство авто, экзамен).
— Практика: 20 часов по городским маршрутам (старт/стоп, парковка, маневрирование, развороты, взаимодействие).
— Пробный экзамен: отработка маршрута ГИБДД, чек-лист.
Контакты: +7 (900) 123-45-67, hello@adrenalin-avto.ru
`;
  const blob = new Blob([txt], {type:'text/plain;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'brochure-adrenalin.txt';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('Брошюра выгружена');
});

// ---------- PRICE DOWNLOAD ----------
$('#downloadPrice').addEventListener('click', () => {
  const csv = `Тариф;Описание;Цена
Базовый B;"Онлайн/офлайн теория, 20 ч. практики, пробный экзамен";29900
Экспресс;"Ускоренная программа, 22 ч. практики";34900
Индивидуальные занятия;"Парковка, трасса, экзамен";1500/час`;
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'price-adrenalin.csv';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('Прайс скачан');
});

// ---------- CONTRACT DOWNLOAD (DRAFT) ----------
$('#downloadContract').addEventListener('click', () => {
  const text = `ДОГОВОР №___ на обучение вождению (черновик)
Стороны: Автошкола «Адреналин» и Ученик __________
Предмет: Обучение по программе Категория B (Экспресс).
Стоимость: 34 900 ₽. Сроки: согласно расписанию. 
Подписи сторон: ______________________`;
  const blob = new Blob([text], {type:'text/plain;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'contract-draft.txt';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('Черновик договора скачан');
});

// ---------- BILLING TOGGLE ----------
const prices = $$('[data-price]');
const formatPrice = (value, suffix=' ₽') => {
  const num = Number(value);
  const formatted = Number.isFinite(num) ? num.toLocaleString('ru-RU') : value;
  return formatted + suffix;
};
$$('.toggle button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
$$('.toggle button').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
btn.classList.add('active'); btn.setAttribute('aria-pressed','true');
const mode = btn.dataset.bill;
prices.forEach(p=>{
  const onceSuffix = p.dataset.onceSuffix || ' ₽';
  const monthlySuffix = p.dataset.monthlySuffix || ' ₽ / мес';
  if (mode === 'monthly' && p.dataset.billing !== 'once') {
p.textContent = formatPrice(p.dataset.monthly, monthlySuffix);
  } else {
p.textContent = formatPrice(p.dataset.once, onceSuffix);
  }
});
  });
});

// ---------- SCHEDULE ----------
const schedule = [
  {date:'2025-09-12', time:'19:00', branch:'центр', format:'онлайн', title:'Теория: Вводное занятие'},
  {date:'2025-09-14', time:'10:00', branch:'север', format:'класс', title:'Теория: Знаки и разметка'},
  {date:'2025-09-15', time:'18:30', branch:'центр', format:'практика', title:'Практика: Парковка'},
  {date:'2025-09-16', time:'19:00', branch:'юг', format:'класс', title:'Теория: Безопасность'},
  {date:'2025-09-17', time:'18:00', branch:'центр', format:'практика', title:'Практика: Город (маршрут 2)'},
  {date:'2025-09-19', time:'19:00', branch:'север', format:'онлайн', title:'Теория: Экзамен ПДД (тренировка)'}
];
const fillSchedule = () => {
  const b = $('#branch').value;
  const f = $('#format').value;
  const s = $('#searchSchedule').value.toLowerCase().trim();
  const rows = schedule
.filter(x => (b==='all'||x.branch===b) && (f==='all'||x.format===f) && (!s || x.title.toLowerCase().includes(s)))
.map(x => `<tr>
  <td data-label="Дата">${new Date(x.date).toLocaleDateString('ru-RU')}</td>
  <td data-label="Время">${x.time}</td>
  <td data-label="Филиал">${x.branch}</td>
  <td data-label="Формат">${x.format}</td>
  <td data-label="Курс">${x.title}</td>
  <td data-label=""><button class="btn" data-open-modal="enroll" data-course="${x.title}">Записаться</button></td>
</tr>`).join('');
  $('#scheduleBody').innerHTML = rows || `<tr><td data-label="—" colspan="6"><i class="muted">Ничего не найдено</i></td></tr>`;
};
fillSchedule();
$('#branch').addEventListener('change', fillSchedule);
$('#format').addEventListener('change', fillSchedule);
$('#searchSchedule').addEventListener('input', fillSchedule);

// ---------- ICS DOWNLOAD (Europe/Moscow) ----------
const toICSDate = (dateStr, timeStr) => {
  const [d,m,y] = dateStr.split('.'); // dd.mm.yyyy
  const [hh,mm] = timeStr.split(':');
  const ymd = `${y}${m.padStart(2,'0')}${d.padStart(2,'0')}`;
  const hms = `${hh}${mm}00`;
  return `${ymd}T${hms}`;
};
$('#downloadICS').addEventListener('click', () => {
  const rows = [...$('#scheduleBody').querySelectorAll('tr')];
  const lines = [
'BEGIN:VCALENDAR',
'VERSION:2.0',
'PRODID:-//Adrenalin//Schedule//RU',
'CALSCALE:GREGORIAN',
'X-WR-CALNAME:Adrenalin Schedule',
'X-WR-TIMEZONE:Europe/Moscow'
  ];
  rows.forEach((tr,i) => {
const tds = tr.querySelectorAll('td');
if (tds.length < 5) return;
const date = tds[0].textContent.trim();
const time = tds[1].textContent.trim();
const branch = tds[2].textContent.trim();
const title = tds[4].textContent.trim().replace(/\n/g,' ');
const start = toICSDate(date, time);
const [hh,mm] = time.split(':').map(Number);
const endH = String(hh + 1).padStart(2,'0');
const end = toICSDate(date, `${endH}:${String(mm).padStart(2,'0')}`);
const uid = `adrenalin-${start}-${i}@example`;
lines.push('BEGIN:VEVENT');
lines.push(`UID:${uid}`);
lines.push(`DTSTART;TZID=Europe/Moscow:${start}`);
lines.push(`DTEND;TZID=Europe/Moscow:${end}`);
lines.push(`SUMMARY:${title}`);
lines.push(`LOCATION:${branch}`);
lines.push('END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  const ics = `${lines.join('\r\n')}\r\n`;
  const blob = new Blob([ics], {type:'text/calendar'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'adrenalin-schedule.ics';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('Файл расписания .ics скачан');
});

// ---------- MODALS with focus trap ----------
const modals = {
  enroll: $('#modalEnroll'),
  details: $('#modalDetails'),
  call: $('#modalCall'),
  policy: $('#modalPolicy'),
};
const findModalName = (el) => {
  if (!el) return null;
  const entry = Object.entries(modals).find(([, modalEl]) => modalEl === el);
  return entry ? entry[0] : null;
};
const getFocusable = (root) => [...root.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el=>!el.disabled && el.offsetParent !== null);
const trap = (e, modal) => {
  if (e.key !== 'Tab') return;
  const f = getFocusable(modal);
  if (!f.length) return;
  const first = f[0], last = f[f.length-1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
};
const openModal = (name, { returnFocus } = {}) => {
  const m = modals[name];
  const fallback = document.activeElement;
  const focusTarget = returnFocus instanceof HTMLElement
? returnFocus
: typeof returnFocus === 'string'
  ? document.querySelector(returnFocus)
  : null;
  m._restoreFocus = focusTarget || fallback;
  m.style.display = 'flex';
  m.setAttribute('aria-hidden','false');
  const first = getFocusable(m)[0];
  first && first.focus();
  m._handler = (e)=> trap(e, m);
  document.addEventListener('keydown', m._handler);
};
const closeModal = (name) => {
  const m = modals[name];
  if (!m || m.getAttribute('aria-hidden') === 'true') return;
  m.style.display = 'none';
  m.setAttribute('aria-hidden','true');
  if (m._handler) {
document.removeEventListener('keydown', m._handler);
m._handler = null;
  }
  const focusBack = m._restoreFocus;
  m._restoreFocus = null;
  if (focusBack && typeof focusBack.focus === 'function') {
focusBack.focus();
  }
};
document.addEventListener('click', (e)=>{
  const openBtn = e.target.closest('[data-open-modal]');
  if (openBtn) {
e.preventDefault();
if (openBtn.tagName === 'BUTTON') {
  e.stopPropagation();
}
const name = openBtn.dataset.openModal;
if (name === 'enroll') {
  const course = openBtn.dataset.course || '';
  const instructor = openBtn.dataset.instructor || '';
  if (course) $('#enrollForm [name="course"]').value = course;
  if (instructor) $('#enrollForm [name="instructor"]').value = instructor;
}
if (name === 'details') {
  const course = openBtn.dataset.course || 'Курс';
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
openModal(name, { returnFocus: openBtn.dataset.returnFocus });
  }
  const closeBtn = e.target.matches('[data-close-modal]') ? e.target : null;
  if (closeBtn) {
const backdrop = closeBtn.closest('.modal-backdrop');
const modalName = findModalName(backdrop);
if (modalName) closeModal(modalName);
  } else if (e.target.classList.contains('modal-backdrop')) {
const modalName = findModalName(e.target);
if (modalName) closeModal(modalName);
  }
});
$('#openPolicy').addEventListener('click', (e)=>{ e.preventDefault(); openModal('policy'); });
$('#openPolicy2').addEventListener('click', (e)=>{ e.preventDefault(); openModal('policy'); });

// ---------- FORMS (mask + simulated submit) ----------
const serialize = (form) => Object.fromEntries(new FormData(form).entries());
const isSpam = (data) => (data.company && data.company.trim().length > 0); // honeypot
const phoneEls = $$('.phone');
const formatPhone = (val) => {
  const digits = val.replace(/\D/g,'');
  let v = digits;
  if (v.startsWith('8')) v = '7' + v.slice(1);
  if (!v.startsWith('7')) v = '7' + v;
  v = v.slice(0, 11);
  const p1 = v.slice(1,4), p2 = v.slice(4,7), p3 = v.slice(7,9), p4 = v.slice(9,11);
  let out = '+7';
  if (p1) out += ` (${p1}`;
  if (p1 && p1.length===3) out += ')';
  if (p2) out += ` ${p2}`;
  if (p3) out += `-${p3}`;
  if (p4) out += `-${p4}`;
  return out;
};
phoneEls.forEach(el=>{
  el.addEventListener('input', ()=> { el.value = formatPhone(el.value); });
  el.addEventListener('blur', ()=> { el.value = formatPhone(el.value); });
});

const validateForm = (form) => {
  let ok = true;
  form.querySelectorAll('.input, .select').forEach(el => el.classList.remove('error'));
  const data = serialize(form);
  if (!data.name || data.name.trim().length < 2) { ok=false; form.querySelector('[name="name"]').classList.add('error'); }
  if (!data.phone || (data.phone.match(/\d/g)||[]).length < 11) { ok=false; form.querySelector('[name="phone"]').classList.add('error'); }
  const consent = form.querySelector('input[type="checkbox"][required]');
  if (consent && !consent.checked) { ok=false; consent.focus(); }
  if (isSpam(data)) ok = false;
  return ok;
};

const submitSim = (form, successMsg) => {
  form.addEventListener('submit', (e)=>{
e.preventDefault();
if (!validateForm(form)) { showToast('Проверьте поля формы'); return; }
form.reset();
showToast(successMsg);
Object.keys(modals).forEach(closeModal);
  });
};
submitSim($('#contactForm'), 'Сообщение отправлено — свяжемся с вами!');
submitSim($('#enrollForm'), 'Заявка на обучение принята!');
submitSim($('#callForm'), 'В ближайшее время перезвоним!');

// ---------- FAQ ----------
$$('.faq-item').forEach((item, idx)=>{
  const q = $('.faq-q', item);
  const a = $('.faq-a', item);
  const btn = $('.x', q);
  if (!btn) return;
  if (btn && !btn.id) btn.id = `faqToggle${idx + 1}`;
  const setState = (open) => {
item.classList.toggle('open', open);
a.style.height = open ? `${a.scrollHeight}px` : '0px';
btn.textContent = open ? '−' : '+';
btn.setAttribute('aria-expanded', open ? 'true' : 'false');
btn.setAttribute('aria-label', open ? 'Скрыть' : 'Открыть');
  };
  setState(item.classList.contains('open'));
  q.addEventListener('click', (e)=>{
if (!e.target.closest('.faq-q')) return;
setState(!item.classList.contains('open'));
  });
});

// ---------- REVIEWS ----------
const reviews = [
  {name:'Анна', text:'Отличная автошкола! Теория онлайн — удобно, инструктор спокойно и доходчиво объясняет. Сдала с первого раза 🙌'},
  {name:'Михаил', text:'Брал экспресс-курс, в график вписался без проблем. Парковка и развороты перестали быть стрессом. Рекомендую!'},
  {name:'Марина', text:'Взяла блок индивидуальных занятий перед экзаменом — уверенности стало в разы больше, всё получилось.'}
];
const track = $('#reviewTrack');
const dotsWrap = $('#reviewDots');
reviews.slice(1).forEach(r => {
  const art = document.createElement('article');
  art.className = 'review';
  art.innerHTML = `<div class="review-body"><h3>${r.name}</h3><p class="muted">${r.text}</p></div>`;
  track.appendChild(art);
});
let idx = 0;
const slides = track.children.length;
for (let i=0;i<slides;i++){
  const d = document.createElement('div');
  d.className = 'dot' + (i===0?' active':'');
  d.dataset.i = i;
  d.addEventListener('click', ()=> { idx = i; updateReviews(); });
  dotsWrap.appendChild(d);
}
const updateReviews = ()=> {
  track.style.transform = `translateX(-${idx*100}%)`;
  $$('.dot', dotsWrap).forEach((d,i)=>d.classList.toggle('active', i===idx));
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
  if (reviewInterval || reducedMotionMedia.matches) return;
  reviewInterval = setInterval(()=> { idx = (idx+1)%slides; updateReviews(); }, 4500);
};
startReviewsAuto();
reducedMotionMedia.addEventListener('change', (event)=> {
  if (event.matches) {
stopReviewsAuto();
  } else {
startReviewsAuto();
  }
});

  // ---------- BACK TO TOP ----------
  const toTop = $('#toTop');
window.addEventListener('scroll', ()=>{
  toTop.style.display = window.scrollY > 600 ? 'inline-flex' : 'none';
});
toTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

// ---------- COOKIE ----------
const cookie = $('#cookie');
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
if (!localStorage.getItem(cookieKey)) { cookie.style.display = 'block'; }
updateCta();
if (floatingCtaMedia.addEventListener) {
  floatingCtaMedia.addEventListener('change', updateCta);
} else if (floatingCtaMedia.addListener) {
  floatingCtaMedia.addListener(updateCta);
}
$('#cookieOk').addEventListener('click', ()=> { localStorage.setItem(cookieKey, 'all'); cookie.style.display='none'; updateCta(); showToast('Спасибо!'); });
$('#cookieNo').addEventListener('click', ()=> { localStorage.setItem(cookieKey, 'necessary'); cookie.style.display='none'; updateCta(); showToast('Только необходимые cookie'); });

// ---------- NAV active section highlight ----------
const sections = ['about','courses','schedule','pricing','instructors','fleet','reviews','faq','contacts'].map(id => document.getElementById(id));
const linkById = Object.fromEntries($$('#navLinks a').map(a=>[a.getAttribute('href').slice(1), a]));
const secIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
if(e.isIntersecting){
  const id = e.target.id;
  Object.values(linkById).forEach(a=>a.classList.remove('active'));
  linkById[id]?.classList.add('active');
}
  });
}, { rootMargin: '-40% 0% -50% 0%', threshold: .1 });
sections.forEach(s=>secIO.observe(s));

// ---------- Smooth anchor focus ----------
$$('#navLinks a').forEach(a=>{
  a.addEventListener('click', (e)=> {
const id = a.getAttribute('href').slice(1);
const el = document.getElementById(id);
if (el) {
  e.preventDefault();
  el.scrollIntoView({behavior:'smooth', block:'start'});
  el.setAttribute('tabindex','-1'); el.focus({preventScroll:true});
  setTimeout(()=> el.removeAttribute('tabindex'), 500);
}
  });
});

// ---------- SCROLL PROGRESS ----------
const progress = $('#scrollProgress');
const onScroll = () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progress.style.width = scrolled + '%';
};
document.addEventListener('scroll', onScroll, {passive:true});
onScroll();

// ---------- 3D TILT ----------
const tiltables = $$('.tilt');
const tilt = (e, el) => {
  const r = el.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  const rx = ((y / r.height) - .5) * -6; // deg
  const ry = ((x / r.width) - .5) * 6;
  el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
};
const tiltReset = (el) => { el.style.transform = ''; };
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const tiltHandlers = new WeakMap();
let tiltListenersActive = false;

const ensureHandlers = (el) => {
  if (tiltHandlers.has(el)) return tiltHandlers.get(el);
  const handlers = {
mousemove: (e) => tilt(e, el),
mouseleave: () => tiltReset(el),
blur: () => tiltReset(el),
  };
  tiltHandlers.set(el, handlers);
  return handlers;
};

const addTiltListeners = () => {
  if (tiltListenersActive) return;
  tiltables.forEach((el) => {
const handlers = ensureHandlers(el);
el.addEventListener('mousemove', handlers.mousemove);
el.addEventListener('mouseleave', handlers.mouseleave);
el.addEventListener('blur', handlers.blur);
  });
  tiltListenersActive = true;
};

const removeTiltListeners = () => {
  if (!tiltListenersActive) return;
  tiltables.forEach((el) => {
const handlers = tiltHandlers.get(el);
if (!handlers) return;
el.removeEventListener('mousemove', handlers.mousemove);
el.removeEventListener('mouseleave', handlers.mouseleave);
el.removeEventListener('blur', handlers.blur);
tiltReset(el);
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
reducedMotionQuery.addEventListener('change', applyReducedMotionPreference);

// ---------- ACCESSIBILITY: global Escape closes modals ----------
document.addEventListener('keydown', (e)=>{
  if (e.key === 'Escape') Object.keys(modals).forEach(closeModal);
});
