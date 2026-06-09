import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  tasks$ = this.taskService.tasks$;

  constructor(private taskService: TaskService) {}

  toggleCompletion(taskId: number): void {
    this.taskService.toggleTaskCompletion(taskId);
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId);
  }
}
