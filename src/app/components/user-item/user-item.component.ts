import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.css']
})
export class UserItemComponent {
  @Input() user!: User;
  @Output() deleteUser = new EventEmitter<number>();
  @Output() updateUser = new EventEmitter<{ id: number; username: string; email: string }>();

  isEditing = false;
  editedUsername = '';
  editedEmail = '';

  toggleEdit(): void {
    this.isEditing = true;
    this.editedUsername = this.user.username;
    this.editedEmail = this.user.email;
  }

  onSave(): void {
    const username = this.editedUsername.trim();
    const email = this.editedEmail.trim();

    if (!username || !email) {
      return;
    }

    this.updateUser.emit({ id: this.user.id, username, email });
    this.isEditing = false;
  }

  onCancel(): void {
    this.isEditing = false;
    this.editedUsername = this.user.username;
    this.editedEmail = this.user.email;
  }

  onDelete(): void {
    this.deleteUser.emit(this.user.id);
  }
}
