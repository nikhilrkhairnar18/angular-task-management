import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Task } from '../models/task.model';
import { TaskStateService } from './task-state.service';

describe('TaskStateService', () => {
  let service: TaskStateService;
  let httpMock: HttpTestingController;

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Alpha task',
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-11-01',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TaskStateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load tasks into state', () => {
    service.loadTasks();
    const req = httpMock.expectOne('/api/tasks');
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);

    expect(service.tasks()).toEqual(mockTasks);
    expect(service.tasksLoaded()).toBe(true);
    expect(service.stats().total).toBe(1);
  });

  it('should set error when load fails', () => {
    service.loadTasks();
    const req = httpMock.expectOne('/api/tasks');
    req.flush('Server unavailable', { status: 500, statusText: 'Server Error' });

    expect(service.error()).toContain('Server unavailable');
    expect(service.tasks()).toEqual([]);
    expect(service.tasksLoaded()).toBe(false);
  });

  it('should only request tasks once after a successful load', () => {
    service.loadTasks();
    httpMock.expectOne('/api/tasks').flush(mockTasks);

    service.loadTasks();

    httpMock.expectNone('/api/tasks');
  });

  it('should delete task and update stats immutably', () => {
    service.loadTasks();
    httpMock.expectOne('/api/tasks').flush(mockTasks);

    service.deleteTask('1');
    expect(service.tasks()).toEqual([]);

    const deleteReq = httpMock.expectOne('/api/tasks/1');
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush(null);

    expect(service.stats().total).toBe(0);
    expect(service.successMessage()).toContain('deleted');
  });
});
