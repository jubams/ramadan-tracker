export const getProgressColor = (percentage) => {
  if (percentage === 0) return 'var(--color-text-muted)';
  if (percentage <= 33) return 'var(--color-danger)';
  if (percentage <= 66) return 'var(--color-warning)';
  return 'var(--color-success)';
};

export const getProgressLabel = (percentage) => {
  if (percentage === 0) return 'Not Started';
  if (percentage <= 33) return 'Getting Started';
  if (percentage <= 66) return 'Good Progress';
  if (percentage < 100) return 'Almost There';
  return 'Complete!';
};

export const getProgressIcon = (percentage) => {
  if (percentage === 0) return '○';
  if (percentage <= 33) return '◐';
  if (percentage <= 66) return '◑';
  if (percentage < 100) return '◒';
  return '●';
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};
