import dayjs from 'dayjs';

/**
 * Utility functions around date handling using dayjs. Provides
 * parsing and formatting with a sensible default locale.
 */
export function parseDate(str) {
  // Try multiple formats commonly seen in the documents
  const formats = ['YYYY/MM/DD', 'DD-MMM-YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];
  for (const fmt of formats) {
    const d = dayjs(str, fmt, true);
    if (d.isValid()) return d;
  }
  return dayjs(str);
}

export function formatDate(date, format = 'YYYY-MM-DD') {
  return dayjs(date).format(format);
}