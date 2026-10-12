import {
  format,
  formatDistanceToNow,
  isAfter,
  isBefore,
  isToday,
  isTomorrow,
  isYesterday,
  startOfDay,
  endOfDay,
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isSameMonth,
  parseISO,
  subMonths,
  addMonths,
} from 'date-fns';

export {
  format,
  formatDistanceToNow,
  isAfter,
  isBefore,
  isToday,
  isTomorrow,
  isYesterday,
  startOfDay,
  endOfDay,
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isSameMonth,
  parseISO,
  subMonths,
  addMonths,
};

export function formatDate(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
}

export function formatShortDate(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d');
}

export function formatRelative(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function isOverdue(date) {
  if (!date) return false;
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isBefore(endOfDay(d), new Date());
}

export function isDueSoon(date, days = 3) {
  if (!date) return false;
  const d = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  return isAfter(d, now) && isBefore(d, addDays(now, days));
}

export function getDueDateLabel(date) {
  if (!date) return null;
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isOverdue(d)) return 'Overdue';
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  if (isDueSoon(d)) return 'Due soon';
  return formatShortDate(d);
}

export function toISODate(date) {
  if (!date) return null;
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
}
