# Engineering Coding Standards

## Overview

High code consistency across Frontend, Backend, and Database teams ensures long-term maintainability and readability. All contributors must abide by these coding standards.

---

## 1. Naming Conventions

- **Variables & Functions**: `camelCase` (e.g., `getActiveVehicles`, `routeId`).
- **Classes, Interfaces & Types**: `PascalCase` (e.g., `VehicleController`, `TransitRoute`, `ApiResponse`).
- **Constants & Environment Variables**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_ATTEMPTS`, `PORT`).
- **Database Tables & Columns**: `snake_case` (e.g., `transit_routes`, `created_at`).

---

## 2. Folder Conventions

- Directory names must use `kebab-case` or lowercase standard words (e.g., `client/src/components`, `server/src/controllers`).
- Keep directory depth clean and organized by feature module or architectural layer.

---

## 3. File Conventions

- **React Components**: `PascalCase.tsx` or `PascalCase.jsx` (e.g., `VehicleCard.tsx`).
- **Backend / Utility Modules**: `camelCase.ts` or `kebab-case.ts` consistently per domain (e.g., `authService.ts`, `route-validator.ts`).
- Ensure every file has a single, clear responsibility.

---

## 4. Import Order

Maintain clean, predictable import ordering grouped as follows:

1. Standard external libraries and framework imports (`react`, `express`).
2. Internal shared types or schemas (`shared/types`).
3. Domain utilities and services.
4. Local relative imports and stylesheets.

Example:
```typescript
import React, { useState } from 'react';
import { RouteDetails } from '../../../../shared/types';
import { fetchRouteById } from '../services/routeService';
import './RouteCard.css';
```

---

## 5. Formatting

- **Indentation**: 2 spaces (no tabs).
- **Line Length**: Maximum 100–120 characters per line.
- **Semicolons**: Always use semicolons.
- **Quotes**: Single quotes `'` preferred for strings in JavaScript/TypeScript (double quotes `"` in JSON).
- **Trailing Commas**: Use trailing commas in multi-line object and array literals.

---

## 6. Comments Policy

- Write self-documenting code with expressive variable and function names.
- Provide succinct comments explaining *why* a complex decision or workaround was implemented, not *what* obvious syntax does.
- Preserve existing documentation comments unless refactoring the underlying logic.

---

## 7. Error Handling Principles

- **Fail Gracefully**: Never allow unhandled exceptions to crash the application process.
- **Standardized API Errors**: All backend API endpoints must catch errors and return structured failure responses adhering to [`API_RESPONSE_STANDARD.md`](API_RESPONSE_STANDARD.md).
- **No Silent Failures**: Never swallow errors in empty `catch` blocks.

---

## 8. Logging Principles

- **Structured Logging**: Include context (timestamp, service name, error stack trace) in log output.
- **Log Levels**:
  - `INFO`: Lifecycle events, server start, successful background jobs.
  - `WARN`: Non-fatal unexpected behavior or retryable failures.
  - `ERROR`: Fatal exceptions and API request failures.
- **Zero Sensitive Data**: Never log user passwords, secrets, tokens, or PII.

---

## 9. Git Commit Style

Follow **Conventional Commits** specification:

```text
<type>(<scope>): <short description>
```

### Allowed Types
- `feat`: New feature implementation
- `fix`: Bug resolution
- `docs`: Documentation updates
- `refactor`: Code restructuring without functional changes
- `chore`: Tooling, build configuration, or dependency maintenance

Example:
```text
feat(backend): add dispatch route assignment controller
```

---

## 10. Security Rules

- **Never Commit Secrets**: No passwords, API keys, or certificates allowed in repository files.
- **Never Commit `.env` Files**: Keep `.env` out of version control.
- **Validate Input**: All API inputs must be validated against schemas before execution.
- **Least Privilege**: Services should operate with minimal required access rights.
