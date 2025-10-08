# Contributing to CF TechLab

Thanks for your interest in contributing! The project now runs as a **frontend + Supabase (DB/Storage) + Edge Functions** stack (the previous custom Node / Express / Prisma backend was intentionally removed for a lean serverless architecture). These guidelines keep quality, security, and velocity high.

---

## 📌 Core Principles

- **Clarity over cleverness**: Favor explicit code & naming.
- **Type safety first**: No implicit any, keep strict TypeScript happy.
- **Small PRs**: Easier to review, easier to revert.
- **Document user‑visible changes**: Update README / PROFILE / API notes as needed.
- **Security awareness**: Never expose secrets or add unprotected admin functionality without a plan.

---

## 🧱 Current Project Structure

```
CF_TechLab/
  src/
    components/          # UI + sections + shadcn style primitives
    hooks/               # React Query data & mutation hooks
    lib/                 # supabase client, notify helper, utils
    pages/               # Route-level pages (admin, marketing)
  supabase/
    functions/notify/    # Edge Function (email notifications via Resend)
  scripts/               # Setup & maintenance scripts (notifications, RLS)
  public/                # Static assets
  .env.example           # Frontend environment template (VITE_*)
  vercel.json            # Static SPA + fallback routing
  README.md              # Technical & deployment overview
  PROFILE.md             # Brand / mission / narrative context
  CONTRIBUTING.md        # This file
  LICENSE
```

> Legacy `server/` backend removed. If you plan to reintroduce a custom API, propose architecture in an issue first.

---

## 🛠 Dev Environment (Serverless Mode)

1. Copy env template & fill:
  ```bash
  cp .env.example .env.local
  # Add VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
  ```
2. Install & run:
  ```bash
  npm install
  npm run dev   # http://localhost:8080
  ```
3. (Optional) Serve Edge Function locally:
  ```bash
  supabase login
  supabase link --project-ref <project-ref>
  supabase functions serve --env-file .env.local
  # POST → http://localhost:54321/functions/v1/notify
  ```
4. Deploy notification function:
  ```bash
  supabase functions deploy notify
  ```

No local Prisma / migrations now; database schema managed directly in Supabase (SQL editor or migration scripts if introduced later).

---

## ✨ Adding / Modifying Data (Supabase)

1. Design table structure (naming: snake_case for columns, plural table names).
2. Create / alter table via Supabase SQL editor (or propose migration script under `scripts/sql/` if we formalize migrations later).
3. Update or add React Query hooks (`hooks/useData.ts`, `hooks/useMutations.ts`).
4. Ensure frontend forms validate (Zod / manual checks) before inserts.
5. If notifications required, include relevant `sendNotification({...})` call with clear `type` + `meta` payload.
6. Update README sections or PROFILE if user‑facing feature.
7. (Later) Add RLS policies—open a PR including the SQL.

---

## 🧪 Testing & Validation (Current Manual Flow)

Before opening a PR:

- `npm run lint`
- `npx tsc --noEmit`
- Exercise new data flows (forms → Supabase rows) in the UI.
- If Edge Function touched: deploy to a test project or serve locally & `curl` it.
- Verify notifications appear (owner + optional user ack) or that failures are gracefully silent.

> CI pipeline (lint + type + build + preview) is a roadmap item—feel free to contribute.

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

## 🗂 Supabase & Edge Function Guidelines

- **Schema clarity**: Prefer explicit `created_at timestamptz default now()` columns.
- **Minimal columns**: Add only fields used by UI or analytics—avoid premature generalization.
- **RLS (future)**: Start locked-down → selectively open with policies. Document each policy rationale.
- **Edge Function**: Keep Deno function small & single-purpose; log structured JSON for debugging.
- **Secrets**: Never echo secrets in logs; validate presence early and return `501 Not configured` if missing.

---

## 🧵 Error Handling Philosophy

- Frontend: show concise toast; avoid leaking raw Supabase error text unless helpful.
- Edge Function: return `{ ok:false, error:"slug" }` (currently basic—enhancements welcome).
- Do not rely on string matching Resend errors for logic; treat fail → warn + continue UX.

---

## 📦 Dependency Policy

- Add a dependency only if: (a) significantly reduces complexity AND (b) is well-maintained.
- Prefer dev-only utilities where possible.
- Pin versions via semver ranges already in `package.json` (lockfile committed).

---

## 🔮 Potential Improvements (Open to PRs)

- RLS policy set + auth gated admin pages
- Dark / light theme toggle + persisted preference
- Rich HTML email templates (brand styling)
- Alternate mail transport (Gmail App Password / Postmark fallback)
- Rate limiting / hCaptcha for public forms
- Basic analytics (page + conversion events)
- CI workflow (GitHub Actions) with deploy previews
- Vitest unit test scaffolding + Playwright smoke tests
- Error monitoring integration (Sentry / Logflare)

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

Enjoy building in serverless mode! ⚡
