<div align="center">

# ⚡ CF TechLab

Modern frontend marketing & innovation site built with React, Vite, Tailwind, and TypeScript. (Backend layer temporarily removed; this repo now contains only the frontend implementation. Future backend/API work will be reintroduced later.)

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

This repository currently contains ONLY the frontend (previous Express/Prisma backend was removed for later redevelopment). All dynamic data sections now assume static or placeholder data until an API is reattached.

---

## 2. Current Frontend Features

| Area         | Capability (Frontend Only Mode)                            |
| ------------ | ---------------------------------------------------------- |
| Landing UI   | Hero, Services, Projects showcase, FAQ, CTA, Contact       |
| Components   | Reusable shadcn-style primitives (buttons, forms, dialogs) |
| Styling      | Tailwind CSS with custom CSS vars & animation utilities    |
| Routing      | React Router page structure                                |
| Theming Base | Design tokens prepared for light/dark (future toggle)      |

Deferred (will return with backend phase): dynamic content CRUD, uploads, testimonial moderation, email notifications.

---

## 3. Tech Stack (Active)

| Layer      | Tech                                              |
| ---------- | ------------------------------------------------- |
| Frontend   | React 18, Vite, TypeScript, Tailwind              |
| UI Icons   | lucide-react                                      |
| Components | Radix primitives + custom wrappers (shadcn style) |
| Forms      | react-hook-form + zod (client validation)         |
| State      | Local state (TanStack Query present, optional)    |

---

## 4. Repository Structure (Frontend Only)

CF_TechLab/
src/ # React application source
components/ # UI + sections (Hero, Services, etc.)
pages/ # Route-level pages
lib/ # Frontend helpers (api, utils)
public/ # Static assets
README.md # This overview
PROFILE.md # Brand / mission narrative
CONTRIBUTING.md # Contributing guidelines (still references backend – will be revised later)
LICENSE # MIT

````

---

## 5. Quick Start

### Frontend

```bash
npm install
npm run dev   # http://localhost:8080
````

Backend instructions removed (future phase will reintroduce). Any calls to `/api/*` should be stubbed or pointed to a future service.

## Production Build & Deployment

Deploy as a static frontend (Vercel / Netlify / Cloudflare Pages / S3+CloudFront). When backend work resumes, this section will expand with API integration notes.

### 1. Build frontend

```bash
npm install
npm run build
```

Outputs `dist/` at repo root.

Backend build step removed.

### 3. Configure environment

Copy `server/.env.example` → `server/.env` and set (example):

```env
PORT=4000
DATABASE_URL="postgresql://user:pass@host:5432/dbname?schema=public"  # Use Postgres in prod
ENABLE_EMAIL=true
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=api@yourdomain
SMTP_PASS=your_app_password
MAIL_FROM="CF TechLab <no-reply@yourdomain>"
NOTIFY_TO=ops@yourdomain
DOMAIN=yourdomain
SERVE_FRONTEND=true
MAX_IMAGE_MB=5
```

#### Supabase (Postgres + Storage) Add-on

If using Supabase instead of local SQLite:

```env
# Supabase Database & Storage
DATABASE_URL="postgresql://<user>:<pass>@aws-<region>.pooler.supabase.com:6543/postgres"
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_KEY=service_role_key_here   # NEVER expose to frontend
SUPABASE_BUCKET=uploads                      # Create this bucket in Supabase Storage
ADMIN_TOKEN=change-this-token                # Used for admin-protected routes (x-admin-token header)
```

When Supabase env vars are present, file uploads go to Storage under `projects/` and `testimonials/` paths and the DB stores absolute public URLs.

Database migrations & server runtime omitted until backend reinstatement.

Visit: `http://<host>:4000/` (app) and `http://<host>:4000/api/health` (health).

### 6. One-shot build script (optional)

Add to root `package.json`:

```jsonc
"scripts": { "build:all": "npm run build && cd server && npm run build" }
```

Usage:

```bash
npm run build:all
```

### 7. Reverse proxy (NGINX)

```nginx
server {
   listen 80;
   server_name yourdomain;

   location /api/ { proxy_pass http://127.0.0.1:4000/api/; proxy_set_header Host $host; }
   location /uploads/ { proxy_pass http://127.0.0.1:4000/uploads/; }
   location / { proxy_pass http://127.0.0.1:4000/; try_files $uri $uri/ /index.html; }
}
```

### 8. Process manager (PM2)

```bash
cd server
pm2 start dist/index.js --name cf-techlab --env production
pm2 save
```

Systemd alternative (`/etc/systemd/system/cf-techlab.service`):

```ini
[Unit]
Description=CF TechLab
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/cf-techlab/server
## 6. Development & Quality (Frontend Mode)

- Type checking: `npx tsc --noEmit`
- Linting: `npm run lint`
- Build: `npm run build`
- Preview: `npm run preview`

## 7. Roadmap (Next Steps After Re‑adding Backend)

| Phase | Planned Focus |
| ----- | ------------- |
| 1     | Reintroduce API (content, testimonials) |
| 2     | Auth & protected admin UI |
| 3     | File uploads (object storage) |
| 4     | CI pipeline + basic tests |

## 8. License

MIT © 2025 CF TechLab — see `LICENSE`.

## 9. Related Docs

- `PROFILE.md`
- `CONTRIBUTING.md` (legacy backend references present)

<div align="center">
Focused frontend slice — backend coming soon. ⚡
</div>
```
