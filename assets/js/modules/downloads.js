import { $, showToast } from '../utils/dom.js';

const createFileAndDownload = (content, fileName, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const initDownloads = () => {
  const brochureBtn = $('#downloadBrochure');
  const priceBtn = $('#downloadPrice');
  const contractBtn = $('#downloadContract');

  brochureBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    const text = `Автошкола «Адреналин» — программа курса (пример)\n` +
      '— Теория: 8 модулей (ПДД, знаки, разметка, безопасность, психология, первая помощь, устройство авто, экзамен).\n' +
      '— Практика: 20 часов по городским маршрутам (старт/стоп, парковка, маневрирование, развороты, взаимодействие).\n' +
      '— Пробный экзамен: отработка маршрута ГИБДД, чек-лист.\n' +
      'Контакты: +7 (900) 123-45-67, hello@adrenalin-avto.ru\n';
    createFileAndDownload(text, 'brochure-adrenalin.txt', 'text/plain;charset=utf-8');
    showToast('Брошюра выгружена');
  });

  priceBtn?.addEventListener('click', () => {
    const csv = `Тариф;Описание;Цена\n` +
      'Базовый B;"Онлайн/офлайн теория, 20 ч. практики, пробный экзамен";29900\n' +
      'Экспресс;"Ускоренная программа, 22 ч. практики";34900\n' +
      'Индивидуальные занятия;"Парковка, трасса, экзамен";1500/час';
    createFileAndDownload(csv, 'price-adrenalin.csv', 'text/csv;charset=utf-8');
    showToast('Прайс скачан');
  });

  contractBtn?.addEventListener('click', () => {
    const text = `ДОГОВОР №___ на обучение вождению (черновик)\n` +
      'Стороны: Автошкола «Адреналин» и Ученик __________\n' +
      'Предмет: Обучение по программе Категория B (Экспресс).\n' +
      'Стоимость: 34 900 ₽. Сроки: согласно расписанию.\n' +
      'Подписи сторон: ______________________';
    createFileAndDownload(text, 'contract-draft.txt', 'text/plain;charset=utf-8');
    showToast('Черновик договора скачан');
  });
};
