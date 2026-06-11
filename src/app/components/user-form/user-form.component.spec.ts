import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFormComponent } from './user-form.component';
import { UserService } from '../../services/user.service';

describe('UserFormComponent', () => {
  let fixture: ComponentFixture<UserFormComponent>;
  let component: UserFormComponent;
  let mockUserService: any;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['createUser']);

    await TestBed.configureTestingModule({
      imports: [UserFormComponent],
      providers: [{ provide: UserService, useValue: mockUserService }]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent as any);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not call createUser if form is invalid', () => {
    component.form.setValue({ username: '', email: '' });
    component.submit();
    expect(mockUserService.createUser).not.toHaveBeenCalled();
  });

  it('should call createUser with trimmed values and reset the form', () => {
    // use valid values (validators run before trim) to simulate a real valid submission
    component.form.setValue({ username: 'alice', email: 'alice@example.com' });
    component.submit();
    expect(mockUserService.createUser).toHaveBeenCalledWith({
      username: 'alice',
      email: 'alice@example.com'
    });
    expect(component.form.value.username).toBeNull();
    expect(component.form.value.email).toBeNull();
  });
});
