export const PRIORITIES = {
  urgent: { label: 'Urgent', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950', border: 'border-red-200 dark:border-red-800', dot: 'bg-red-500', order: 0 },
  high: { label: 'High', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950', border: 'border-orange-200 dark:border-orange-800', dot: 'bg-orange-500', order: 1 },
  medium: { label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-950', border: 'border-yellow-200 dark:border-yellow-800', dot: 'bg-yellow-500', order: 2 },
  low: { label: 'Low', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950', border: 'border-blue-200 dark:border-blue-800', dot: 'bg-blue-500', order: 3 },
};

export const LABEL_COLORS = [
  { name: 'Bug', color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  { name: 'Feature', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
  { name: 'Enhancement', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  { name: 'Documentation', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  { name: 'Design', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300' },
  { name: 'DevOps', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300' },
  { name: 'Testing', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
  { name: 'Research', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' },
];

export function getCompletedSubtasks(subtasks = []) {
  return subtasks.filter((s) => s.completed).length;
}

export function getSubtaskProgress(subtasks = []) {
  if (subtasks.length === 0) return 0;
  return Math.round((getCompletedSubtasks(subtasks) / subtasks.length) * 100);
}

export function sortTasks(tasks, sortBy = 'created') {
  const sorted = [...tasks];
  switch (sortBy) {
    case 'created':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'updated':
      return sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    case 'dueDate':
      return sorted.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    case 'priority':
      return sorted.sort((a, b) => (PRIORITIES[a.priority]?.order ?? 4) - (PRIORITIES[b.priority]?.order ?? 4));
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
}

export function filterTasks(tasks, filters = {}) {
  return tasks.filter((task) => {
    if (task.archivedAt && !filters.includeArchived) return false;
    if (filters.status && task.columnId !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.assignee && task.assigneeId !== filters.assignee) return false;
    if (filters.label && !(task.labels || []).includes(filters.label)) return false;
    if (filters.overdue) {
      const { isOverdue } = require('./dateUtils');
      // Inline check to avoid circular import issues
      if (!task.dueDate) return false;
      const d = new Date(task.dueDate);
      if (!(d < new Date())) return false;
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        task.title.toLowerCase().includes(q) ||
        (task.description || '').toLowerCase().includes(q) ||
        (task.taskId || '').toLowerCase().includes(q) ||
        (task.labels || []).some((l) => l.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });
}

export function searchTasks(tasks, query) {
  if (!query || !query.trim()) return tasks;
  const q = query.toLowerCase().trim();
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(q) ||
      (task.description || '').toLowerCase().includes(q) ||
      (task.taskId || '').toLowerCase().includes(q) ||
      (task.labels || []).some((l) => l.toLowerCase().includes(q))
  );
}
