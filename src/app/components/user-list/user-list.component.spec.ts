import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { UserListComponent } from './user-list.component';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

describe('UserListComponent', () => {
  let fixture: ComponentFixture<UserListComponent>;
  let component: UserListComponent;
  let mockUserService: any;
  const mockUsers: User[] = [
    { id: 1, username: 'alice', email: 'alice@example.com', createdAt: '' },
    { id: 2, username: 'bob', email: 'bob@example.com', createdAt: '' }
  ];

  beforeEach(async () => {
    mockUserService = {
      users$: new BehaviorSubject<User[]>(mockUsers),
      deleteUser: jasmine.createSpy('deleteUser'),
      updateUser: jasmine.createSpy('updateUser')
    };

    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [{ provide: UserService, useValue: mockUserService }]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent as any);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call userService.deleteUser when deleteUser is invoked', () => {
    component.deleteUser(1);
    expect(mockUserService.deleteUser).toHaveBeenCalledWith(1);
  });

  it('should call userService.updateUser with id and request when updateUser is invoked', () => {
    const evt = { id: 2, username: 'bob-updated', email: 'bob@updated.com' };
    component.updateUser(evt);
    expect(mockUserService.updateUser).toHaveBeenCalledWith(2, {
      username: evt.username,
      email: evt.email
    });
  });
});
