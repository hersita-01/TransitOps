# Domain Ownership Matrix

## Overview

To guarantee zero merge conflicts during high-velocity hackathon development, every directory and file in the repository has **exactly one owner**. Engineers are prohibited from modifying files outside their assigned domain.

---

## Assigned Ownership Matrix

### Frontend Engineer
- **Owns**
  - `client/`

---

### Backend Engineer
- **Owns**
  - `server/src`

---

### Database Engineer
- **Owns**
  - `server/prisma`
  - `shared/`

---

### Integration Engineer
- **Owns**
  - `README.md`
  - `docs/`
  - `.github/`

---

## Ownership Rules

1. **Only One Owner Per Source File**: Multiple owners for a single file are strictly prohibited.
2. **Cross-Domain Changes**: If a Frontend or Backend implementation requires a shared schema change in `shared/` or `server/prisma`, the request must be assigned to the **Database Engineer**.
3. **Repository Infrastructure**: CI/CD pipelines, documentation, root markdown files, and issue templates are managed exclusively by the **Integration Engineer**.
