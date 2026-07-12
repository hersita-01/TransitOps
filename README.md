# TransitOps

> Intelligent Transit Operations & Mobility Management Platform

## Project Description

**TransitOps** is a modern, real-time transit operations and fleet monitoring platform engineered to streamline dispatching, schedule tracking, incident management, and route optimization. Designed for high reliability and low latency, TransitOps bridges the gap between transit operators, fleet controllers, and field logistics teams.

---

## Hackathon Objective

Built during an intensive **8-hour hackathon**, TransitOps demonstrates a scalable, production-ready engineering architecture. The objective is to rapidly ship a fully integrated full-stack solution featuring clean domain boundaries, rigorous engineering standards, zero-merge-conflict workflows, and standardized API communications across Frontend, Backend, and Database domains.

---

## Core Modules

- **Fleet Tracking & Dispatch**: Real-time vehicle location monitoring, dispatch assignments, and operational status management.
- **Route & Schedule Operations**: Schedule adherence tracking, delay predictions, and route corridor optimization.
- **Incident & Alert Management**: Automated anomaly reporting, field alerting, and operator response tracking.
- **System Analytics & Reporting**: Fleet performance metrics, ridership throughput, and operational efficiency dashboards.

---

## Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Fast, responsive single-page client interface |
| **Backend** | Node.js + Express | REST API server with standardized error and data handling |
| **Database** | PostgreSQL + Prisma | Relational database engine and type-safe ORM |
| **Shared** | TypeScript / JSON Schemas | Shared domain types, contracts, and validation schemas |

---

## Repository Structure

The approved high-level repository organization:

```text
TransitOps/
├── client/          # Frontend React client application
├── server/          # Backend Express REST API and Prisma ORM
├── shared/          # Shared domain types, validation schemas, and constants
├── docs/            # Engineering standards, architecture, and workflow docs
└── README.md        # Primary project overview
```

---

## Getting Started

1. **Clone Repository**:
   ```bash
   git clone https://github.com/hersita-01/TransitOps.git
   cd TransitOps
   ```

2. **Frontend Setup (Root)**:
   ```bash
   npm install
   npm run dev
   ```

3. **Backend Setup (`server/`)**:
   ```bash
   cd server
   cp .env.example .env
   npm install
   npm run dev
   ```

4. **Review Engineering Standards**:
   Ensure you read [`docs/CODING_STANDARDS.md`](docs/CODING_STANDARDS.md), [`docs/GIT_WORKFLOW.md`](docs/GIT_WORKFLOW.md), and [`docs/OWNERSHIP_MATRIX.md`](docs/OWNERSHIP_MATRIX.md) before starting development.

---

## Git Workflow

TransitOps follows a single-branch workflow to maintain velocity during the hackathon:

### Repository Strategy
- **Single branch**: `main`

Every developer must:
1. `git pull origin main --rebase`
2. Complete ONLY their assigned task
3. Test locally
4. `git add .`
5. `git commit`
6. `git pull origin main --rebase`
7. `git push origin main`

Refer to [`docs/GIT_WORKFLOW.md`](docs/GIT_WORKFLOW.md) for detailed guidelines.

---

## Team Roles

Every engineering domain operates under clear ownership boundaries:

- **Frontend Engineer**: Responsible for user interfaces, state management, and API consumption (`client/`).
- **Backend Engineer**: Responsible for REST APIs, core business logic, and controller layer (`server/src`).
- **Database Engineer**: Responsible for schema modeling, migrations, database queries, and shared contracts (`server/prisma`, `shared/`).
- **Integration Engineer**: Responsible for repository hygiene, CI/CD, documentation, and engineering standards (`README.md`, `docs/`, `.github/`).

See [`docs/OWNERSHIP_MATRIX.md`](docs/OWNERSHIP_MATRIX.md) for strict ownership rules.

---

## Folder Structure

Refer to [`docs/DIRECTORY_STRUCTURE.md`](docs/DIRECTORY_STRUCTURE.md) for the complete approved directory layout and architectural constraints.

---

## License

This project is licensed under the **MIT License**. See the repository terms for details.

---

## Future Scope

- **Real-Time WebSocket Telemetry**: Streaming live GPS coordinates and vehicle diagnostics.
- **Predictive AI Maintenance**: Machine learning models predicting vehicle service intervals.
- **Automated Dispatch Optimization**: Algorithmic driver-vehicle rebalancing during peak transit windows.
