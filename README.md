# PayStride

PayStride is a payroll and workforce management project built for small and mid-sized teams that need a simple way to manage workers, track daily hours, generate payroll, and support a worker self-service portal.

The repository contains:

- `frontend/`: React + Vite client for admin and worker-facing flows
- `backend/`: Spring Boot + MySQL API with JWT-based authentication

## What The Project Does

PayStride supports two main user experiences:

- Admin portal
  - Company registration and login
  - Worker management
  - Daily hour logging
  - Payroll generation
  - Dashboard analytics
  - HR review for advance and leave requests
- Worker portal
  - Worker login
  - Personal attendance view
  - Payslip download
  - Advance request submission
  - Leave request submission

## Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Axios
- jsPDF / jspdf-autotable
- CSS Modules

### Backend

- Java 17
- Spring Boot 3
- Spring Web
- Spring Security
- Spring Data JPA
- MySQL
- JWT
- Lombok

## Repository Structure

```text
PayStride/
├── backend/
│   ├── src/main/java/com/paystride/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── exception/
│   │   ├── repository/
│   │   ├── security/
│   │   ├── service/
│   │   └── util/
│   └── src/main/resources/
└── frontend/
    └── src/
        ├── components/
        ├── context/
        ├── pages/
        ├── services/
        └── utils/
```

## Key Modules

### Backend API Areas

- `AuthController`: admin registration and login
- `WorkerController`: worker CRUD and password reset
- `DailyHoursController`: attendance and hour logging
- `PayrollController`: payroll generation and summaries
- `DashboardController`: admin dashboard analytics
- `HRManagementController`: review of advance and leave requests
- `WorkerPortalController`: worker login, self-service hours, payroll, leave, and advance requests

### Frontend Screens

- Landing page and auth flows
- Admin dashboard
- Workers management
- Hours logging
- Payroll management
- HR requests review
- Worker dashboard

## Local Setup

### 1. Backend

From the `backend/` folder:

```bash
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

### 2. Frontend

From the `frontend/` folder:

```bash
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

If needed, set the frontend API base URL with:

```bash
VITE_API_URL=http://localhost:8080/api
```

## Default Development Configuration

Current local backend configuration is defined in `backend/src/main/resources/application.properties` and expects:

- MySQL database: `paystride_db`
- username: `root`
- password: `root123`
- backend port: `8080`

This is fine for local academic/demo use, but for GitHub or deployment it is better to move secrets and environment-specific values out of source control.

## Build Commands

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

### Backend

```bash
mvn spring-boot:run
mvn test
mvn package
```

## Current Status

The project already includes working end-to-end flows for:

- admin authentication
- worker management
- hour tracking
- payroll generation
- worker self-service portal
- request management for advances and leaves

The git history also shows that the project was built incrementally feature by feature, which is a good sign for a portfolio or academic repository.

## Notes For GitHub Presentation

To keep the project looking genuine and professional:

- describe the project as it is, not as a production SaaS
- keep commit messages tied to real changes
- avoid claiming features that are only partially implemented
- mention that it is a student/final project if that matches your use case
- prefer a few clean docs and honest screenshots over exaggerated claims

## Recommended Next Cleanup

- add environment variable support for DB credentials and JWT secret
- expand `.gitignore` for generated folders and editor files
- remove committed build artifacts if they are still tracked in older branches
- add tests for payroll and worker portal flows
- add deployment instructions if you plan to host it

See [CONTRIBUTING.md](./CONTRIBUTING.md) for commit guidance and [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for a short system overview.
