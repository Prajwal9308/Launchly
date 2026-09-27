# Deployment

Launchly is a standard Next.js Node.js app with PostgreSQL.

## Checklist

1. Provision PostgreSQL and set `DATABASE_URL`.
2. Set `AUTH_SECRET` (`openssl rand -base64 32`), `AUTH_URL` and `APP_URL` to your HTTPS domain.
3. `npm ci`. This runs `prisma generate`.
4. `npm run db:deploy`. This applies migrations. **Never run the seed in production.**
5. `npm run build && npm start`. The build doesn't need database access.
6. Create your admin user:
   ```bash
   node -e "require('bcryptjs').hash(process.argv[1],12).then(console.log)" 'your-strong-password'
   ```
   Then insert it:
   ```sql
   INSERT INTO "User" (id, email, "passwordHash", "firstName", "lastName", role, "updatedAt")
   VALUES (gen_random_uuid(), 'you@yourdomain.com', '<hash>', 'Your', 'Name', 'ADMIN', now());
   ```
7. In **Admin → Settings**, set your business name, contact email and phone. In **Admin → Services / Pricing**, set prices; packages without a price show "Let's discuss your project". Replace the sample portfolio and testimonials (`content/testimonials.ts`) with real, permission-granted content.

## File storage

The `local` provider writes to `STORAGE_LOCAL_DIR`. On a single server with a persistent disk, point it at a mounted volume and back it up.

For serverless or multi-instance hosting (for example Vercel), implement `StorageProvider` (`put`, `get`, `delete`) for S3, Cloudflare R2 or Supabase Storage, and select it in `providers/storage/index.ts` using `STORAGE_PROVIDER`, `STORAGE_BUCKET` and `STORAGE_ENDPOINT`. Keep objects private; downloads always go through `/api/files/[id]` for authorization.

## Email

`EMAIL_PROVIDER=console` logs emails. To send real email, implement `EmailProvider` for Resend, Postmark, SendGrid or SMTP. Templates are in `providers/email/templates.ts`.

## AI (optional)

Set `AI_PROVIDER=anthropic` and `AI_API_KEY`. `AI_MODEL` defaults to `claude-opus-5`. Admins then see **Generate AI brief** on projects. Briefs use only the client's answers, run on server-side model fallback, and are labelled AI-generated.

## Operations

- Put the app behind HTTPS so session cookies are `Secure`.
- For multiple instances, replace the in-memory rate limiter (see `security.md`).
- Back up PostgreSQL and the upload storage.
