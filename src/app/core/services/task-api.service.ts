import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateTaskDto, Task, UpdateTaskDto } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tasks`;

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }

  getById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
  }

  create(task: CreateTaskDto & { id: string }): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task);
  }

  update(task: UpdateTaskDto): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${task.id}`, task);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
