import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserItemComponent } from './user-item.component';
import { User } from '../../models/user.model';

describe('UserItemComponent', () => {
  let fixture: ComponentFixture<UserItemComponent>;
  let component: UserItemComponent;
  const mockUser: User = { id: 1, username: 'alice', email: 'alice@example.com', createdAt: '' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserItemComponent as any);
    component = fixture.componentInstance;
    component.user = { ...mockUser };
    fixture.detectChanges();
  });

  it('should enter edit mode and populate edited fields on toggleEdit', () => {
    component.toggleEdit();
    expect(component.isEditing).toBeTrue();
    expect(component.editedUsername).toBe(mockUser.username);
    expect(component.editedEmail).toBe(mockUser.email);
  });

  it('should emit updateUser when onSave with valid edits', (done) => {
    component.toggleEdit();
    component.editedUsername = 'alice-updated';
    component.editedEmail = 'alice@updated.com';

    component.updateUser.subscribe((payload) => {
      expect(payload.id).toBe(mockUser.id);
      expect(payload.username).toBe('alice-updated');
      expect(payload.email).toBe('alice@updated.com');
      done();
    });

    component.onSave();
    expect(component.isEditing).toBeFalse();
  });

  it('should not emit updateUser when onSave with empty fields', () => {
    component.toggleEdit();
    component.editedUsername = '   ';
    component.editedEmail = '';
    let emitted = false;
    component.updateUser.subscribe(() => (emitted = true));
    component.onSave();
    expect(emitted).toBeFalse();
  });

  it('should emit deleteUser on onDelete', (done) => {
    component.deleteUser.subscribe((id) => {
      expect(id).toBe(mockUser.id);
      done();
    });
    component.onDelete();
  });
});
