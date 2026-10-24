import { Task, TaskStats } from '../models/task.model';

/** Compare due dates (YYYY-MM-DD) to today in local time. */
export function isTaskOverdue(task: Task, today: Date = new Date()): boolean {
  if (task.status === 'completed') {
    return false;
  }
  const due = parseDateOnly(task.dueDate);
  const startOfToday = startOfDay(today);
  return due.getTime() < startOfToday.getTime();
}

export function computeTaskStats(tasks: readonly Task[], today: Date = new Date()): TaskStats {
  let completed = 0;
  let inProgress = 0;
  let overdue = 0;

  for (const task of tasks) {
    if (task.status === 'completed') {
      completed++;
    }
    if (task.status === 'in-progress') {
      inProgress++;
    }
    if (isTaskOverdue(task, today)) {
      overdue++;
    }
  }

  return {
    total: tasks.length,
    completed,
    inProgress,
    overdue,
  };
}

export function matchesFilters(
  task: Task,
  search: string,
  status: Task['status'] | 'all',
  priority: Task['priority'] | 'all',
): boolean {
  const normalizedSearch = search.trim().toLowerCase();
  if (normalizedSearch && !task.title.toLowerCase().includes(normalizedSearch)) {
    return false;
  }
  if (status !== 'all' && task.status !== status) {
    return false;
  }
  if (priority !== 'all' && task.priority !== priority) {
    return false;
  }
  return true;
}

function parseDateOnly(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
