<div align="center">

# ⚡ CF TechLab

Modern full‑stack marketing & innovation platform (React + Express + Prisma) with dynamic content, file uploads, testimonial moderation, and lightweight admin tooling.

<br/>

![Status](https://img.shields.io/badge/status-active-success?style=flat-square)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Express%20%7C%20Prisma-purple?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-informational?style=flat-square)

</div>

> Brand & mission: `PROFILE.md` · Contribution workflow: `CONTRIBUTING.md`

---

## Table of Contents

1. Overview
2. Key Features
3. Tech Stack
4. Repository Structure
5. Quick Start
6. Environment
7. Prisma & Data
8. API Summary
9. Moderation Flow
10. Development & Quality
11. Customization Checklist
12. Security Notes
13. Roadmap (Selected)
14. License
15. Contact & Support
16. Related Docs

---

## 1. Overview

This repository contains both the frontend (Vite + React + Tailwind UI) and backend (Express + Prisma) powering dynamic marketing content: services, projects, testimonials (approval workflow), service requests, and contact messages.

Deployment model:

- Static frontend (Vercel / Netlify / Cloudflare Pages) + Node API runtime (Fly.io / Render / Railway / VPS)
- Easy migration path from SQLite (dev) → Postgres (production)

---

## 2. Key Features

| Domain       | Capability                                                             |
| ------------ | ---------------------------------------------------------------------- |
| Projects     | Pagination, category & search filter, admin create (URL or file image) |
| Services     | Auto-seeded & delivered dynamically (no hard-coded UI lists)           |
| Testimonials | Public submission + moderation (approve/delete) before display         |
| Uploads      | Multer disk storage; consistent relative path references               |
| Metrics      | Real-time project count surfaced on About page                         |
| Search       | In-memory fallback for SQLite (swap to DB full-text later)             |
| Seeding      | Idempotent first-access seeding for services/projects/testimonials     |

Planned: authentication/authorization, Postgres migration, image optimization/CDN, audit trails.

---

## 3. Tech Stack

| Area               | Tech                                                                        |
| ------------------ | --------------------------------------------------------------------------- |
| Frontend           | React 18, Vite, TypeScript, Tailwind, lucide-react, shadcn-style components |
| Data fetching      | Native fetch (+ optional TanStack Query)                                    |
| Backend            | Express (TypeScript) using `tsx` for watch mode                             |
| ORM                | Prisma 5 (SQLite dev)                                                       |
| Validation         | Zod schemas at route edge                                                   |
| Uploads            | Multer (disk storage)                                                       |
| Email (extensible) | Nodemailer (service request notifications)                                  |

---

## 4. Repository Structure

CF_TechLab/
src/ # Frontend React app
components/ # UI + sections (Hero, Services, Testimonials, etc.)
pages/ # Route-level pages (ProjectsPage, Admin pages, etc.)
lib/ # Helpers (service request, utils)
server/
prisma/ # schema.prisma + migrations + dev.db
src/
store.ts # Data access + seeding functions
routes/ # Express routers (content, testimonial-submit, etc.)
uploads/ # Runtime uploaded images (git ignored except sample)
PROFILE.md # Brand & mission narrative
CONTRIBUTING.md # Contribution guidelines
LICENSE # MIT
README.md # (This engineering overview)

````

---

## 5. Quick Start

### Frontend

```bash
npm install
npm run dev   # http://localhost:8080
````

### Backend (second terminal)

```bash
cd server
npm install
npm run dev   # http://localhost:4000
```

The Vite dev server proxies `/api/*` → backend (see `vite.config.ts`).

### Environment (server/.env)

```env
PORT=4000
DATABASE_URL="file:./dev.db"
MAX_IMAGE_MB=5
# Optional email config if enabling notifications:
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASS=your_pass
SMTP_SECURE=false
MAIL_FROM="CF TechLab <no-reply@example.com>"
# Email notification toggles
ENABLE_EMAIL=true
# Where internal notifications are delivered (defaults to MAIL_FROM when unset)
NOTIFY_TO=owner@example.com
```

Optional root `.env` for deployment differences:

```env
VITE_API_BASE=https://api.example.com
```

---

## 6. Environment

See `.env` examples above. Do not commit real secrets. Consider using Doppler / 1Password / Vault in production.

### Email Setup (Notifications)

To enable email notifications for service requests, contact messages, and testimonials:

1. Copy `server/.env.example` to `server/.env`.
2. Provide valid SMTP credentials (Gmail App Password or Ethereal test account).
3. Set `ENABLE_EMAIL=true`.
4. Restart backend: inside `server/` run `npm run dev`.
5. Test endpoints:
   - `POST /api/contact`
   - `POST /api/service-request`
   - `POST /api/testimonial-submit` (optional `email` field for user receipt)

If `ENABLE_EMAIL` is false or SMTP variables missing, emails are skipped gracefully.

---

## 7. Prisma & Data

Generate / migrate after schema changes:

```bash
cd server
npx prisma migrate dev --name add_feature
npx prisma generate
npx prisma studio  # DB UI (optional)
```

Seeding auto-runs lazily inside first content request via `ensureSeededContent()`.

---

## 8. API Summary

| Method | Endpoint                                                         | Purpose                                   |
| ------ | ---------------------------------------------------------------- | ----------------------------------------- |
| GET    | `/api/content/services`                                          | List services                             |
| GET    | `/api/content/projects?limit=6`                                  | Homepage limited projects                 |
| GET    | `/api/content/projects?page=1&pageSize=9&search=ai&category=Web` | Paginated / filtered projects             |
| POST   | `/api/content/projects`                                          | Create project (JSON or multipart)        |
| GET    | `/api/content/testimonials?batch=1&size=3`                       | Batched approved testimonials             |
| GET    | `/api/content/testimonials/pending`                              | Pending testimonials (admin)              |
| POST   | `/api/content/testimonials/:id/approve`                          | Approve testimonial                       |
| DELETE | `/api/content/testimonials/:id`                                  | Delete testimonial                        |
| POST   | `/api/testimonial-submit`                                        | Public testimonial submission (multipart) |
| POST   | `/api/service-request`                                           | Service inquiry capture                   |
| POST   | `/api/contact`                                                   | Contact message (if route enabled)        |

Example multipart project create:

```bash
curl -F title="AI Dashboard" \
         -F category="Web" \
         -F description="Real-time analytics" \
         -F iconKey="Code" \
         -F tags='["AI","Analytics"]' \
         -F year=2025 \
         -F projectUrl=https://example.com/demo \
         -F imageFile=@/path/to/image.png \
         http://localhost:4000/api/content/projects
```

---

## 9. Moderation Flow (Testimonials)

1. User submits via `/api/testimonial-submit` (stored with `approved=false`).
2. Admin panel (`/admin/testimonials`) fetches `/api/content/testimonials/pending`.
3. Approve → now appears in public carousel (which only queries approved rows).

---

## 10. Development & Quality

- Type checking: `npx tsc --noEmit` (root & server)
- Linting: `npm run lint`
- Lightweight manual curl tests for API (recommend adding Jest/Vitest later)
- In future: GitHub Actions for build + lint + type + (optional) preview deploy

---

## 11. Customization Checklist

- [ ] Replace seed images / copy
- [ ] Add auth middleware for admin endpoints
- [ ] Move uploads to object storage (S3/R2) with signed URLs
- [ ] Introduce Postgres for production scale
- [ ] Add E2E tests (Playwright) & integration coverage
- [ ] Add logging (pino) + request correlation IDs
- [ ] Add image optimization (sharp) pipeline

---

## 12. Security Notes

Current admin endpoints are open (dev). Add at least:

- API key header OR cookie session auth
- Rate limiting (e.g., express-rate-limit)
- Validation already handled via Zod

---

## 13. Roadmap (Selected)

| Phase   | Focus                                                  |
| ------- | ------------------------------------------------------ |
| Q4 2025 | Auth (API key / session) + secure admin endpoints      |
| Q1 2026 | Postgres migration + search via ILIKE / trigram        |
| Q2 2026 | Image optimization + remote object storage             |
| 2026+   | Observability (metrics, structured logs), CI pipelines |

---

## 14. License

MIT © 2025 CF TechLab — see `LICENSE`.

---

## 15. Contact & Support

| Purpose           | Channel (placeholder)                |
| ----------------- | ------------------------------------ |
| General inquiries | hello@cftechlab.com                  |
| Security          | security@cftechlab.com (planned)     |
| Partnerships      | partnerships@cftechlab.com (planned) |

> You can replace these with actual issue templates / discussion links.

---

## 16. Related Docs

- `PROFILE.md` – Mission, vision, narrative, branding
- `CONTRIBUTING.md` – How to contribute / PR workflow

---

<div align="center">

_Built with focus on performance, accessibility & creative engineering._ ⚡

</div>
