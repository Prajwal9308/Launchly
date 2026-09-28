# Architecture

```
app/          Routes (App Router). Thin: resolve the session, call services, render.
  (marketing) Public website            (auth) Login/signup
  (onboarding) Questionnaire            dashboard/ Client portal
  admin/      Studio admin              api/  Auth.js + file upload/download
components/   UI. ui/ = design-system primitives; marketing/, app/, project/, admin/, client/, onboarding/
domain/       Pure business rules with no I/O: status machine, progress, questionnaire schema,
              requirements/summary, task templates, file validation, next actions
services/     Business logic that uses the database. Every function takes an explicit `actor`
              and enforces authorization itself (services/authz.ts).
server/       Next.js glue: Auth.js config, session helpers, server actions, route guards
providers/    Swappable integrations: storage, email, AI, rate limiting, payments (interface only)
db/           Prisma client + generated types (db/generated is gitignored)
prisma/       Schema, migrations, seed
content/      Static marketing copy (FAQ, process, sample testimonials)
tests/        unit/, integration/, e2e/
```

## Request flow

1. `proxy.ts` makes an *optimistic* redirect for `/admin`, `/dashboard` and `/start-project/*` when there's no session. It is not a security boundary.
2. Pages call `requireClientActor()` or `requireAdminActor()` (`server/session.ts`). These load the user **from the database** on every request, so a deleted user or changed role takes effect immediately.
3. Pages and server actions call **services** with that actor. Services validate input with Zod, check permissions, run the change in a transaction, record activity and create notifications.
4. Server actions wrap results in `ActionResult` (`server/action.ts`). Known `AppError`s become safe messages. Anything unexpected is logged on the server and shown as "Something went wrong."

Because authorization lives in services and not in components, the same rules apply whether a call comes from a page, a server action, a route handler, or a test.

## Rendering

- Pages are Server Components. Client Components are used only for interactivity: the questionnaire, dialogs, uploads, the notification bell and navigation.
- DB-backed layouts call `connection()`, so builds never need a live database and content is always current.
- `server/loaders.ts` uses React `cache()` so a layout and its page share one project query per request.

## Providers

| Provider | Interface | Implementations |
| --- | --- | --- |
| Storage | `providers/storage/types.ts` | Local filesystem (outside `public/`) |
| Email | `providers/email/index.ts` | Console (logs only) + plain-text templates |
| AI | `providers/ai/types.ts` | `none` (default), Anthropic (`claude-opus-5`, structured output) |
| Rate limiting | `providers/rate-limit/index.ts` | In-memory fixed window |
| Payments | `providers/payments/index.ts` | Interface only (not implemented) |

## Future AI capabilities

`AIProvider` currently implements `generateProjectBrief()`. Future methods (sitemap suggestions, copy drafts, revision summaries) should follow the same rules:

- inputs are limited to client-provided requirement rows
- outputs use a structured schema
- results are stored and labelled `aiGenerated`
- nothing is published to clients without studio review

## Visual design system

The UI is a dark, spatial design driven by tokens in `app/globals.css`:

- **Depth levels:** atmosphere (`components/app/atmosphere.tsx`) → 3D → `glass-recessed` → `glass` → `glass-elevated`. `glass-overlay` is used for menus and dialogs. `Card` takes `level="recessed" | "default" | "elevated"`.
- **3D:** only the homepage hero uses WebGL (`components/marketing/hero-scene.tsx`, `three` + `@react-three/fiber`, no drei). `hero-stage.tsx` loads it lazily after the page is interactive, and only on desktop-class devices without reduced motion. It pauses when off-screen or when the tab is hidden, and falls back to a CSS orb.
- **Interaction:** `components/ui/tilt.tsx` (cursor tilt and highlight) and pointer parallax in the atmosphere and hero. Both are disabled on touch devices and with `prefers-reduced-motion`.
- **Data visualization:** `components/admin/pipeline-chart.tsx` charts real project counts per stage (single series, hover tooltips, accessible table). `components/project/progress-ring.tsx` shows derived progress.
