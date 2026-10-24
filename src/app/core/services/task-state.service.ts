import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { EMPTY, catchError, finalize, tap } from 'rxjs';
import {
  CreateTaskDto,
  Task,
  TaskFilters,
  TaskStats,
  UpdateTaskDto,
} from '../models/task.model';
import { computeTaskStats, matchesFilters } from '../utils/task.utils';
import { TaskApiService } from './task-api.service';

@Injectable({ providedIn: 'root' })
export class TaskStateService {
  private readonly api = inject(TaskApiService);

  private readonly tasksSignal = signal<Task[]>([]);
  readonly loading = signal(false);
  readonly tasksLoaded = signal(false);
  readonly error = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  private loadInFlight = false;

  readonly filters = signal<TaskFilters>({
    search: '',
    status: 'all',
    priority: 'all',
  });

  readonly tasks = this.tasksSignal.asReadonly();

  readonly stats = computed<TaskStats>(() => computeTaskStats(this.tasksSignal()));

  readonly filteredTasks = computed(() => {
    const { search, status, priority } = this.filters();
    return this.tasksSignal().filter((task) =>
      matchesFilters(task, search, status, priority),
    );
  });

  loadTasks(): void {
    if (this.tasksLoaded() || this.loadInFlight) {
      return;
    }
    this.loadInFlight = true;
    this.loading.set(true);
    this.clearError();
    this.api
      .getAll()
      .pipe(
        tap((tasks) => {
          this.tasksSignal.set([...tasks]);
          this.tasksLoaded.set(true);
        }),
        catchError((err) => {
          this.setErrorFromUnknown(err, 'Failed to load tasks');
          return EMPTY;
        }),
        finalize(() => {
          this.loadInFlight = false;
          this.loading.set(false);
        }),
      )
      .subscribe();
  }

  createTask(dto: CreateTaskDto): void {
    const id = crypto.randomUUID();
    const optimistic: Task = { id, ...dto };
    this.applyOptimisticAdd(optimistic);
    this.loading.set(true);
    this.clearError();

    this.api
      .create({ id, ...dto })
      .pipe(
        tap((saved) => this.replaceTask(id, saved)),
        catchError((err) => {
          this.revertOptimisticRemove(id);
          this.setErrorFromUnknown(err, 'Failed to create task');
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: () => this.setSuccess('Task created successfully.'),
      });
  }

  updateTask(dto: UpdateTaskDto): void {
    const previous = this.tasksSignal().find((t) => t.id === dto.id);
    if (!previous) {
      return;
    }
    this.applyOptimisticUpdate(dto);
    this.loading.set(true);
    this.clearError();

    this.api
      .update(dto)
      .pipe(
        tap((saved) => this.replaceTask(dto.id, saved)),
        catchError((err) => {
          this.applyOptimisticUpdate(previous);
          this.setErrorFromUnknown(err, 'Failed to update task');
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: () => this.setSuccess('Task updated successfully.'),
      });
  }

  deleteTask(id: string): void {
    const previous = this.tasksSignal();
    const removed = previous.find((t) => t.id === id);
    if (!removed) {
      return;
    }
    this.tasksSignal.set(previous.filter((t) => t.id !== id));
    this.loading.set(true);
    this.clearError();

    this.api
      .delete(id)
      .pipe(
        catchError((err) => {
          this.tasksSignal.set(previous);
          this.setErrorFromUnknown(err, 'Failed to delete task');
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: () => this.setSuccess('Task deleted successfully.'),
      });
  }

  getTaskById(id: string): Task | undefined {
    return this.tasksSignal().find((t) => t.id === id);
  }

  setFilters(partial: Partial<TaskFilters>): void {
    this.filters.update((current) => ({ ...current, ...partial }));
  }

  clearSuccessMessage(): void {
    this.successMessage.set(null);
  }

  clearError(): void {
    this.error.set(null);
  }

  private applyOptimisticAdd(task: Task): void {
    this.tasksSignal.update((tasks) => [...tasks, task]);
  }

  private revertOptimisticRemove(id: string): void {
    this.tasksSignal.update((tasks) => tasks.filter((t) => t.id !== id));
  }

  private applyOptimisticUpdate(task: Task): void {
    this.tasksSignal.update((tasks) =>
      tasks.map((t) => (t.id === task.id ? { ...task } : t)),
    );
  }

  private replaceTask(id: string, saved: Task): void {
    this.tasksSignal.update((tasks) =>
      tasks.map((t) => (t.id === id ? { ...saved } : t)),
    );
  }

  private setSuccess(message: string): void {
    this.successMessage.set(message);
  }

  private setErrorFromUnknown(err: unknown, fallback: string): void {
    let message = fallback;
    if (err instanceof HttpErrorResponse) {
      const body = err.error;
      if (typeof body === 'string' && body.length > 0) {
        message = body;
      } else if (
        typeof body === 'object' &&
        body !== null &&
        'message' in body &&
        typeof (body as { message: unknown }).message === 'string'
      ) {
        message = (body as { message: string }).message;
      } else {
        message = err.message || fallback;
      }
    } else if (err instanceof Error) {
      message = err.message;
    }
    this.error.set(message || fallback);
  }
}
