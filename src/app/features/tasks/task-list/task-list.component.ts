import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Task, TaskPriority, TaskStatus } from '../../../core/models/task.model';
import { TaskStateService } from '../../../core/services/task-state.service';
import { isTaskOverdue } from '../../../core/utils/task.utils';
import { DashboardStatsComponent } from '../../dashboard/dashboard-stats.component';
import { FeedbackBannerComponent } from '../../../shared/components/feedback-banner/feedback-banner.component';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-task-list',
  imports: [
    FormsModule,
    RouterLink,
    DatePipe,
    DashboardStatsComponent,
    FeedbackBannerComponent,
    DeleteConfirmDialogComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  protected readonly state = inject(TaskStateService);

  protected readonly statusOptions: Array<TaskStatus | 'all'> = [
    'all',
    'todo',
    'in-progress',
    'completed',
  ];
  protected readonly priorityOptions: Array<TaskPriority | 'all'> = [
    'all',
    'low',
    'medium',
    'high',
  ];

  protected readonly pendingDelete = signal<Task | null>(null);

  protected isOverdue(task: Task): boolean {
    return isTaskOverdue(task);
  }

  protected onSearchChange(value: string): void {
    this.state.setFilters({ search: value });
  }

  protected onStatusChange(value: string): void {
    this.state.setFilters({ status: value as TaskStatus | 'all' });
  }

  protected onPriorityChange(value: string): void {
    this.state.setFilters({ priority: value as TaskPriority | 'all' });
  }

  protected requestDelete(task: Task): void {
    this.pendingDelete.set(task);
  }

  protected cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  protected confirmDelete(): void {
    const task = this.pendingDelete();
    if (task) {
      this.state.deleteTask(task.id);
      this.pendingDelete.set(null);
    }
  }

  protected labelStatus(status: TaskStatus): string {
    switch (status) {
      case 'todo':
        return 'To do';
      case 'in-progress':
        return 'In progress';
      case 'completed':
        return 'Completed';
    }
  }

  protected labelPriority(priority: TaskPriority): string {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  }
}
