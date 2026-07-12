# Development Setup Guide

## Overview

This guide outlines the prerequisites and setup instructions for contributors developing on the **TransitOps** platform.

> **IMPORTANT**: Do not initialize application modules (`client/`, `server/`, `shared/`) during Sprint 0. This guide documents developer setup procedures for Sprint 1 development.

---

## Required Software

Ensure your local development workstation has the following required software installed:

- **Git**: v2.40+ configured with developer identity (`user.name` and `user.email`).
- **Node.js**: LTS release v20.x or higher.
- **PostgreSQL**: v15.x or higher running locally or accessible via network instance.
- **VS Code**: Visual Studio Code editor with recommended extensions (ESLint, Prettier, GitGraph).

---

## Environment Variables

Developers must configure runtime environment variables without committing sensitive secrets to the repository.

1. Refer to `.env.example` templates provided within domain directories during Sprint 1.
2. Copy `.env.example` to `.env` in your local environment:
   ```bash
   cp .env.example .env
   ```
3. **Security Rule**: Never commit `.env` or credentials to version control.

---

## Branch Strategy

TransitOps uses a single-branch (`main`) strategy:

1. Ensure you are on `main` and pull latest changes with rebase:
   ```bash
   git checkout main
   git pull origin main --rebase
   ```
2. Complete ONLY your assigned domain task directly on `main`.

---

## Local Setup Steps

Follow these steps once application folders are initialized in Sprint 1:

1. **Clone Repository**:
   ```bash
   git clone https://github.com/hersita-01/TransitOps.git
   cd TransitOps
   ```
2. **Install Dependencies** (in respective domain directory):
   ```bash
   # Frontend Engineer
   cd client && npm install

   # Backend & Database Engineers
   cd server && npm install
   ```
3. **Database Preparation** (Database Engineer):
   ```bash
   cd server
   npx prisma generate
   npx prisma migrate dev
   ```
4. **Start Development Servers**:
   ```bash
   # Frontend Development Server
   npm run dev

   # Backend API Server
   npm run dev
   ```
