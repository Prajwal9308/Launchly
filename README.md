# PrimeTechLabs

PrimeTechLabs is a web and mobile app development studio. This repository is its business platform in one Next.js app:

- **Public website.** Home, services, solutions, process, about, contact, pricing, FAQ, privacy and terms. A work page (`/portfolio`) appears only once real, non-sample projects are published.
- **Client portal.** Clients create an account, fill in a multi-step project questionnaire that saves as they go, and upload assets. From there they follow their project, send messages, review designs, request revisions and explicitly approve work.
- **Studio admin.** Manage leads, clients, projects, tasks, requirements, files, messages, design versions, approvals, internal notes, services, pricing, portfolio and settings. Every important action is recorded in an activity timeline.

The core workflow is: lead → account → questionnaire → project created (requirements, tasks, brief, notifications) → requirements review → discovery → design → client review ⇄ revision → development → testing → final approval → launch → maintenance.

> All seeded data (businesses, sample portfolio items) is **fictional**, for development only, and never shown on the public site.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions, `proxy.ts`) |
| Language | TypeScript (strict) |
| UI | Tailwind CSS v4 light design system (three surface levels, one accent), shadcn-style components on Radix primitives, lucide icons, Inter |
| Database | PostgreSQL + Prisma 7 (`@prisma/adapter-pg`) |
| Auth | Auth.js v5: Google sign-in + email/password (bcrypt), JWT session cookie |
| Validation | Zod 4 |
| Tests | Vitest (unit + integration against a real database), Playwright (E2E) |
| Optional AI | Anthropic SDK behind a provider interface (off by default) |

## Getting started

### Prerequisites

- Node.js 20.9+ (developed on Node 26)
- PostgreSQL 14+ (developed on 17)

### 1. Install

```bash
npm install          # also runs `prisma generate`
```

npm 11 may ask you to approve install scripts for `prisma`, `@prisma/engines`, `esbuild` and `unrs-resolver`. The approvals are already recorded under `allowScripts` in `package.json`.

### 2. Create databases

```sql
CREATE ROLE launchly WITH LOGIN PASSWORD 'launchly_dev' CREATEDB;
CREATE DATABASE launchly OWNER launchly;       -- development
CREATE DATABASE launchly_test OWNER launchly;  -- Vitest (truncated by tests)
CREATE DATABASE launchly_e2e OWNER launchly;   -- Playwright (reseeded each run)
```

### 3. Environment variables

```bash
cp .env.example .env
openssl rand -base64 32   # paste into AUTH_SECRET
```

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `AUTH_SECRET` | yes | Secret used to sign session cookies |
| `AUTH_URL`, `APP_URL` | yes | Public URL of the app (used for auth and email links) |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | no | Enables "Continue with Google" (see `docs/deployment.md`) |
| `ADMIN_EMAILS` | no | Emails that become admins on first Google-verified sign-in |
| `AI_PROVIDER` | no | `none` (default) or `anthropic` |
| `AI_API_KEY`, `AI_MODEL` | no | API key and optional model override for the AI provider |
| `STORAGE_PROVIDER` | no | `local` (default) or `vercel-blob` (private Vercel Blob; needs `BLOB_READ_WRITE_TOKEN`) |
| `STORAGE_LOCAL_DIR` | no | Upload directory for local storage (default `./storage/uploads`) |
| `STORAGE_BUCKET`, `STORAGE_ENDPOINT` | no | Reserved for S3-compatible providers |
| `EMAIL_PROVIDER` | no | `console` (default): emails are written to the server log |
| `EMAIL_FROM` | no | From address for future email providers |
| `SEED_DEV_PASSWORD` | no | Password for seeded demo accounts |
| `TEST_DATABASE_URL`, `E2E_DATABASE_URL` | no | Override the test databases |

### 4. Migrations and seed data

```bash
npm run db:migrate   # apply migrations (development)
npm run db:seed      # reset and load fictional demo data
```

The seed **deletes application data**. It won't run when `NODE_ENV=production`, and it stops if the database contains non-demo users (set `SEED_FORCE=1` to override).

**Development logins** (development only, password from `SEED_DEV_PASSWORD`, default `Launchly-dev-2026`):

| Role | Email |
| --- | --- |
| Admin | `admin@example.com` |
| Client (Northstar Plumbing, design awaiting review) | `client@example.com` |
| Other demo clients | `bella@`, `maple@`, `urbanglow@`, `harbor@example.com` |

### 5. Run locally

```bash
npm run dev          # http://localhost:3000 (or: npx next dev -p 3210)
```

- Public site: `/`
- Client portal: `/dashboard`
- Admin: `/admin`

## Testing

```bash
npm run typecheck
npm run lint
npm test             # Vitest: unit + integration (uses launchly_test, migrated automatically)
npm run test:e2e     # Playwright: migrates and seeds launchly_e2e, builds, starts on :3211
```

- **Unit tests** (`tests/unit`) cover the status machine, progress, questionnaire validation, task templates, upload validation, requirement and summary generation, next actions, the rate limiter and redirect safety.
- **Integration tests** (`tests/integration`) call the service layer against a real PostgreSQL database. They cover authentication, project creation and submission, tasks, messages, design review, revision, approvals, launch, leads, and a dedicated **security suite**: cross-client access, file downloads, admin-only operations, IDOR probes and spoofed uploads.
- **E2E** (`tests/e2e`) runs the full happy path: visit site → sign up → questionnaire → upload → submit → admin review → tasks → design upload → client revision → v2 → client approval → activity. It also includes a cross-client access check and a mobile smoke test.

First run: `npx playwright install chromium`.

## Deploying

Vercel + Neon + Vercel Blob with Google sign-in: step by step in [`docs/deployment.md`](docs/deployment.md).

The GitHub repository is connected to Vercel: every push to `main` deploys to production (migrations run automatically), and pushes to other branches create preview deployments.

## Production build

```bash
npm run build
npm run db:deploy    # apply migrations
npm start
```

See [`docs/deployment.md`](docs/deployment.md).

## Documentation

- [Architecture](docs/architecture.md)
- [Database](docs/database.md)
- [Authentication & authorization](docs/authentication.md)
- [Project workflow](docs/project-workflow.md)
- [Security](docs/security.md)
- [Deployment](docs/deployment.md)
- [Roadmap](docs/roadmap.md)

## What is intentionally not built yet

These are labelled "Coming soon" in the app or documented in the roadmap. None are faked:

- Payments and invoices: only a `PaymentProvider` interface exists.
- Real email delivery: only the console provider exists.
- S3/R2/Supabase storage: local disk and private Vercel Blob are implemented.
- AI website generation.
