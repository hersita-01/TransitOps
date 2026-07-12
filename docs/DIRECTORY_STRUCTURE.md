# Approved Directory Structure

## Approved Architecture Layout

The approved top-level project structure for **TransitOps** is organized as follows:

```text
TransitOps/
├── client/
├── server/
├── shared/
├── docs/
└── README.md
```

> **IMPORTANT**: Application folders (`client/`, `server/`, `shared/`) are **strictly forbidden** from being created during Sprint 0 repository initialization. This document serves as the architectural contract for developers initializing application modules in Sprint 1.

---

## Directory Descriptions & Responsibilities

### `client/`
- **Owner**: Frontend Engineer
- **Purpose**: Houses the React single-page frontend application.
- **Scope**: Components, client-side routing, UI state management, styles, and API communication services.

### `server/`
- **Owner**: Backend Engineer & Database Engineer
- **Purpose**: Houses the Node.js/Express REST API server and Prisma database ORM layer.
- **Scope**:
  - `server/src/`: Application controllers, routes, middleware, and business logic services (Owned by Backend Engineer).
  - `server/prisma/`: Database schema definitions, migrations, and seed scripts (Owned by Database Engineer).

### `shared/`
- **Owner**: Database Engineer
- **Purpose**: Houses shared domain contracts across client and server.
- **Scope**: TypeScript interface definitions, API response payload types, and validation schemas.

### `docs/`
- **Owner**: Integration Engineer
- **Purpose**: Repository governance, engineering standards, architecture documents, and development guides.

### `README.md`
- **Owner**: Integration Engineer
- **Purpose**: High-level repository entry point and project overview.
