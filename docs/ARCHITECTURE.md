# PayStride Architecture

## Overview

PayStride follows a simple two-tier web architecture:

- React frontend for admin and worker interfaces
- Spring Boot backend for business logic, authentication, and persistence

The backend exposes REST APIs under `/api`, and the frontend consumes them through Axios.

## High-Level Flow

```text
Frontend (React + Vite)
        |
        | HTTP / JSON
        v
Backend (Spring Boot REST API)
        |
        | JPA / Hibernate
        v
MySQL
```

## Frontend Structure

### Core areas

- `src/App.jsx`
  - route registration
  - public, admin, and worker route separation
- `src/context/AuthContext.jsx`
  - session state management
- `src/services/api.js`
  - API client and authorization headers
- `src/pages/`
  - feature pages for both admin and worker flows
- `src/components/`
  - shared UI pieces such as navbar, footer, password fields, and route guards

## Backend Structure

### Layers

- `controller`
  - request/response endpoints
- `service`
  - business logic
- `repository`
  - database access
- `entity`
  - JPA models
- `security`
  - JWT handling, auth filter, tenant context
- `dto`
  - API request and response contracts

## Main Domain Objects

- `Company`
- `User`
- `Worker`
- `DailyHours`
- `PayrollSummary`
- `AdvanceRequest`
- `LeaveRequest`

## Authentication Model

- Admin/company users authenticate through the main auth flow.
- Workers authenticate through the worker portal.
- JWT is used for request authentication.
- Tenant/company context is used to separate company-specific data on the backend.

## Main Functional Flows

### Admin flow

1. Register or log in
2. Add workers
3. Log daily hours
4. Generate payroll
5. Review leave and advance requests

### Worker flow

1. Log in with worker code and password
2. View attendance
3. View payroll history
4. Download payslip
5. Submit leave or advance requests

## Known Technical Gaps

- local secrets are still stored in application properties
- automated test coverage is limited
- generated folders should be ignored more aggressively
- deployment configuration is not yet documented

## Documentation Goal

This architecture note is intentionally short. It is meant to help reviewers, teammates, and GitHub visitors understand the project quickly without overselling it.
