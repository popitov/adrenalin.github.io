import { $, showToast } from '../utils/dom.js';

let scheduleData = [];

const toISODate = (value) => {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (match) {
    const [, dd, mm, yyyy] = match;
    return `${yyyy}-${mm}-${dd}`;
  }
  return null;
};

const normalizeBranch = (value) => (value ? value.trim().toLowerCase() : '');

const normalizeFormat = (value) => {
  if (!value) {
    return '';
  }
  const normalized = value.trim().toLowerCase();
  switch (normalized) {
    case 'онлайн теория':
      return 'онлайн';
    case 'теория в классе':
      return 'класс';
    default:
      return normalized;
  }
};

const ensureScheduleData = () => {
  if (scheduleData.length > 0) {
    return;
  }

  const scheduleBody = $('#scheduleBody');
  if (!scheduleBody) {
    return;
  }

  const rows = [...scheduleBody.querySelectorAll('tr')];
  scheduleData = rows
    .map((row) => {
      const cells = row.querySelectorAll('td');
      if (cells.length < 5) {
        return null;
      }

      const rawDate = row.dataset.date || row.dataset.iso || row.getAttribute('data-date') || cells[0]?.querySelector('time')?.getAttribute('datetime') || cells[0]?.textContent;
      const date = toISODate(rawDate ?? '');
      const time = (row.dataset.time || cells[1]?.textContent || '').trim();
      const branchLabel = (row.dataset.branchLabel || cells[2]?.textContent || '').trim();
      const formatLabel = (row.dataset.formatLabel || cells[3]?.textContent || '').trim();
      const branch = normalizeBranch(row.dataset.branch || branchLabel);
      const format = normalizeFormat(row.dataset.format || formatLabel);
      const title = (row.dataset.title || cells[4]?.textContent || '').trim();

      if (!date || !time || !title) {
        return null;
      }

      return { date, time, branch, format, title, branchLabel, formatLabel };
    })
    .filter(Boolean);

  if (scheduleData.length === 0) {
    scheduleData = [
      {
        date: '2024-06-03',
        time: '19:00',
        branch: 'центр',
        format: 'онлайн',
        title: 'Теория: Стартовый вебинар',
        branchLabel: 'Центр',
        formatLabel: 'Онлайн теория',
      },
      {
        date: '2024-06-05',
        time: '18:30',
        branch: 'центр',
        format: 'практика',
        title: 'Практика: Городское вождение',
        branchLabel: 'Центр',
        formatLabel: 'Практика',
      },
      {
        date: '2024-06-06',
        time: '19:00',
        branch: 'север',
        format: 'класс',
        title: 'Теория: Знаки и разметка',
        branchLabel: 'Север',
        formatLabel: 'Теория в классе',
      },
      {
        date: '2024-06-08',
        time: '10:00',
        branch: 'юг',
        format: 'практика',
        title: 'Практика: Маневрирование на площадке',
        branchLabel: 'Юг',
        formatLabel: 'Практика',
      },
      {
        date: '2024-06-10',
        time: '19:00',
        branch: 'центр',
        format: 'класс',
        title: 'Теория: Экзамен ПДД (разбор)',
        branchLabel: 'Центр',
        formatLabel: 'Теория в классе',
      },
      {
        date: '2024-06-12',
        time: '18:00',
        branch: 'север',
        format: 'практика',
        title: 'Практика: Маршрут №3',
        branchLabel: 'Север',
        formatLabel: 'Практика',
      },
    ];
  }
};

const renderSchedule = () => {
  ensureScheduleData();

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
      (item) => `<tr data-date="${item.date}" data-time="${item.time}" data-branch="${item.branch}" data-format="${item.format}" data-title="${item.title}">
          <td data-label="Дата">${new Date(item.date).toLocaleDateString('ru-RU')}</td>
          <td data-label="Время">${item.time}</td>
          <td data-label="Филиал">${item.branchLabel || item.branch}</td>
          <td data-label="Формат">${item.formatLabel || item.format}</td>
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
