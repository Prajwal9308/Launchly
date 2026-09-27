# Roadmap

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Agency website + client portal + project management, design review, approvals | **Built** |
| 2 | Invoices and payments (deposit, milestone, final, subscriptions) via `PaymentProvider` (Stripe). Card data is never stored. | Interface only |
| 3 | Email notifications (welcome, project received, new message, design ready, revision requested, approved, launched), email verification, password reset | Templates + console provider built; real provider pending |
| 4 | Hosting/deployment integrations (domains, DNS, deploy status) | Planned |
| 5 | AI project briefs | Built (optional, off by default) |
| 6 | AI-assisted content: sitemap suggestions, copy drafts, revision summaries, always studio-reviewed | Planned (`AIProvider` extension points) |
| 7 | AI-assisted website generation from structured requirements | Planned; not in MVP |
| 8 | Maintenance subscriptions + support tickets | Planned |
| 9 | Multi-tenant SaaS for other freelancers/agencies (the `Organization` model and service-layer authz are the foundation) | Exploratory |

Near-term improvements:

- `TEAM_MEMBER` role
- S3/R2 storage
- Redis rate limiting
- Nonce-based CSP
- Invite links for converted leads
- Real-time message updates
