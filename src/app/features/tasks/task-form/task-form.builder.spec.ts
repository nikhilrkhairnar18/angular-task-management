import { createTaskFormGroup } from './task-form.builder';

describe('Task form validation', () => {
  it('should require title with minimum length of 3', () => {
    const form = createTaskFormGroup();

    form.controls.title.setValue('');
    expect(form.controls.title.valid).toBe(false);

    form.controls.title.setValue('ab');
    expect(form.controls.title.hasError('minlength')).toBe(true);

    form.controls.title.setValue('   ');
    expect(form.controls.title.hasError('required')).toBe(true);

    form.controls.title.setValue(' ab ');
    expect(form.controls.title.hasError('minlength')).toBe(true);

    form.controls.title.setValue(' abc ');
    expect(form.controls.title.valid).toBe(true);

    form.controls.title.setValue('abc');
    expect(form.controls.title.valid).toBe(true);
  });

  it('should require status, priority, and due date', () => {
    const form = createTaskFormGroup();
    form.controls.title.setValue('Valid title');
    form.controls.status.setValue('todo');
    form.controls.priority.setValue('low');
    form.controls.dueDate.setValue('2026-12-01');

    expect(form.valid).toBe(true);

    form.controls.dueDate.setValue('');
    expect(form.controls.dueDate.valid).toBe(false);
  });
});
