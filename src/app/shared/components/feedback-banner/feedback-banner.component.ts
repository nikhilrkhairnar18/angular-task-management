import { Component, inject, OnInit } from '@angular/core';
import { TaskStateService } from '../../../core/services/task-state.service';

@Component({
  selector: 'app-feedback-banner',
  templateUrl: './feedback-banner.component.html',
  styleUrl: './feedback-banner.component.css',
})
export class FeedbackBannerComponent implements OnInit {
  protected readonly state = inject(TaskStateService);

  ngOnInit(): void {
    this.state.loadTasks();
  }

  dismissError(): void {
    this.state.clearError();
  }

  retryLoad(): void {
    this.state.loadTasks();
  }

  dismissSuccess(): void {
    this.state.clearSuccessMessage();
  }
}
