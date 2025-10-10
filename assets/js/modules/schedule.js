import { $, showToast } from '../utils/dom.js';

const scheduleData = [
  { date: '2025-09-12', time: '19:00', branch: 'центр', format: 'онлайн', title: 'Теория: Вводное занятие' },
  { date: '2025-09-14', time: '10:00', branch: 'север', format: 'класс', title: 'Теория: Знаки и разметка' },
  { date: '2025-09-15', time: '18:30', branch: 'центр', format: 'практика', title: 'Практика: Парковка' },
  { date: '2025-09-16', time: '19:00', branch: 'юг', format: 'класс', title: 'Теория: Безопасность' },
  { date: '2025-09-17', time: '18:00', branch: 'центр', format: 'практика', title: 'Практика: Город (маршрут 2)' },
  { date: '2025-09-19', time: '19:00', branch: 'север', format: 'онлайн', title: 'Теория: Экзамен ПДД (тренировка)' },
];

const renderSchedule = () => {
  const branch = $('#branch')?.value || 'all';
  const format = $('#format')?.value || 'all';
  const search = $('#searchSchedule')?.value.toLowerCase().trim() || '';

  const rows = scheduleData
    .filter(
      (item) =>
        (branch === 'all' || item.branch === branch) &&
        (format === 'all' || item.format === format) &&
        (!search || item.title.toLowerCase().includes(search)),
    )
    .map(
      (item) => `<tr>
          <td data-label="Дата">${new Date(item.date).toLocaleDateString('ru-RU')}</td>
          <td data-label="Время">${item.time}</td>
          <td data-label="Филиал">${item.branch}</td>
          <td data-label="Формат">${item.format}</td>
          <td data-label="Курс">${item.title}</td>
          <td data-label=""><button class="btn" data-open-modal="enroll" data-course="${item.title}">Записаться</button></td>
        </tr>`
    )
    .join('');

  const scheduleBody = $('#scheduleBody');
  if (!scheduleBody) {
    return;
  }

  scheduleBody.innerHTML = rows || `<tr><td data-label="—" colspan="6"><i class="muted">Ничего не найдено</i></td></tr>`;
};

const toICSDate = (dateStr, timeStr) => {
  const [day, month, year] = dateStr.split('.');
  const [hours, minutes] = timeStr.split(':');
  const ymd = `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`;
  const hms = `${hours}${minutes}00`;
  return `${ymd}T${hms}`;
};

const downloadICS = () => {
  const rows = [...(($('#scheduleBody')?.querySelectorAll('tr')) ?? [])];
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Adrenalin//Schedule//RU',
    'CALSCALE:GREGORIAN',
    'X-WR-CALNAME:Adrenalin Schedule',
    'X-WR-TIMEZONE:Europe/Moscow',
  ];

  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td');
    if (cells.length < 5) {
      return;
    }
    const date = cells[0].textContent.trim();
    const time = cells[1].textContent.trim();
    const branch = cells[2].textContent.trim();
    const title = cells[4].textContent.trim().replace(/\n/g, ' ');
    const start = toICSDate(date, time);
    const [hh, mm] = time.split(':').map(Number);
    const endHour = String(hh + 1).padStart(2, '0');
    const end = toICSDate(date, `${endHour}:${String(mm).padStart(2, '0')}`);

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:adrenalin-${start}-${index}@example`);
    lines.push(`DTSTART;TZID=Europe/Moscow:${start}`);
    lines.push(`DTEND;TZID=Europe/Moscow:${end}`);
    lines.push(`SUMMARY:${title}`);
    lines.push(`LOCATION:${branch}`);
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  const icsContent = `${lines.join('\r\n')}\r\n`;
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'adrenalin-schedule.ics';
  link.click();
  URL.revokeObjectURL(link.href);
  showToast('Файл расписания .ics скачан');
};

export const initSchedule = () => {
  renderSchedule();
  $('#branch')?.addEventListener('change', renderSchedule);
  $('#format')?.addEventListener('change', renderSchedule);
  $('#searchSchedule')?.addEventListener('input', renderSchedule);
  $('#downloadICS')?.addEventListener('click', downloadICS);
};
