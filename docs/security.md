# Security

| Concern | Implementation |
| --- | --- |
| Passwords | bcrypt cost 12, timing-equalized verification, never logged |
| Sessions | Auth.js signed HTTP-only cookies (`SameSite=Lax`, `Secure` on HTTPS); DB re-check of user + role each request |
| Authorization / IDOR | Service-layer checks (`services/authz.ts`), org-membership scoping, identical NOT_FOUND for missing vs. forbidden, UUID validation |
| CSRF | Server Actions: Next.js origin checks. Route handlers: explicit same-origin check (`server/http.ts`). Cookies are `SameSite=Lax`. Auth.js has built-in CSRF tokens. |
| Validation | Zod on every input: questionnaire, forms, actions, IDs, enums |
| Status changes | Server-side state machine, no client-controlled transitions |
| Uploads | Extension allowlist + magic-byte sniffing, size limits (15 MB, 25 MB for designs), sanitized names, random storage keys, stored outside `public/`, ownership checked on download |
| Serving uploads | `Content-Disposition`, `nosniff`, `Cache-Control: private, no-store`, and a sandboxed CSP (`default-src 'none'; sandbox`) so uploaded SVG/HTML can't execute |
| Headers | CSP, `X-Frame-Options: DENY`, `frame-ancestors 'none'`, `nosniff`, Referrer-Policy, Permissions-Policy, COOP, HSTS in production (`next.config.ts`) |
| Rate limiting | Login (email + IP), signup, contact, uploads, messages, AI calls (`providers/rate-limit`) |
| Spam | Contact-form honeypot |
| Errors | `AppError` messages only. No stack traces reach users; unexpected errors show a reference digest. |
| Secrets | Environment variables only. `.env*` is gitignored (except `.env.example`). No secrets in client bundles (`server-only` guards server modules). |
| SQL injection | Prisma parameterized queries. The only raw SQL is the test-only truncate helper. |
| Open redirects | `safeRedirectPath` allows only relative paths |
| Seed safety | Refuses in production and refuses to wipe non-demo users without `SEED_FORCE=1` |

## Known limitations and hardening steps

- **Rate limiting is in-memory**, which is fine for one instance. For multiple instances, implement `RateLimiter` with Redis or Upstash.
- **Client IP** comes from `x-forwarded-for`. Only trust it behind a proxy you control.
- **CSP** allows `'unsafe-inline'` scripts because Next.js hydration needs them. A nonce-based CSP in `proxy.ts` is the next hardening step.
- **No email verification or password reset** yet, because they need a real email provider (roadmap Phase 3). Admins can help clients in the meantime.
- **No virus scanning** of uploads. Add it (for example ClamAV or a storage-provider scanner) before accepting files from untrusted parties at scale.
