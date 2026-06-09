# Augmented Task Manager Frontend

This Angular application implements a standalone-component task manager with reactive state management.

## Architecture
- **Components**: UI rendering and user interactions.
- **Services**: State management with `BehaviorSubject` and backend integration via `HttpClient`.
- **Models**: Strongly typed task entity definitions.

## Features
- Create new tasks.
- Mark tasks as completed / uncompleted.
- Delete tasks.
- Reactive state updates using RxJS and `BehaviorSubject`.
- Service-based architecture with API integration.

## Backend Integration
This frontend maps task operations to the existing backend API exposed by `openapi.yaml` at:
- `GET http://localhost:8080/api/users`
- `POST http://localhost:8080/api/users`

## Users section
- A dedicated Users section consumes the backend `Users` API.
- `UserService` uses `BehaviorSubject<User[]>` and exposes `users$` for reactive rendering.
- `UserFormComponent` creates users via `POST /api/users`.
- `UserListComponent` renders backend users and supports deletion via `DELETE /api/users/{id}`.
- `UserService` supports user updates via `PUT /api/users/{id}`.
- `DELETE http://localhost:8080/api/users/{id}`
- Edit and save user profile changes directly from the user list.

Task creation and deletion are persisted through the backend. Task completion state is managed in the frontend and persisted locally in `localStorage` because the backend API does not include a dedicated completion field.

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app:
   ```bash
   npm start
   ```
3. Open the browser at `http://localhost:4200`

## Notes
- The application is built with standalone Angular components.
- `TaskService` loads backend data and exposes `tasks$` as a reactive observable.
- The current implementation treats backend `User` entities as task payloads for integration.
