import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { TaskPriority, TaskStatus } from '../../../core/models/task.model';

function validateTitle(control: AbstractControl<string>): ValidationErrors | null {
  const title = control.value.trim();
  if (!title) {
    return { required: true };
  }
  if (title.length < 3) {
    return { minlength: { requiredLength: 3, actualLength: title.length } };
  }
  return null;
}

export interface TaskFormControls {
  title: FormControl<string>;
  description: FormControl<string>;
  status: FormControl<TaskStatus>;
  priority: FormControl<TaskPriority>;
  dueDate: FormControl<string>;
}

export type TaskFormGroup = FormGroup<TaskFormControls>;

export function createTaskFormGroup(): TaskFormGroup {
  return new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [validateTitle],
    }),
    description: new FormControl('', { nonNullable: true }),
    status: new FormControl<TaskStatus>('todo', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    priority: new FormControl<TaskPriority>('medium', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    dueDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
}
