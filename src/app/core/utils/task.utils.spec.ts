import { Task } from '../models/task.model';
import { computeTaskStats, isTaskOverdue, matchesFilters } from './task.utils';

describe('task.utils', () => {
  const today = new Date(2026, 9, 24);

  const tasks: Task[] = [
    {
      id: '1',
      title: 'Done',
      status: 'completed',
      priority: 'low',
      dueDate: '2026-10-01',
    },
    {
      id: '2',
      title: 'Working',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2026-10-30',
    },
    {
      id: '3',
      title: 'Late',
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-10-01',
    },
  ];

  it('should detect overdue tasks excluding completed items', () => {
    expect(isTaskOverdue(tasks[2], today)).toBe(true);
    expect(isTaskOverdue(tasks[0], today)).toBe(false);
  });

  it('should compute dashboard statistics', () => {
    expect(computeTaskStats(tasks, today)).toEqual({
      total: 3,
      completed: 1,
      inProgress: 1,
      overdue: 1,
    });
  });

  it('should filter tasks by search, status, and priority', () => {
    expect(matchesFilters(tasks[1], 'work', 'in-progress', 'high')).toBe(true);
    expect(matchesFilters(tasks[1], 'work', 'todo', 'high')).toBe(false);
  });
});
