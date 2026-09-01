# 🚨 Early University Project — 2022-2023

**Note:** This project was completed in 2022-2023 at the beginning of my Bachelor's studies in Computer Science. It represents an early stage of my development as a software engineer and was created before I had formal training in many software-engineering principles and practices.

The repository is kept public as part of my development history and reflects the technologies and concepts I was working with at that stage of my studies.

# Taskeeper - Information systems development university project (2022-2023)

Taskeeper is a full-stack task management web application that lets users organize personal to-do items, group work into projects, and collaborate with teammates. It is built with an **Angular 15** frontend and a **Node.js / Express** backend written in TypeScript, backed by a **PostgreSQL** database.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Backend (ts-services)](#1-backend-ts-services)
  - [2. Frontend (Angular)](#2-frontend-angular)
- [Environment Configuration](#environment-configuration)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Security Notes](#security-notes)
- [Known Limitations & TODOs](#known-limitations--todos)

---

## Features

- **User accounts** — register, log in, update profile, and delete account
- **To-do list** — each user has a personal full to-do list
- **Tasks** — create tasks with a name, description, deadline, labels, and optional project/team assignment
- **Projects** — group tasks under named projects, owned by a user and optionally linked to a team
- **Teams** — create or join teams, manage members, and share projects across a group
- **JWT authentication** — stateless token-based auth on all protected endpoints
- **HTTPS** — backend runs over TLS using PEM certificate/key files
- **PWA-ready** — Angular Service Worker configured via `ngsw-config.json`

---

## Architecture

```
┌─────────────────────────────┐        HTTPS        ┌──────────────────────────────────┐
│   Angular 15 SPA (frontend) │ ──────────────────▶  │  Express API Server (ts-services) │
│   Port: 4200 (ng serve)     │  x-access-token JWT  │  Port: 52445                      │
└─────────────────────────────┘                      └──────────────┬───────────────────┘
                                                                     │ pg (node-postgres)
                                                                     ▼
                                                          ┌──────────────────┐
                                                          │   PostgreSQL DB   │
                                                          │   Port: 52432    │
                                                          └──────────────────┘
```

The frontend communicates with the backend exclusively via a REST API under the `/api/v1/` path prefix. All routes except `register` and `login` require a JWT passed in the `x-access-token` request header.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Angular 15, TypeScript, RxJS, SCSS  |
| Backend    | Node.js, Express 4, TypeScript      |
| Database   | PostgreSQL (via `node-postgres`)     |
| Auth       | JWT (`jsonwebtoken`), bcrypt        |
| Transport  | HTTPS (TLS via PEM files)           |
| Testing    | Karma + Jasmine (Angular)           |

---

## Project Structure

```
Taskeeper-master/
├── angular-project/
│   └── taskeeper/              # Angular 15 SPA
│       └── src/
│           └── app/
│               ├── home/       # Home dashboard component
│               ├── task/       # Task list & task model
│               ├── project/    # Project component & service
│               ├── teams/      # Teams component & service
│               └── user/
│                   ├── user.Login/          # Login component
│                   └── user.createAccount/  # Registration component
└── ts-services/                # Express backend
    ├── app.ts                  # Entry point, server setup
    ├── routes/
    │   └── user_service.ts     # All REST route handlers
    ├── control/
    │   ├── data_access_controller.ts   # DB pool & schema creation
    │   └── user_data_controller.ts     # User CRUD queries
    ├── model/                  # TypeScript classes & interfaces
    │   ├── user.ts / iuser.ts
    │   ├── task.ts / itask.ts
    │   ├── project.ts / iproject.ts
    │   └── team.ts / iteam.ts
    └── environments/
        ├── environment.ts       # Dev config
        └── environment.prod.ts  # Production config
```

---

## Prerequisites

- **Node.js** ≥ 16
- **npm** ≥ 8
- **Angular CLI** ≥ 15 (`npm install -g @angular/cli`)
- **PostgreSQL** running and accessible
- **TypeScript** (`npm install -g typescript`)

---

## Getting Started

### 1. Backend (ts-services)

```bash
cd ts-services

# Install dependencies
npm install

# Configure environment (see Environment Configuration below)
# Edit environments/environment.prod.ts with your DB credentials, ports, and JWT secret

# Compile TypeScript and start the server
npm start
# Equivalent to: tsc && node app.js
```

The server will start listening on the port defined in `environment.prod.ts` (default: `52445`) over HTTPS. Make sure `key.pem` and `cert.pem` are present in `ts-services/` (self-signed certs are included for development).

### 2. Frontend (Angular)

```bash
cd angular-project/taskeeper

# Install dependencies
npm install

# Start the development server
npm start
# Equivalent to: ng serve
```

The Angular app will be available at `http://localhost:4200`. It will automatically redirect to the `/login` route.

---

## Environment Configuration

Edit `ts-services/environments/environment.prod.ts` before deploying:

```typescript
export const environment = {
    production: true,
    service_port: 52445,      // Port the Express server listens on
    db_user: "postgres",      // PostgreSQL username
    db_host: "YOUR_DB_HOST",  // PostgreSQL host
    db_name: "postgres",      // Database name
    db_pass: "YOUR_DB_PASS",  // Database password
    db_port: 5432,            // PostgreSQL port
    jwt_key: "YOUR_SECRET",   // Secret key used to sign JWTs
    tls_key_file: "key.pem",  // Path to TLS private key
    tls_cert_file: "cert.pem" // Path to TLS certificate
};
```

> ⚠️ **Never commit real credentials to version control.** Move secrets to environment variables or a `.env` file (the `dotenv` package is already a dependency).

---

## API Reference

All routes are prefixed with `/api/v1/`. Protected routes require the header `x-access-token: <JWT>`.

| Method | Path                        | Auth | Description                        |
|--------|-----------------------------|------|------------------------------------|
| POST   | `/api/v1/register`          | No   | Create a new user account          |
| POST   | `/api/v1/login`             | No   | Authenticate and receive a JWT     |
| GET    | `/api/v1/users`             | Yes  | List all users                     |
| GET    | `/api/v1/users/:id`         | Yes  | Get a user by ID                   |
| GET    | `/api/v1/users/:id/userName`| Yes  | Get a user's username by ID        |
| PUT    | `/api/v1/users/:id`         | Yes  | Update a user's profile            |
| DELETE | `/api/v1/users/:id`         | Yes  | Delete a user                      |

**Register request body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "userName": "janedoe",
  "emailAdress": "jane@example.com",
  "password": "securepassword"
}
```

**Login request body:**
```json
{
  "userName": "janedoe",
  "password": "securepassword"
}
```
Returns a JWT string on success (`200 OK`).

---

## Database Schema

Tables are auto-created on server startup via `DataAccessController.createDataSchema()`.

```sql
CREATE TABLE IF NOT EXISTS users (
    firstName text,
    lastName text,
    userName text UNIQUE,
    userID serial PRIMARY KEY,
    emailAdress text UNIQUE,
    password_hash text,
    usedDevices text[],
    loggedIn boolean,
    fullToDolist text[],   -- array of task IDs
    projectsList text[],
    teams int[]
);

CREATE TABLE IF NOT EXISTS teams (
    name text,
    description text,
    teamID int UNIQUE PRIMARY KEY,
    labels text[],
    ownerUser int,
    teamMembers int[],
    projects text[]
);

CREATE TABLE IF NOT EXISTS tasks (
    name text,
    description text,
    taskID text UNIQUE PRIMARY KEY,
    Deadline DATE,
    isDone boolean,
    labels text[],
    ownerUser int,
    assignedMembers int[],
    project text
);

CREATE TABLE IF NOT EXISTS projects (
    name text,
    description text,
    projectID text UNIQUE PRIMARY KEY,
    labels text[],
    tasksList text[],
    ownerUser int,
    team int
);
```

---

## Security Notes

- **Passwords** are hashed with `bcrypt` (10 salt rounds) before storage.
- **JWT tokens** expire after 3600 seconds (1 hour).
- The backend currently sets CORS `origin: '*'` — restrict this in production.
- TLS certificates (`key.pem`, `cert.pem`) included in the repo are **self-signed development certificates** and must be replaced before any public deployment.
- Secrets in `environment.prod.ts` should be migrated to environment variables using `dotenv`.

---

## Known Limitations & TODOs

- Task, project, and team CRUD endpoints are modelled and have services on the frontend but are not yet fully wired to the backend API (only user routes are complete).
- The sidebar currently displays all globally stored teams/projects rather than filtering by the logged-in user.
- User ID generation relies on PostgreSQL `serial`; a dedicated ID service may replace this later.
- `usedDevices` device tracking is not yet implemented on the Angular side.
- The frontend `ngOnInit` in `AppComponent` uses hardcoded test data instead of live API calls.
- HTTP (non-TLS) server option is present but commented out in `app.ts`.

---

## License

MIT — see `ts-services/package.json`.
