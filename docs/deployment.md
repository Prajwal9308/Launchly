# Deployment

The recommended setup is **Vercel** (hosting) with **Neon** (PostgreSQL) and **Vercel Blob** (private file storage). All three have free tiers. The app also runs on any Node.js host with PostgreSQL and a persistent disk (Railway, Render, a VPS) using `STORAGE_PROVIDER=local`.

## Vercel

1. **Import the repo.** In Vercel, choose *Add New → Project*, then import the GitHub repository. Framework: Next.js (detected). Vercel runs the `vercel-build` script, which applies database migrations and then builds.
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

   `AUTH_URL` isn't needed on Vercel.
5. **Deploy.** The first build creates the database tables.
6. **Make yourself admin.** Sign in on the live site with Google (this creates a client account), then run this on your machine:
   ```bash
   npx vercel env pull .env.production.local   # downloads production env vars
   npx tsx --env-file=.env.production.local scripts/create-admin.ts you@yourdomain.com
   ```
   (Add a password as a second argument to create a password admin instead.)
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

## Email and AI

- **Email:** `EMAIL_PROVIDER=console` only logs emails. To send real email, implement `EmailProvider` (Resend, Postmark, SendGrid, SMTP). Templates are in `providers/email/templates.ts`.
- **AI (optional):** set `AI_PROVIDER=anthropic` and `AI_API_KEY`. `AI_MODEL` defaults to `claude-opus-5`.

## Operations

- Serve over HTTPS so session cookies are `Secure` (Vercel does this automatically).
- Back up the database (Neon has point-in-time restore) and file storage.
