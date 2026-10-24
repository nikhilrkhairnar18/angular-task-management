export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

export type CreateTaskDto = Omit<Task, 'id'>;
export type UpdateTaskDto = Task;

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
}

export interface TaskFilters {
  search: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
}
