# Accessories Repair & Action Taken Report Management System

A web-based system for tracking accessory repair complaints from intake to closure, built for **Panimalar Engineering College**.

## Workflow

Every complaint moves through 6 stages:

```
Complaint Registered → Inspection → Repair Assigned → Action Taken → Verification → Closed
```

## Roles

Admin · HOD · Faculty/Staff · Technician · Service Provider · IQAC/NAAC

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| ORM | Prisma |
| Database | PostgreSQL (Neon, cloud-hosted) |

## Folder Structure

```
main-project/
├── frontend/     # React + Vite + Tailwind app
├── backend/      # Express server, API routes
├── database/     # Prisma schema & migrations
└── .github/      # CI workflow, CODEOWNERS, PR templates
```

## Getting Started (Local Setup)

### 1. Clone the repo
```bash
git clone https://github.com/pec-nextgen-team/main-project.git
cd main-project
```

### 2. Set up environment variables
Each folder that needs it (`backend/`, `database/`) has a `.env.example` file.

- Copy it: `cp .env.example .env`
- Fill in `DATABASE_URL` — ask **Midhilesh** for the shared Neon connection string (sent privately, never post it in chat)
- **Never commit your `.env` file** — it's already excluded via `.gitignore`

### 3. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Run locally
```bash
# Backend (from /backend)
npm run dev

# Frontend (from /frontend, separate terminal)
npm run dev
```

### 5. Database (Prisma)
```bash
cd database   # or wherever schema.prisma lives — confirm with Database team
npx prisma generate
npx prisma migrate dev
```

⚠️ **We're sharing one cloud database during early development.** Don't run destructive migrations without checking with the Database lead first — it affects everyone's data.

## How We Work (Branching & PRs)

1. **Never push directly to `main`** — it's protected (PR + review + passing CI required)
2. Each team has its own dev branch:
   - Backend → branch off `backend-dev`
   - Frontend → branch off `frontend-dev`
   - Database → branch off `database-dev`
3. Branch naming: `team/short-description` (e.g. `backend/login-api`, `frontend/login-page`)
4. Open your PR **into your team's dev branch** — not `main`
5. Your team lead reviews and merges into the dev branch
6. Dev branches are periodically merged into `main` after review

## Teams

| Team | Lead |
|---|---|
| Backend | Aishwarya Laxmi |
| Frontend | Pooja Laxmi K |
| Database | Deepashikkha S |

## CI

Every PR automatically runs a build check (`.github/workflows/ci.yml`). PRs can't merge into `main` if the build fails.

## Questions?

Ask in the team WhatsApp group, or ping Midhilesh.
