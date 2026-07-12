# Contributing to TransitOps

Welcome to the **TransitOps** engineering team! Because TransitOps is developed during an intensive **8-hour hackathon**, maintaining high velocity without merge conflicts requires strict adherence to engineering standards and domain ownership rules.

---

## 1. Core Engineering Principles

1. **Respect Domain Ownership**: Never modify source files outside your assigned role. Refer to [`OWNERSHIP_MATRIX.md`](OWNERSHIP_MATRIX.md) before creating or editing any file.
2. **Standardized Communication**: All APIs must return standardized JSON structures as documented in [`API_RESPONSE_STANDARD.md`](API_RESPONSE_STANDARD.md).
3. **Strict Git Workflow**: We follow a single-branch (`main`) workflow. Refer to [`GIT_WORKFLOW.md`](GIT_WORKFLOW.md).
4. **Code Quality**: Follow all linting, formatting, and structural guidelines outlined in [`CODING_STANDARDS.md`](CODING_STANDARDS.md).

---

## 2. Security Rules (Mandatory)

To ensure robust security posture throughout the repository:

- **Never Commit Secrets**: Do not commit API keys, passwords, private keys, database connection strings, or JWT secrets.
- **Never Commit `.env` Files**: Local `.env` files are ignored by `.gitignore`. Always use environment variables injected at runtime.
- **Validate All Input**: Sanitize and validate every incoming request body, query parameter, and URL parameter at the controller/route layer.
- **Principle of Least Privilege**: Ensure database connections and API tokens use only the minimal permissions required.
- **No Credentials Inside Repository**: Hardcoded credentials will lead to immediate PR rejection.

---

## 3. Development & Contribution Process

### Repository Strategy
- **Single branch**: `main`

Every developer must adhere to the following sequence:

1. Pull latest changes with rebase:
   ```bash
   git pull origin main --rebase
   ```
2. Complete ONLY your assigned task adhering to the [Ownership Matrix](OWNERSHIP_MATRIX.md).
3. Test locally to ensure zero build errors or breaking changes.
4. Stage and commit changes using semantic commit messages adhering to our [Coding Standards](CODING_STANDARDS.md#9-git-commit-style):
   ```bash
   git add .
   git commit -m "<type>(<scope>): <short description>"
   ```
5. Pull latest changes with rebase before pushing:
   ```bash
   git pull origin main --rebase
   ```
6. Push directly to main:
   ```bash
   git push origin main
   ```

---

## 4. Reporting Bugs & Feature Requests

Use our standardized GitHub Issue templates located in `.github/ISSUE_TEMPLATE/`:
- **Bug Reports**: Submit actionable steps to reproduce, expected vs. actual behavior, and logs.
- **Feature Requests**: Outline the business objective, scope, and domain boundary impact.
