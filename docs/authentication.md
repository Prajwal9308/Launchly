# Authentication & authorization

## Authentication

- Auth.js v5 with two sign-in methods: **Google** (enabled when `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are set) and email + password (**Credentials**, `server/auth.ts`). Passwords are hashed with bcrypt (cost 12). The password policy is at least 10 characters with a letter and a number.
- Sessions are signed, HTTP-only JWT cookies with a 7-day lifetime. They are `SameSite=Lax`, and `Secure` with the `__Secure-` prefix when served over HTTPS.
- Login verification is timing-equalized. A bcrypt comparison runs even for unknown emails, and error messages don't reveal whether an account exists.
- Login is rate-limited per email and per IP inside `authorize()`, so it covers direct calls to the Auth.js endpoint too. Signups and contact submissions are rate-limited per IP.
- Successful logins update `lastLoginAt` and record a `CLIENT_LOGIN` or `ADMIN_LOGIN` activity event.
- Redirect targets (`callbackUrl`) are restricted to same-site relative paths (`safeRedirectPath`).

### Google sign-in and account linking

`signInWithOAuth()` (`services/accounts.ts`):

1. A Google account that's already linked signs in as its user.
2. Otherwise Google must report the email as **verified**, or sign-in is refused.
3. If a user with that email already exists, Google is linked to it. For **client** accounts, any existing password is removed. Password signups don't verify email ownership, so this stops someone who registered a victim's email in advance from keeping access (pre-hijacking). Admin passwords are kept, because admins are created only by the owner (`npm run create-admin`).
4. Otherwise a new client account is created with no password. It joins the organization of a converted lead with the same email if one exists. The account is renamed to the business name when the first questionnaire is submitted.

Google-only users have no password. Their Account page says so, and password change is disabled for them.

### Accounts

- Clients sign up at `/signup`. Registration creates `User`, `ClientProfile`, `Organization` (owner membership) and `Business`.
- If the studio converted a lead for that email, the new user joins the existing organization and inherits its draft project.
- Admin accounts come from `ADMIN_EMAILS` (applied only on a Google-verified sign-in; the account's client memberships and any unverified password are removed) or from `npm run create-admin` (or the seed in development). There is no public admin signup.

## Authorization

Roles: `ADMIN` and `CLIENT`. `TEAM_MEMBER` is planned.

Enforcement happens **in the service layer** (`services/authz.ts`), never only in the UI:

- `requireAdmin(actor)`: every studio operation (status changes, tasks, notes, leads, catalog, design uploads, approval requests).
- `requireClient(actor)`: client-only decisions (questionnaire, submit, approve design, request revisions, respond to approvals).
- `assertProjectAccess(tx, actor, projectId)`: admins can access any project. Clients can access a project only if they are a member of its organization. A project that doesn't exist and a project the client doesn't own both return the **same NOT_FOUND error**, so IDs can't be probed. Malformed IDs are rejected before querying.
- Visibility filters: clients never receive `INTERNAL` activity, internal notes, briefs, internal tasks, unshared design drafts or their files, or invite state.

Pages add a second layer. `requireAdminActor()` redirects clients away from `/admin`, and `orNotFound()` renders a not-found page for denied resources. File downloads (`/api/files/[id]`) re-check ownership on every request.

The security test suite (`tests/integration/security.test.ts`) covers each rule.
