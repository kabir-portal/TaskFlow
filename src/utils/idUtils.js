let counter = Date.now();

export function generateId(prefix = '') {
  counter += 1;
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}_${counter}_${random}` : `${counter}_${random}`;
}

export function generateTaskId(projectPrefix = 'TASK') {
  const num = Math.floor(Math.random() * 900) + 100;
  return `${projectPrefix}-${num}`;
}
