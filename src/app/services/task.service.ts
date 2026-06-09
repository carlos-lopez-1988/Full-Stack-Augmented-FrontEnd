import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Task, TaskCreateRequest } from '../models/task.model';

interface UserResponse {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

interface UserInput {
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly completionKey = 'augmented-task-completion';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();
  private completionMap = new Map<number, boolean>();

  constructor(private http: HttpClient) {
    this.loadCompletionState();
    this.loadTasks();
  }

  loadTasks(): void {
    this.http
      .get<UserResponse[]>(environment.apiBaseUrl)
      .subscribe((users) => {
        const tasks = users.map((user) => this.mapUserToTask(user));
        this.tasksSubject.next(tasks);
      });
  }

  createTask(request: TaskCreateRequest): void {
    const payload: UserInput = {
      username: request.title,
      email: `${this.slugify(request.title)}@example.com`
    };

    this.http.post<UserResponse>(environment.apiBaseUrl, payload).subscribe((user) => {
      const task = this.mapUserToTask(user);
      this.tasksSubject.next([task, ...this.tasksSubject.value]);
    });
  }

  toggleTaskCompletion(taskId: number): void {
    const tasks = this.tasksSubject.value.map((task) => {
      if (task.id !== taskId) {
        return task;
      }

      const updatedTask = {
        ...task,
        completed: !task.completed
      };
      this.completionMap.set(taskId, updatedTask.completed);
      return updatedTask;
    });

    this.saveCompletionState();
    this.tasksSubject.next(tasks);
  }

  deleteTask(taskId: number): void {
    this.http.delete(`${environment.apiBaseUrl}/${taskId}`).subscribe(() => {
      this.completionMap.delete(taskId);
      this.saveCompletionState();
      this.tasksSubject.next(this.tasksSubject.value.filter((task) => task.id !== taskId));
    });
  }

  private mapUserToTask(user: UserResponse): Task {
    return {
      id: user.id,
      title: user.username,
      completed: this.completionMap.get(user.id) ?? false,
      createdAt: user.createdAt || new Date().toISOString()
    };
  }

  private loadCompletionState(): void {
    try {
      const stored = localStorage.getItem(this.completionKey);
      if (!stored) {
        return;
      }

      const values = JSON.parse(stored) as Record<string, boolean>;
      Object.entries(values).forEach(([key, completed]) => {
        this.completionMap.set(Number(key), completed);
      });
    } catch {
      this.completionMap.clear();
    }
  }

  private saveCompletionState(): void {
    const raw = Object.fromEntries(
      Array.from(this.completionMap.entries()).map(([id, completed]) => [id.toString(), completed])
    );

    localStorage.setItem(this.completionKey, JSON.stringify(raw));
  }

  private slugify(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}
