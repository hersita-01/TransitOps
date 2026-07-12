# Git Workflow & Branching Strategy

## Overview

TransitOps uses a single-branch Git workflow tailored for rapid hackathon collaboration and minimal overhead.

---

## Repository Strategy

- **Single branch**: `main`

All engineering domains operate directly on the `main` branch. Strict domain ownership boundaries ensure zero merge conflicts between engineers.

---

## Standard Development Workflow

Every developer must adhere strictly to the following sequence for every task:

1. **Pull Latest Main with Rebase**:
   Always sync your local repository before starting work:
   ```bash
   git pull origin main --rebase
   ```

2. **Complete ONLY Assigned Task**:
   Restrict changes strictly to your assigned domain files (`client/`, `server/src`, `server/prisma`, `shared/`, or `docs/`).

3. **Test Locally**:
   Verify your code builds and passes validation tests locally.

4. **Stage Changes**:
   ```bash
   git add .
   ```

5. **Commit Changes**:
   Write a clean semantic commit message adhering to project coding standards:
   ```bash
   git commit -m "<type>(<scope>): <short description>"
   ```

6. **Re-Sync Before Pushing**:
   Ensure no conflicts occurred while you were committing:
   ```bash
   git pull origin main --rebase
   ```

7. **Push to Main**:
   ```bash
   git push origin main
   ```

---

## Conflict Prevention Rules

- Never edit files outside your assigned ownership domain.
- Always run `git pull origin main --rebase` immediately before pushing.
