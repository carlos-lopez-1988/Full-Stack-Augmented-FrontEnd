import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  form = this.fb.group({
    title: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private taskService: TaskService) {}

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const title = this.form.value.title?.trim();
    if (!title) {
      return;
    }

    this.taskService.createTask({ title });
    this.form.reset();
  }
}
