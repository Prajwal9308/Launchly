# Project workflow

## Statuses

`DRAFT` (questionnaire in progress, pre-submission) → `NEW` → `INFORMATION_REQUIRED` / `REQUIREMENTS_REVIEW` → `DISCOVERY` → `DESIGN` → `CLIENT_REVIEW` ⇄ `REVISION` → `DEVELOPMENT` → `TESTING` → `CLIENT_APPROVAL` → `READY_TO_LAUNCH` → `LAUNCHED` → `MAINTENANCE` → `COMPLETED`. There are also `ON_HOLD` (resumes to the previous status) and `CANCELLED` (terminal).

Allowed transitions are defined in `domain/project-status.ts` and enforced by `transitionProjectStatus()`, the only code that changes status. Every change records `STATUS_CHANGED` activity and notifies the client. `DRAFT → NEW` only happens through submission.

## Automation

| Trigger | What happens |
| --- | --- |
| Client starts a project | A `DRAFT` project is created, prefilled from the business, with a `PROJECT_CREATED` activity. The existing draft is reused if there is one. |
| Questionnaire step saved | Step validated (lenient) and stored. Autosaves 1.5s after typing, and on step change. |
| **Submit** | One transaction: strict validation → business updated → status `NEW` → requirement rows → requested services → **tasks from templates** (base + e-commerce/SEO/booking/blog) → system summary brief → `PROJECT_SUBMITTED` activity → admin notifications ("New project request") → emails. The client sees the confirmation page. |
| Admin approves requirements | "Review requirements" task done → `DISCOVERY`. |
| Admin requests information | Message sent → `INFORMATION_REQUIRED` → client action "We need a few more details". |
| Design uploaded + review requested | New version (v1, v2…). Earlier unapproved versions become `SUPERSEDED`. → `CLIENT_REVIEW`. Client notified ("Your design is ready for review"). The homepage task is completed. |
| Client requests changes | `RevisionRequest` created → review `CHANGES_REQUESTED` → project `REVISION` → admin notified. |
| Client approves design | Requires an explicit confirmation checkbox. Creates an `Approval` (`DESIGN_APPROVAL`, version label, approver, timestamp, comment) and `DESIGN_APPROVED` activity. |
| Admin requests final approval | Pending `FINAL_APPROVAL` → `CLIENT_APPROVAL`. |
| Client approves final | → `READY_TO_LAUNCH`, client-approval task done. If they request changes instead → `REVISION`. |
| Admin marks launched | → `LAUNCHED`, launch task done, client emailed. |

Opening a page never counts as approval. Every approval is an explicit, recorded action.

## Progress

`calculateProgress()` (`domain/progress.ts`) returns the greater of phase progress and task completion. It is capped at 99% until launch, and is 100% once launched or completed. Nothing is hard-coded.

## Next actions

`domain/next-action.ts` derives:

- the **client action center**: continue questionnaire, review design, approve, provide information, read messages, or "no action needed"
- the **admin next action** shown on project lists and detail pages
