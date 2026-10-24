import { Component, inject } from '@angular/core';
import { TaskStateService } from '../../core/services/task-state.service';

@Component({
  selector: 'app-dashboard-stats',
  templateUrl: './dashboard-stats.component.html',
  styleUrl: './dashboard-stats.component.css',
})
export class DashboardStatsComponent {
  protected readonly state = inject(TaskStateService);
  protected readonly stats = this.state.stats;
}
