# Database

PostgreSQL via Prisma 7. The schema is in `prisma/schema.prisma`. The connection URL comes from `prisma.config.ts`, and the client uses the `pg` driver adapter. All IDs are UUIDs, except `Project.number`, a human-friendly sequence displayed as `P-0001`.

## Models

| Model | Purpose |
| --- | --- |
| `User` | Admins and clients (`role`). bcrypt `passwordHash`; never plaintext. |
| `Account`, `Session` | Reserved for Auth.js OAuth/database sessions. Credentials login uses JWT cookies. |
| `Organization`, `OrganizationMember` | The client account. **Projects belong to organizations; access is via membership.** `inviteEmail` links a converted lead to a future signup. |
| `ClientProfile` | Client contact details (phone). |
| `Business` | The client's business details, updated from the questionnaire. |
| `Lead` | Contact-form submissions and their status. Links to the org/project when converted. |
| `Project` | Status, questionnaire JSON (validated by `domain/questionnaire.ts`), budget, dates, `lastActivityAt`. |
| `ProjectRequirement` | Readable requirement rows. `source` is `questionnaire` or `admin`. |
| `ProjectService` | Services the client requested. |
| `ProjectTask` | Tasks. `templateKey` links to `domain/task-templates.ts`; `clientVisible` hides internal tasks. |
| `ProjectFile` | File **metadata** only. Bytes live in the storage provider (`storageKey`). |
| `ProjectMessage` | Project messages. `readAt` is set when the other side reads it. |
| `DesignReview` | Design versions, unique on `(projectId, title, version)`. Status: DRAFT → IN_REVIEW → CHANGES_REQUESTED / APPROVED / SUPERSEDED. |
| `RevisionRequest` | Client change requests (OPEN/RESOLVED). |
| `Approval` | DESIGN/FINAL/LAUNCH approvals: who, when, which version, comment. |
| `ProjectBrief` | System summary (client answers only) and optional AI briefs (`aiGenerated`, `generator`). |
| `InternalNote` | Studio-only notes. |
| `ActivityEvent` | Audit trail. `visibility` is `CLIENT` or `INTERNAL`. |
| `Notification` | In-app notifications per user. |
| `Service`, `PricingPackage`, `PortfolioItem`, `SiteSettings` | Public-site content, editable in admin. |

Indexes cover the common access paths: project by organization and status/activity, tasks by project/status/due date, messages and activity by project/time, and notifications by user/read state.

## Commands

```bash
npm run db:migrate   # create/apply migrations in development
npm run db:deploy    # apply migrations in production
npm run db:seed      # reset + seed fictional demo data (dev only)
npm run db:studio    # browse data
```

## Planned models (not built)

`Invoice`, `Payment`, `MaintenancePlan`, `SupportTicket`, `Subscription`. See `roadmap.md`.
