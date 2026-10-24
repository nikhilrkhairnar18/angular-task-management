import { Routes } from '@angular/router';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { TaskFormPageComponent } from './features/tasks/task-form-page/task-form-page.component';
import { TaskListComponent } from './features/tasks/task-list/task-list.component';
import { AppLayoutComponent } from './layout/app-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },
      { path: 'tasks', component: TaskListComponent },
      { path: 'tasks/new', component: TaskFormPageComponent },
      { path: 'tasks/:id/edit', component: TaskFormPageComponent },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
