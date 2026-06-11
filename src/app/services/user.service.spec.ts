import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);

    // initial loadUsers() request from constructor
    const initReq = httpMock.expectOne(environment.apiBaseUrl);
    initReq.flush([]);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load users when loadUsers is called', (done) => {
    const mockUsers: User[] = [
      { id: 1, username: 'alice', email: 'alice@example.com', createdAt: '' },
      { id: 2, username: 'bob', email: 'bob@example.com', createdAt: '' }
    ];

    service.loadUsers();
    const req = httpMock.expectOne(environment.apiBaseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);

    service.users$.subscribe((users) => {
      expect(users).toEqual(mockUsers);
      done();
    });
  });

  it('should create a user and prepend to users list', (done) => {
    const newUser: User = { id: 3, username: 'charlie', email: 'charlie@example.com', createdAt: '' };

    service.createUser({ username: newUser.username, email: newUser.email });
    const req = httpMock.expectOne(environment.apiBaseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newUser);

    service.users$.subscribe((users) => {
      expect(users[0]).toEqual(newUser);
      done();
    });
  });

  it('should update a user in the users list', (done) => {
    const existing: User = { id: 4, username: 'dave', email: 'dave@example.com', createdAt: '' };
    (service as any).usersSubject.next([existing]);

    const updated: User = { id: 4, username: 'dave-updated', email: 'dave@updated.com', createdAt: '' };
    service.updateUser(existing.id, { username: updated.username, email: updated.email });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/${existing.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(updated);

    service.users$.subscribe((users) => {
      expect(users.length).toBe(1);
      expect(users[0]).toEqual(updated);
      done();
    });
  });

  it('should delete a user from the users list', (done) => {
    const existing: User = { id: 5, username: 'erin', email: 'erin@example.com', createdAt: '' };
    (service as any).usersSubject.next([existing]);

    service.deleteUser(existing.id);
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/${existing.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});

    service.users$.subscribe((users) => {
      expect(users.find((u) => u.id === existing.id)).toBeUndefined();
      done();
    });
  });
});
