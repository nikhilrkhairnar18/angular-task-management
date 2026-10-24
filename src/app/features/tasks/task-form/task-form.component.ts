import { Component, effect, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Task, TaskPriority, TaskStatus } from '../../../core/models/task.model';
import { createTaskFormGroup, TaskFormGroup } from './task-form.builder';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent {
  readonly task = input<Task | null>(null);
  readonly submitLabel = input('Save task');
  readonly submitted = output<Omit<Task, 'id'>>();

  protected readonly form: TaskFormGroup = createTaskFormGroup();

  protected readonly statusOptions: TaskStatus[] = ['todo', 'in-progress', 'completed'];
  protected readonly priorityOptions: TaskPriority[] = ['low', 'medium', 'high'];

  constructor() {
    effect(() => {
      const existing = this.task();
      if (existing) {
        this.form.reset({
          title: existing.title,
          description: existing.description ?? '',
          status: existing.status,
          priority: existing.priority,
          dueDate: existing.dueDate,
        });
      } else {
        this.form.reset({
          title: '',
          description: '',
          status: 'todo',
          priority: 'medium',
          dueDate: '',
        });
      }
    });
  }

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const value = this.form.getRawValue();
    this.submitted.emit({
      title: value.title.trim(),
      description: value.description.trim() || undefined,
      status: value.status,
      priority: value.priority,
      dueDate: value.dueDate,
    });
  }

  protected showError(controlName: keyof TaskFormGroup['controls']): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
}
