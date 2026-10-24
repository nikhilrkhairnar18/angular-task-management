import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Task } from '../../../core/models/task.model';
import { TaskStateService } from '../../../core/services/task-state.service';
import { FeedbackBannerComponent } from '../../../shared/components/feedback-banner/feedback-banner.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-form-page',
  imports: [TaskFormComponent, RouterLink, FeedbackBannerComponent],
  templateUrl: './task-form-page.component.html',
  styleUrl: './task-form-page.component.css',
})
export class TaskFormPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly state = inject(TaskStateService);

  private readonly routeId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id'))),
    { initialValue: null as string | null },
  );

  protected readonly isEditMode = computed(() => this.routeId() !== null);

  protected readonly task = computed(() => {
    const id = this.routeId();
    return id ? this.state.getTaskById(id) : undefined;
  });

  protected readonly pageTitle = computed(() =>
    this.isEditMode() ? 'Edit task' : 'Create task',
  );

  protected onSubmit(value: Omit<Task, 'id'>): void {
    if (this.isEditMode()) {
      const id = this.routeId();
      if (!id) {
        return;
      }
      this.state.updateTask({ id, ...value });
    } else {
      this.state.createTask(value);
    }
    void this.router.navigate(['/tasks']);
  }
}
