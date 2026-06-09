import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User, UserCreateRequest, UserUpdateRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<User[]>(environment.apiBaseUrl).subscribe((users) => {
      this.usersSubject.next(users);
    });
  }

  createUser(request: UserCreateRequest): void {
    this.http.post<User>(environment.apiBaseUrl, request).subscribe((user) => {
      this.usersSubject.next([user, ...this.usersSubject.value]);
    });
  }

  updateUser(userId: number, request: UserUpdateRequest): void {
    this.http.put<User>(`${environment.apiBaseUrl}/${userId}`, request).subscribe((updated) => {
      this.usersSubject.next(
        this.usersSubject.value.map((user) => (user.id === userId ? updated : user))
      );
    });
  }

  deleteUser(userId: number): void {
    this.http.delete(`${environment.apiBaseUrl}/${userId}`).subscribe(() => {
      this.usersSubject.next(this.usersSubject.value.filter((user) => user.id !== userId));
    });
  }
}
