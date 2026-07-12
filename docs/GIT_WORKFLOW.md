# Git Workflow & Branching Strategy

## Overview

TransitOps uses a structured, Git-flow inspired branching model tailored for rapid hackathon collaboration. Clear branch isolation ensures zero merge conflicts between domain engineers.

---

## Branch Structure

### Core Protected Branches

- **`main`**
  - **Purpose**: Stable production releases.
  - **Rules**: Direct commits are **strictly forbidden**. Code enters `main` only via Pull Request from `develop` after full verification.
- **`develop`**
  - **Purpose**: Primary integration branch for active development.
  - **Rules**: Direct commits are **strictly forbidden**. All feature branches branch from and merge back into `develop`.

---

### Domain Feature Branches

- **`feature/frontend`**
  - **Owner**: Frontend Engineer
  - **Scope**: Changes confined to `client/`.
- **`feature/backend`**
  - **Owner**: Backend Engineer
  - **Scope**: Changes confined to `server/src`.
- **`feature/database`**
  - **Owner**: Database Engineer
  - **Scope**: Changes confined to `server/prisma/` and `shared/`.
- **`feature/integration`**
  - **Owner**: Integration Engineer
  - **Scope**: Changes confined to `README.md`, `docs/`, and `.github/`.

---

## Development Flow

```text
       [feature/frontend] -----\
                              \
[main] <=== (PR) === [develop] <=== (PR) === [feature/backend]
                              /
       [feature/database] ----/
```

### 1. Feature Branch Creation

Always create your domain feature branch from the latest commit on `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/<domain>
```

### 2. Active Development

- Make frequent, atomic commits adhering to project commit message guidelines.
- Continuously sync with `develop` to prevent divergence:
  ```bash
  git fetch origin
  git rebase origin/develop
  ```

### 3. Pull Request Submission

- Push your feature branch to remote origin:
  ```bash
  git push -u origin feature/<domain>
  ```
- Open a Pull Request on GitHub targeting `develop`.
- Fill out the mandatory Pull Request Template.

### 4. Code Review

- At least one peer review is required before merging.
- Verify that no out-of-bounds files were modified outside the engineer's assigned domain ownership.

### 5. Merge into `develop`

- Once approved and CI checks pass, merge the Pull Request into `develop` using **Squash and Merge** or **Merge Commit** as agreed by the team.
- Delete the remote feature branch post-merge.

### 6. Final Merge into `main`

- At sprint milestones or hackathon completion, the Integration Engineer opens a final Pull Request from `develop` into `main`.
- Once verified, `develop` is merged into `main` and tagged with the release version.
