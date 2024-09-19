# Task Management Application

This is a role-based task management application built using **MERN STACK** . The application allows users to manage tasks with different roles (Admin, Manager, and Employee) and provides features such as authentication, task assignment, and team management.

## Installation

**Clone the repository:**

```bash
git clone https://github.com/gitFerdo/Task-Manager-with-RBAC.git
```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend root directory with the following environment variables:
   ```bash
   MONGO_URL=<your_mongo_db_uri>
   JWT_SECRET=<your_jwt_secret>
   PORT=3000
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm start
   ```

---

## Architecture Overview

### Backend

The backend is built with **Node.js**, **Express**, and **MongoDB**. It uses **JWT** for authentication and **_Role-Based Access Control (RBAC)_** to manage user permissions. The backend provides APIs for tasks, users, and teams.

- **Roles**: Admin, Manager, and Employee.
- **Database**: MongoDB with Mongoose ORM.
- **Security**: JWT for authentication and middleware for role verification.

### Frontend

The frontend is built using **React**, styled with **Bootstrap** and **Material-UI (MUI)**. It interacts with the backend via **Axios** for handling API requests and uses **Context API** for state management (e.g., handling authentication tokens).

- **State Management**: Context API for authentication.
- **UI Frameworks**: Bootstrap and Material-UI.

---

## API Documentation (Postman)

Below is a summary of the API endpoints:

### Authentication

#### Login

- **Method**: POST
- **Endpoint**: `http://localhost:3000/auth/login`
- **Request Body**:
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
- **Authentication**: None required

#### Register

- **Method**: POST
- **Endpoint**: `http://localhost:3000/auth/register`
- **Request Body**:
  ```json
  {
    "username": "user",
    "password": "user123",
    "role": "employee"
  }
  ```
- **Authentication**: None required

---

### Tasks

#### Create Task

- **Method**: POST
- **Endpoint**: `http://localhost:3000/task/`
- **Request Body**:
  ```json
  {
    "title": "New Task",
    "description": "This is a test task",
    "assignedTo": "<employee_id>"
  }
  ```
- **Authentication**: Requires `Bearer <JWT Token>`
- **Roles**: Admin, Manager

#### Get All Tasks

- **Method**: GET
- **Endpoint**: `http://localhost:3000/task/all`
- **Response**:
  ```json
  [
    {
      "_id": "6123...",
      "title": "New Task",
      "description": "Task description",
      "assignedTo": "<employee_id>",
      "status": "Pending"
    }
  ]
  ```
- **Authentication**: Requires `Bearer <JWT Token>`
- **Roles**: Admin, Manager, Employee

#### Update Task

- **Method**: PUT
- **Endpoint**: `http://localhost:3000/task/:id`
- **Request Body**:
  ```json
  {
    "title": "Update the task title",
    "description": "New task description."
  }
  ```
- **Authentication**: Requires `Bearer <JWT Token>`
- **Roles**: Admin, Manager

#### Update Task Status

- **Method**: PATCH
- **Endpoint**: `http://localhost:3000/task/:id/status`
- **Request Body**:
  ```json
  {
    "status": "in-progress"
  }
  ```
- **Authentication**: Requires `Bearer <JWT Token>`
- **Roles**: Employee

#### Delete Task

- **Method**: DELETE
- **Endpoint**: `http://localhost:3000/task/:id`
- **Response**:
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```
- **Authentication**: Requires `Bearer <JWT Token>`
- **Roles**: Admin, Manager

---

### Teams

#### Create Team

- **Method**: POST
- **Endpoint**: `http://localhost:3000/team/teams`
- **Request Body**:
  ```json
  {
    "name": "Development Team",
    "members": ["<employee_id_1>", "<employee_id_2>"]
  }
  ```
- **Authentication**: Requires `Bearer <JWT Token>`
- **Roles**: Admin

#### Add or remove members from a Team

- **Method**: PATCH
- **Endpoint**: `http://localhost:3000/team/teams/:id/members`
- **Request Body**:
  ```json
  {
    "addMembers": ["66e8..."],
    "removeMembers": ["66e8..."]
  }
  ```
- **Authentication**: Requires `Bearer <JWT Token>`
- **Roles**: Admin

#### Get all Teams

- **Method**: GET
- **Endpoint**: `http://localhost:3000/team/all`
  <!-- - **Response**:
    ```json
    {
      "_id": "61234...",
      "name": "Development Team",
      "members": ["<employee_id_1>", "<employee_id_2>"],
      "createdBy": "<admin_id>"
    }
    ``` -->
- **Authentication**: Requires `Bearer <JWT Token>`
- **Roles**: Admin

#### Get all members of a specific Team

- **Method**: GET
- **Endpoint**: `http://localhost:3000/team/:id/members`
- **Authentication**: Requires `Bearer <JWT Token>`
- **Roles**: Admin

#### Delete a Team

- **Method**: DELETE
- **Endpoint**: `http://localhost:3000/team/:id`
- **Authentication**: Requires `Bearer <JWT Token>`
- **Roles**: Admin

---

### Users

#### Get all Users

- **Method**: GET
- **Endpoint**: `http://localhost:3000/user/all`
- **Authentication**: Requires `Bearer <JWT Token>`
- **Roles**: Admin

#### Get single Users

- **Method**: GET
- **Endpoint**: `http://localhost:3000/user/:id`
- **Authentication**: Requires `Bearer <JWT Token>`
- **Roles**: Admin

#### Create a new User

- **Method**: POST
- **Endpoint**: `http://localhost:3000/user/`
- **Request Body**:
  ```json
  {
    "username": "newuser 1",
    "password": "password123",
    "role": "employee"
  }
  ```
- **Authentication**: Requires `Bearer <JWT Token>`
- **Roles**: Admin

#### Create a new User

- **Method**: PUT
- **Endpoint**: `http://localhost:3000/user/:id`
- **Request Body**:
  ```json
  {
    "username": "updateduser",
    "password": "newpassword123",
    "role": "manager"
  }
  ```
- **Authentication**: Requires `Bearer <JWT Token>`
- **Roles**: Admin

#### Delete a User

- **Method**: DELETE
- **Endpoint**: `http://localhost:3000/user/delete/:id`
- **Authentication**: Requires `Bearer <JWT Token>`
- **Roles**: Admin

---

## Assumptions Made

- **Initial Roles**: The application assumes three roles—Admin, Manager, and Employee. Admins can manage users and teams, while Managers can manage tasks and assign them to Employees.
- **Authentication**: All protected routes require JWT tokens. Only users with proper roles can perform certain actions.
- **Initial Setup**: The first registered user is assumed to be an Admin for the system to function correctly.
