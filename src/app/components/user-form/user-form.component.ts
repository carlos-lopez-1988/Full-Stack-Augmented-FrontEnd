import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(private fb: FormBuilder, private userService: UserService) {}

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const value = this.form.value;
    const username = (value.username ?? '').toString().trim();
    const email = (value.email ?? '').toString().trim();

    if (!username || !email) {
      return;
    }

    this.userService.createUser({
      username,
      email
    });
    this.form.reset();
  }
}
