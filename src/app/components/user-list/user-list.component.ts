import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UserItemComponent } from '../user-item/user-item.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UserItemComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  users$ = this.userService.users$;

  constructor(private userService: UserService) {}

  deleteUser(userId: number): void {
    this.userService.deleteUser(userId);
  }

  updateUser(event: { id: number; username: string; email: string }): void {
    this.userService.updateUser(event.id, {
      username: event.username,
      email: event.email
    });
  }
}
