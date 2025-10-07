<div align="center">

# ⚡ CF TechLab

Where Creativity Meets Technology — dynamic, data-driven innovation platform for AI tools, immersive experiences & automation.

</div>

---

## 🚀 About CF TechLab

**CF TechLab** is the **technology and innovation division** of Creativity Freaks Group. It serves as a digital playground where creativity meets advanced engineering — transforming imagination into smart, scalable, and intelligent tech solutions.

We focus on **AI-powered tools, automation systems, AR/VR experiences, and creative software development** that empower individuals, startups, and enterprises to innovate faster.

> “CF TechLab bridges the gap between art and algorithms — making technology creative and creativity intelligent.”

This repository contains the public marketing site + dynamic content backend powering: projects, services, testimonials (with moderation), contact intake, and service requests.

---

## 🎯 Mission & Vision

### Mission

To pioneer innovative technologies that make creativity accessible, intelligent, and limitless for everyone.

### Vision

To become a global hub for creative technology innovation, inspiring developers and artists to build the future together.

---

## 💡 Core Focus Areas

1. **AI-Powered Design Tools** – ML-based art, video & creative assistants.
2. **Web & App Development** – Dynamic, user-centric digital platforms.
3. **AR/VR & Game Development** – Immersive 3D + gamified learning.
4. **Automation Systems** – Smart workflow + creative ops optimization.
5. **Creative Engineering R&D** – Experimental blends of design and code.

---

## 🧩 Products & Concept Projects

> Some products are in R&D / roadmap and not fully shipped in this repository.

| Product          | Status            | Description                                                     |
| ---------------- | ----------------- | --------------------------------------------------------------- |
| **FreakFlow**    | Active (internal) | AI-driven design generator; concept reflected in public copy.   |
| **CodeCanvas**   | Prototype         | Smart IDE plugin turning code patterns into visual motifs.      |
| **FreakReality** | Planned           | AR/VR storytelling layer combining audio-motion-art sequencing. |
| **CF NeuralKit** | Planned           | Bundle of generative APIs (design, voice, branding automation). |

---

## 🧬 Services (Operational in App)

- Custom Web & Mobile App Development
- AI Tool Integration & Advisory
- AR/VR & Mixed Reality Solutions
- API Development & Automation Systems
- Smart Creative Software & Tooling
- R&D Consulting & Prototyping

Services are stored in the database (seeded automatically) and delivered dynamically via `/api/content/services`.

---

## 🧠 Team Structure (Model)

| Role                     | Responsibility                                 |
| ------------------------ | ---------------------------------------------- |
| Chief Technology Officer | Oversees innovation & technical direction      |
| AI Engineer              | Builds intelligent creative models & pipelines |
| Software Developer       | Full-stack + platform feature delivery         |
| UI/UX Designer           | Human-centered interface & interaction systems |
| Product Manager          | Scope alignment, roadmap facilitation          |
| QA & Test Engineer       | Ensures stability & regression safety          |
| Creative Engineer        | Bridges art direction with code execution      |

---

## 🏆 Key Achievements (Narrative + Dynamic)

- Dynamic project listing with searchable, paginated API (& admin creation UI)
- Image/file upload pipeline for projects & testimonials (Multer + disk storage)
- Moderated testimonial system (pending → approval → public)
- Automated seed bootstrap (services, projects, testimonials) — idempotent
- Email-capable service request intake (extensible)
- Real-time project count displayed on About page (fetched from API)

> Future marketing stats (downloads, awards) can be wired to real metrics endpoints later.

---

## 🔮 Future Roadmap (Repo Scope)

| Year    | Milestone                                                 |
| ------- | --------------------------------------------------------- |
| 2025 H2 | Add lightweight role-based auth for admin panels          |
| 2026    | Launch CF TechLab Incubator (external submissions portal) |
| 2027    | Expanded multi-region deployment + R&D Center (SG)        |
| 2028    | Open-source “FreakAI” foundational toolkit                |
| 2030    | Global leader in creative AI productivity tooling         |

---

## 🎨 Brand Identity (Design Tokens Inspiration)

- Neon Green `#00FF99`
- Deep Black `#1A1A1A`
- Rebel Red `#FF2E63`
- White `#FFFFFF`
- Tagline: _“Where Creativity Meets Technology”_

Tailwind theme + gradient utilities reflect energy / innovation ethos (see `tailwind.config.ts`).

---

## 🏗️ Architecture Overview

### High-Level

```
┌──────────┐    HTTP/JSON    ┌────────────────┐
│ React UI │  <────────────> │ Express API     │
└──────────┘                 │  (TypeScript)   │
			│                      └────────┬───────┘
			│  fetch() calls                │ Prisma Client
			▼                               ▼
	Dynamic Pages                SQLite (dev) / future Postgres
```

### Key Features

- **Dynamic Content:** Projects, Services, Testimonials served from DB.
- **Moderation:** Testimonials default `approved=false`; admin endpoints approve/delete.
- **File Uploads:** Multer stores assets under `/uploads/{projects|testimonials}` served statically.
- **Pagination & Search:** In-memory filter fallback (SQLite friendly). Easy to swap for full-text search later.
- **Seeding:** One-time seeded content if tables empty via `ensureSeededContent()`.
- **Extensibility:** Add new model to `prisma/schema.prisma` → migrate → store functions → route.

### Stack

| Layer              | Tech                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Frontend           | React 18, Vite, TypeScript, Tailwind, shadcn-style UI, React Router, (React Query optional) |
| Backend            | Express, TypeScript (`tsx` for dev)                                                         |
| Data               | Prisma ORM + SQLite (dev)                                                                   |
| Validation         | Zod                                                                                         |
| Uploads            | Multer (disk)                                                                               |
| Email (extensible) | Nodemailer                                                                                  |

---

## 📦 Project Layout

- `src/` – Frontend UI
  - `components/` marketing + UI primitives
  - `pages/` routed screens (`/projects`, `/admin/projects`, `/admin/testimonials`, etc.)
  - `lib/` utilities (requests, helpers)
- `server/` – Backend API + Prisma + routes
  - `src/store.ts` data access & seeding
  - `src/routes/` REST endpoints (content, testimonial submit, contact, etc.)
  - `prisma/` schema + migrations
  - `uploads/` runtime asset storage (git-ignored except sample)

---

## ⚙️ Quick Start

### 1. Clone & Install

```bash
git clone <YOUR_GIT_URL>
cd CF_TechLab
npm install
```

### 2. Start Backend (in another terminal)

```bash
cd server
npm install
npm run dev   # tsx watch mode (default :4000)
```

### 3. Start Frontend

```bash
npm run dev
```

Visit: http://localhost:8080

> Dev proxy forwards `/api/*` → `http://localhost:4000` (see `vite.config.ts`).

---

## 🔐 Environment Variables

`server/.env` (example):

```env
PORT=4000
DATABASE_URL="file:./dev.db"
MAX_IMAGE_MB=5
# Optional email (if enabling notifications):
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASS=your_pass
SMTP_SECURE=false
MAIL_FROM="CF TechLab <no-reply@example.com>"
```

Root `.env` (optional for deploy differences):

```env
VITE_API_BASE=https://api.example.com
```

---

## 🧪 Development Commands

```bash
# Frontend
npm run dev         # Vite dev server
npm run build       # Production bundle
npm run preview     # Preview production dist
npm run lint        # ESLint
npx tsc --noEmit    # Type-check

# Backend (inside server/)
npm run dev         # tsx watch
npm run build       # tsc compile to dist
npm start           # run compiled build
```

### Prisma

```bash
cd server
npx prisma migrate dev --name <migration_name>
npx prisma studio   # Optional DB browser
```

---

## 🛠️ API Overview (Current)

| Method | Path                                                             | Description                               |
| ------ | ---------------------------------------------------------------- | ----------------------------------------- |
| GET    | `/api/content/services`                                          | List services                             |
| GET    | `/api/content/projects?limit=6`                                  | Limited list (homepage)                   |
| GET    | `/api/content/projects?page=1&pageSize=9&search=ai&category=Web` | Paginated + filter                        |
| POST   | `/api/content/projects`                                          | Create project (JSON or multipart)        |
| GET    | `/api/content/testimonials?batch=1&size=3`                       | Batched approved testimonials             |
| GET    | `/api/content/testimonials/pending`                              | (Admin) list unapproved                   |
| POST   | `/api/content/testimonials/:id/approve`                          | Approve testimonial                       |
| DELETE | `/api/content/testimonials/:id`                                  | Delete testimonial                        |
| POST   | `/api/testimonial-submit`                                        | Public testimonial submission (multipart) |
| POST   | `/api/service-request`                                           | Capture service inquiry                   |
| POST   | `/api/contact`                                                   | (If implemented) contact form message     |

> Authentication: Admin endpoints currently unprotected (development phase). Add header/API key or session later.

### Project Creation (Multipart Example)

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

## ✅ Quality & Tooling

- Type safety end-to-end (TypeScript + Prisma types)
- Zod validation on incoming payloads
- Accessible component primitives (shadcn-style)
- Tailwind utility-first theming
- Potential next step: CI (GitHub Actions) for lint + type + build

---

## 🧭 Customization Checklist

- [ ] Update branding assets (logo, social preview)
- [ ] Adjust gradient + accent colors in `tailwind.config.ts`
- [ ] Replace seeded content with real production data
- [ ] Add authentication middleware for admin routes
- [ ] Configure image CDN / object storage (S3 / Cloudflare R2) if scaling
- [ ] Add monitoring / logging (pino, OpenTelemetry) for backend

---

## 🤝 Contributing

PRs welcome. Please:

1. Branch from `main`
2. Run lint + type-check
3. Include screenshots / notes for UI changes

Potential improvements you can help with:

- Authorization layer
- Postgres migration path
- Image optimization pipeline
- E2E tests (Playwright / Cypress)

---

## 📄 License & Contact

No license file yet — all rights reserved by default. Request a license or ask to add MIT if open-sourcing is intended.

For collaboration, consulting, or partnership inquiries: **(Add preferred contact channel)**

---

## 💬 Founder’s Note

> “CF TechLab is more than a tech division — it’s a revolution. We are redefining how art, code, and intelligence coexist. The future of creativity is intelligent, and we’re building it.”  
> — **Hridoy Chandra Sarker**, Founder & CEO

---

## 🙌 Acknowledgements

- Prisma, Vite, Tailwind, shadcn/ui inspiration
- Early adopters & testers providing feedback

---

Made with focus on performance, accessibility & creative engineering. ⚡
