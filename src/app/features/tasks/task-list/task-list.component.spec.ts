import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Task } from '../../../core/models/task.model';
import { TaskListComponent } from './task-list.component';

describe('TaskListComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should filter rendered tasks by title search', async () => {
    const tasks: Task[] = [
      {
        id: '1',
        title: 'Prepare assessment',
        status: 'todo',
        priority: 'high',
        dueDate: '2026-11-01',
      },
      {
        id: '2',
        title: 'Review results',
        status: 'in-progress',
        priority: 'medium',
        dueDate: '2026-11-02',
      },
    ];
    const fixture = TestBed.createComponent(TaskListComponent);
    fixture.detectChanges();
    httpMock.expectOne('/api/tasks').flush(tasks);
    await fixture.whenStable();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const search = element.querySelector<HTMLInputElement>('#search');
    expect(search).not.toBeNull();
    search!.value = 'prepare';
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const rows = element.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Prepare assessment');
    expect(rows[0].textContent).not.toContain('Review results');
  });
});
