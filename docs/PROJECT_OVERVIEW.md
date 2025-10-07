# Project Deep Overview

This document expands on the concise engineering README with deeper reasoning, potential evolution paths, and internal decision trade‑offs.

## 1. Data Model Summary

| Model          | Purpose                       | Notes                                       |
| -------------- | ----------------------------- | ------------------------------------------- |
| Service        | Marketing services listing    | Seeded initially; editable future admin UI  |
| Project        | Portfolio / case study items  | Supports external URL + image upload or URL |
| Testimonial    | Client feedback               | Gated by `approved` flag (moderation)       |
| ServiceRequest | Inbound service inquiry form  | Potential future pipeline integration       |
| ContactMessage | General contact form messages | Basic capture (spam filtering TBD)          |

## 2. Seeding Strategy

- Implemented lazily: first request to content routes triggers `ensureSeededContent()`.
- Safer for serverless cold starts vs. running migrations inline.
- Production alternative: explicit bootstrap phase in CI/CD or migration hook.

## 3. Search & Filtering

- Current solution: Fetch full project list then in-memory filter (SQLite limitation for flexible LIKE + case insensitivity across multiple fields gracefully).
- Future: Move to Postgres + use `ILIKE` or trigram / full-text index.

## 4. File Upload Handling

- Multer disk storage → relative `/uploads/...` path stored in DB.
- Pros: Simple; no external dependencies.
- Cons: Not horizontally scalable; ephemeral if deployed to stateless containers.
- Upgrade path: Swap to S3/R2 adapter, store object key, serve via CDN.

## 5. Moderation Flow Rationale

- Testimonials can be user-generated; gating prevents spam / malicious content.
- Approve / delete endpoints kept minimal; no audit log yet.
- Potential enhancement: `approvedAt`, `approvedBy` columns.

## 6. API Versioning & Extensibility

- Current unversioned path: `/api/content/*`.
- Introduce `/api/v1/...` once interfaces stabilize.
- Add openapi.yaml generation (zod-to-openapi) for contract clarity.

## 7. Auth Roadmap

| Phase | Approach                    | Notes                                         |
| ----- | --------------------------- | --------------------------------------------- |
| 1     | API key in header for admin | Simple, stateless                             |
| 2     | Session (JWT or cookie)     | Needed if multiple roles                      |
| 3     | Role-based (RBAC)           | Map operations to roles (approve/delete/seed) |
| 4     | Fine-grained audit          | Log all moderation actions                    |

## 8. Error Handling Standard

```json
{ "error": "slug", "message": "Optional description" }
```

- Avoid leaking stack traces.
- Client may key off `error` for UI flows (`create_project_failed`, etc.).

## 9. Performance Considerations

- Current dataset small → O(n) filtering acceptable.
- Add pagination to `/testimonials` if volume grows (cursor or offset).
- Consider caching layer if read-heavy (Redis) post-Postgres migration.

## 10. Deployment Suggestions

| Layer    | Recommendation                                      |
| -------- | --------------------------------------------------- |
| Frontend | Static host (Vercel / Netlify)                      |
| Backend  | Fly.io / Render / Railway or small VPS              |
| DB       | SQLite dev → Postgres managed (Neon, Supabase, RDS) |
| Assets   | S3 / R2 with cache-control headers                  |

## 11. Observability (Future)

- Add pino logger + request IDs.
- Expose `/health` and `/metrics` (Prometheus format) endpoints.
- Optionally integrate Sentry for frontend & backend error telemetry.

## 12. Testing Strategy Proposal

| Layer  | Tool                                   | Scope                                               |
| ------ | -------------------------------------- | --------------------------------------------------- |
| Unit   | Vitest / Jest                          | Pure functions (utils, formatters)                  |
| API    | Supertest                              | Route-level validation & status codes               |
| E2E    | Playwright                             | User flows (submit testimonial → approve → visible) |
| Visual | Chromatic (if component lib extracted) | UI regressions                                      |

## 13. Accessibility & UX

- Uses semantic structure + accessible primitives (Radix-inspired components).
- Add axe-core CI scan later.
- Provide alt text & ARIA labels for interactive controls where needed.

## 14. Internationalization (Optional)

- Not implemented yet; architecture ready to wrap text nodes.
- Add `i18n/` with translation JSON + context provider.

## 15. Migration to Postgres Steps

1. Add new connection string.
2. Create new migration baseline (or introspect existing schema).
3. Deploy Postgres instance.
4. Run prisma migrate deploy.
5. Validate queries for case-insensitive search (use `ilike`).
6. Remove in-memory filtering.

## 16. Security Hardening Ideas

- Helmet middleware for headers.
- Rate limiting on public POST endpoints.
- File type magic-byte validation (not only mimetype).
- Virus scan integration (clamd) if public-facing scale.

## 17. Future Innovation Hooks

- Webhooks on project create (notify marketing Slack).
- Event bus abstraction for decoupling side effects (email pipeline, analytics).
- GraphQL façade layering (optional) if API consolidation desired.

## 18. Glossary

| Term             | Meaning                                                 |
| ---------------- | ------------------------------------------------------- |
| Seed             | Initial dataset automatically inserted if tables empty  |
| Moderation       | Manual approval workflow for user-submitted content     |
| In-memory search | Filtering performed in application layer rather than DB |

---

Maintained as a living architectural reference. Update when adopting auth, moving to Postgres, or adding major surface areas.
