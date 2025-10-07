# Contributing to CF TechLab

Thanks for your interest in contributing! This project powers a dynamic marketing + innovation platform (React + Express + Prisma). The guidelines below help keep quality, consistency, and forward compatibility.

---

## 📌 Core Principles

- **Clarity over cleverness**: Favor explicit code & naming.
- **Type safety first**: No implicit any, keep strict TypeScript happy.
- **Small PRs**: Easier to review, easier to revert.
- **Document user‑visible changes**: Update README / PROFILE / API notes as needed.
- **Security awareness**: Never expose secrets or add unprotected admin functionality without a plan.

---

## 🧱 Project Structure Overview

```
CF_TechLab/
  src/                 # Frontend (React)
  server/              # Backend (Express + Prisma)
    prisma/schema.prisma
    src/store.ts       # Data access + seeding
    src/routes/        # API endpoints
  uploads/             # Runtime file uploads (ignored in Git)
  README.md            # Concise engineering overview
  PROFILE.md           # Brand / mission / narrative content
  CONTRIBUTING.md      # This file
  LICENSE              # MIT license
```

---

## 🛠 Dev Environment

Front-end:

```bash
npm install
npm run dev
```

Backend:

```bash
cd server
npm install
npm run dev
```

API served at :4000 (default) and proxied via Vite to :8080.

Prisma:

```bash
cd server
npx prisma migrate dev --name <migration>
```

Regenerate client if schema changed:

```bash
npx prisma generate
```

---

## ✨ Adding a New Data Model

1. Edit `server/prisma/schema.prisma` (add model block).
2. Run a migration: `npx prisma migrate dev --name add_<model>`.
3. Add store helpers in `server/src/store.ts`.
4. Expose routes (create new file under `server/src/routes/` or extend `content.ts`).
5. Update frontend hooks/components to consume the new API.
6. Add brief docs to README or PROFILE if user-facing.

---

## 🧪 Testing & Validation (Manual for now)

Before opening a PR:

- `npm run lint` (root) and `npx tsc --noEmit` (root + inside `server/` if needed)
- Exercise new routes with `curl` or REST client.
- Confirm no unhandled promise rejections in backend logs.
- Upload workflow: confirm images appear under `/uploads/...` and accessible.

(Planned) CI will enforce type, lint, and build. Feel free to add a GitHub Actions workflow; see “Potential Improvements”.

---

## 🧩 Commit & Branch Conventions

- Branch: `feature/<slug>` / `fix/<slug>` / `chore/<slug>`
- Commit prefix examples:
  - `feat(api): add project search filter`
  - `fix(ui): prevent testimonial flicker`
  - `chore(prisma): migrate testimonial approval flag`
  - `docs(readme): link PROFILE.md`

---

## 🔐 Security / Admin Notes

- Current admin endpoints (projects create, testimonial moderation) are open in dev.
- Do NOT expose them publicly without adding at least an API key or session auth middleware.
- Do not log secrets.
- Do not store user-uploaded files in version control.

---

## 🖼 Frontend Guidelines

- Prefer functional components + hooks.
- Keep presentational vs data concerns separated (container vs UI components) where complexity grows.
- Use Tailwind utility classes; extract reusable patterns only when repeated 3+ times or logically grouped.
- Avoid adding large UI libraries; we already use shadcn-style primitives.

---

## 🗂 Backend Guidelines

- One responsibility per route module (e.g. `content.ts`, `testimonial-submit.ts`).
- Only perform input validation with Zod schemas at the edge.
- Map Prisma records to DTO shapes if filtering or transforming; return minimal fields.
- Centralize repeated logic in `store.ts` (or split later into domain modules if it grows).

---

## 🧵 Error Handling

Return JSON shape:

```json
{ "error": "slug", "message": "Optional human friendly context" }
```

Log internal details server-side (avoid leaking stack traces to client in production).

---

## 📦 Dependency Policy

- Add a dependency only if: (a) significantly reduces complexity AND (b) is well-maintained.
- Prefer dev-only utilities where possible.
- Pin versions via semver ranges already in `package.json` (lockfile committed).

---

## 🔮 Potential Improvements (Open to PRs)

- Auth (API key or session) for admin routes
- Switch from SQLite to Postgres for production readiness
- Image optimization pipeline (sharp) + remote storage (S3/R2)
- Logging (pino) + request tracing
- Automated tests (Vitest for units, Playwright/Cypress for E2E)
- CI pipeline (GitHub Actions) for build / lint / type / preview
- Dark/light theme toggle tokens sync

---

## 🧾 License

MIT — see `LICENSE`.

---

## 🙌 Getting Help

Open an issue with:

- Summary
- Steps to reproduce (if bug)
- Expected vs actual
- Screenshots / logs (if visual or runtime issue)

Enjoy building! ⚡
