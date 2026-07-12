# TransitOps – Smart Transport Operations Platform

TransitOps is an enterprise-grade web application built to streamline and manage fleet operations. This frontend application provides an intuitive, highly responsive, and accessible dashboard for tracking vehicles, drivers, trips, maintenance schedules, and associated expenses.

## Project Overview

The current repository contains the **Frontend Application** which is functionally complete using mock data. It is designed to be fully responsive across desktop, tablet, and mobile devices. 

## Technology Stack

- **Core**: React 18, TypeScript
- **Routing**: React Router v6 (with `React.lazy` for route-based code splitting)
- **Styling**: Tailwind CSS (custom utility classes, dark mode, animations)
- **Components**: Radix UI (accessible primitives for Modals, Dialogs, etc.)
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Data Visualization**: Recharts
- **Tooling**: Vite, ESLint, TypeScript compiler

## Folder Structure

```
src/
├── components/
│   ├── common/       # Reusable UI elements (DataTable, Pagination, etc.)
│   ├── ui/           # Core UI primitives (Modal, Toast, Skeleton, etc.)
│   └── [feature]/    # Feature-specific components (fleet, drivers, trips, etc.)
├── context/          # React Context providers (Auth, Toast)
├── layouts/          # Page layouts (DashboardLayout)
├── mock/             # Mock JSON data mimicking a real backend
├── pages/            # Top-level route components (lazy-loaded)
├── routes/           # Application router configuration
├── services/         # API integration layer (currently exports mock data)
├── types/            # TypeScript interfaces and shared types
└── utils/            # Helper functions and utilities
```

## Features Implemented

- **Command Palette (`Ctrl+K`)**: Global fuzzy-search for quick navigation across the application.
- **Global Toast System**: Non-blocking notifications for user actions (success, error, warning).
- **Advanced DataTables**: Sortable, paginated tables with customized cell renderers and empty state handling.
- **Form Validation**: Strict validation schemas utilizing Zod and React Hook Form.
- **Loading Skeletons**: Pre-built loading states (Tables, Cards) to smooth out perceived load times.
- **Responsive Layouts**: Collapsible sidebar for desktop and slide-over menu for mobile. 

## Screens Implemented

1. **Login**: Professional split-screen UI.
2. **Dashboard**: KPI summaries, active trip maps (mocked), and critical alerts.
3. **Fleet**: Vehicle registration, status tracking, and details.
4. **Drivers**: Driver profiles, license tracking, and vehicle assignments.
5. **Trips**: Scheduling, dispatching, and trip lifecycle timeline.
6. **Maintenance**: Service logging, status workflows, and cost tracking.
7. **Expenses**: Financial recording and categorisation.
8. **Analytics**: Rich charts, KPIs, and expense breakdowns.
9. **Profile**: User information and avatar management.
10. **Settings**: Multi-tab configuration (General, Security, Theme, Role Management).

## How to Run Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Future Backend Integration

To integrate with a real backend API:
1. Update `src/services/` files to replace `MOCK_DATA` exports with actual `fetch` or `axios` calls.
2. Introduce a data fetching library like React Query (`@tanstack/react-query`) or SWR.
3. Update `src/context/AuthContext.tsx` to handle real JWT tokens and authentication states.
