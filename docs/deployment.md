# Deployment

The recommended setup is **Vercel** (hosting) with **Neon** (PostgreSQL) and **Vercel Blob** (private file storage). All three have free tiers. The app also runs on any Node.js host with PostgreSQL and a persistent disk (Railway, Render, a VPS) using `STORAGE_PROVIDER=local`.

## Vercel

1. **Import the repo.** (Done for this project: pushes to `main` deploy automatically.) In Vercel, choose *Add New → Project*, then import the GitHub repository. Framework: Next.js (detected). Vercel runs the `vercel-build` script, which applies database migrations and then builds.
2. **Database.** In the project, go to *Storage → Create → Neon (Postgres)*, then connect it. This sets `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct; used for migrations).
3. **File storage.** Go to *Storage → Create → Blob*, then connect it. This sets `BLOB_READ_WRITE_TOKEN`. Files are stored as **private** blobs and are only served through `/api/files/[id]` after a permission check.
4. **Environment variables** (*Settings → Environment Variables*, Production):

   | Name | Value |
   | --- | --- |
   | `AUTH_SECRET` | output of `openssl rand -base64 32` |
   | `APP_URL` | `https://your-domain` (used in email links) |
   | `STORAGE_PROVIDER` | `vercel-blob` |
   | `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | from Google (below) |
   | `EMAIL_PROVIDER` | `console` (until a real provider is added) |
   | `ADMIN_EMAILS` | your Google email (comma-separate several) |
   | `PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK` | `1`. Neon's pooler can leave Prisma's migration lock held (error P1002). Safe because Vercel runs one production build at a time. |

   `AUTH_URL` isn't needed on Vercel.
5. **Deploy.** Each build applies migrations (`prisma migrate deploy`) and then runs `prisma/bootstrap.ts`. On a brand-new database, the bootstrap adds the default services, unpriced packages and labelled sample portfolio items **once**. Later edits and deletions are never overwritten.
6. **Make yourself admin.** Sign in on the live site with Google using an email listed in `ADMIN_EMAILS`. Promotion only happens for Google-verified sign-ins, never for password signups. Alternatively, run `scripts/create-admin.ts` against the production database (`npx tsx --env-file=<file with DATABASE_URL> scripts/create-admin.ts you@yourdomain.com`).
7. **Set up the site.** In *Admin → Settings*, enter your business name and contact details. In *Services / Pricing*, set prices. Replace the sample portfolio and testimonials (`content/testimonials.ts`). **Never run the seed against production.**

### Google sign-in

1. Open [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials).
2. *OAuth consent screen*: choose External, and enter the app name, support email and your domain. Scopes: `email`, `profile`, `openid`. Publish the app so any Google user can sign in.
3. *Create credentials → OAuth client ID → Web application*:
   - Authorized JavaScript origins: `https://your-domain`
   - Authorized redirect URIs: `https://your-domain/api/auth/callback/google`
   - Add `http://localhost:3000` and `http://localhost:3000/api/auth/callback/google` too if you want Google sign-in locally.
4. Copy the client ID and secret into `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`, then redeploy.

If these variables aren't set, the Google button simply doesn't appear and email + password login keeps working.

### Vercel limitations

- **Uploads are limited to 4 MB per file**, because Vercel caps request bodies at about 4.5 MB. The UI shows this limit. For larger files, switch to direct-to-storage uploads (roadmap), or host on Railway or Render with a persistent disk.
- **Rate limiting is in-memory per instance**, so it's weaker on serverless. For stronger limits, implement `RateLimiter` with Upstash Redis.

## Other hosts (Railway, Render, VPS)

1. Provision PostgreSQL and set `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL` and `APP_URL` (your HTTPS domain).
2. `npm ci && npm run db:deploy && npm run build && npm start`.
3. Use `STORAGE_PROVIDER=local` with `STORAGE_LOCAL_DIR` on a persistent, backed-up volume.

## Email

Real email goes through **Resend** (`EMAIL_PROVIDER=resend`, `RESEND_API_KEY`):

- `STUDIO_NOTIFY_EMAIL`: the inbox for studio emails (new projects, client messages, revisions, approvals, contact-form enquiries). In-app notifications still go to every admin.
- `EMAIL_REPLY_TO`: replies to any app email land here.
- `EMAIL_FROM`: must use a domain you've verified in Resend. Until you have one, use `Launchly <onboarding@resend.dev>`, but Resend's test sender **only delivers to the email you signed up to Resend with**. Studio emails to that inbox work; client emails don't until a domain is verified.
- A personal Outlook/Hotmail address can't be the sender. Microsoft no longer allows password-based SMTP for personal accounts, and sending services only send from domains you own. Use it as `EMAIL_REPLY_TO` and `STUDIO_NOTIFY_EMAIL` instead.

## AI

- **AI (optional):** set `AI_PROVIDER=anthropic` and `AI_API_KEY`. `AI_MODEL` defaults to `claude-opus-5`.

## Operations

- Serve over HTTPS so session cookies are `Secure` (Vercel does this automatically).
- Back up the database (Neon has point-in-time restore) and file storage.
