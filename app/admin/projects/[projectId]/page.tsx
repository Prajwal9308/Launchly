import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import { SectionTitle } from "@/components/app/page-header";
import { GenerateBriefButton } from "@/components/admin/brief-panel";
import { ProjectProgress } from "@/components/project/project-progress";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SUMMARY_LABELS } from "@/domain/requirements";
import { formatDate, formatDateTime } from "@/lib/format";
import { isAIEnabled } from "@/providers/ai";
import { getAdminProjectExtras } from "@/services/project-queries";
import { orNotFound } from "@/server/guards";
import { loadProjectDetail } from "@/server/loaders";
import { requireAdminActor } from "@/server/session";

function BriefContent({ content }: { content: Record<string, unknown> }) {
  // jsonb doesn't preserve key order, so render known fields in a fixed order first.
  const known = Object.keys(SUMMARY_LABELS).filter((k) => k in content);
  const extra = Object.keys(content).filter((k) => !(k in SUMMARY_LABELS)).sort();
  const entries = [...known, ...extra]
    .map((k) => [k, content[k]] as const)
    .filter(([, v]) => (Array.isArray(v) ? v.length : Boolean(v)));
  return (
    <dl className="space-y-3">
      {entries.map(([key, value]) => (
        <div key={key}>
          <dt className="text-xs font-medium text-faint">{SUMMARY_LABELS[key as keyof typeof SUMMARY_LABELS] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}</dt>
          <dd className="mt-0.5 text-sm leading-relaxed">{Array.isArray(value) ? value.join(", ") : String(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function AdminProjectOverview({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const actor = await requireAdminActor();
  const [project, extras] = await Promise.all([orNotFound(loadProjectDetail(actor, projectId)), getAdminProjectExtras(actor, projectId)]);
  const systemBrief = extras.briefs.find((b) => !b.aiGenerated);
  const aiBrief = extras.briefs.find((b) => b.aiGenerated);
  const doneTasks = project.tasks.filter((t) => t.status === "DONE").length;
  const members = project.organization.members.map((m) => m.user);

  return (
    <div className="space-y-6">
      {project.status === "DRAFT" && (
        <Alert tone="info" title="Waiting for the client to submit the questionnaire">
          {extras.inviteEmail
            ? `The client hasn't created an account yet. An invitation was sent to ${extras.inviteEmail}.`
            : "The client has started the questionnaire but hasn't submitted it."}
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardContent>
              <p className="text-xs font-medium uppercase tracking-wider text-faint">Next action</p>
              <p className="mt-1 text-base font-semibold">{project.adminNextAction}</p>
              <div className="mt-4 flex items-center gap-3">
                <Progress value={project.progress} className="flex-1" label="Project progress" />
                <span className="text-sm tabular-nums text-muted">{project.progress}%</span>
              </div>
              <p className="mt-2 text-xs text-faint">
                {doneTasks} of {project.tasks.length} tasks complete
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <SectionTitle icon={Icons.document} action={isAIEnabled() && project.status !== "DRAFT" ? <GenerateBriefButton projectId={project.id} /> : undefined}>Project brief</SectionTitle>
              {systemBrief ? (
                <>
                  <p className="mb-4 text-xs text-faint">Assembled from the client&apos;s questionnaire answers only.</p>
                  <BriefContent content={systemBrief.content as Record<string, unknown>} />
                  {!isAIEnabled() && (
                    <p className="mt-5 border-t border-border pt-3 text-xs text-faint">
                      Optional AI briefs are not configured. Set AI_PROVIDER and AI_API_KEY to enable them.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted">The brief is generated when the client submits the questionnaire.</p>
              )}
            </CardContent>
          </Card>

          {aiBrief && (
            <Card>
              <CardContent>
                <SectionTitle icon={Icons.ai} action={<Badge tone="accent">AI-generated</Badge>}>AI brief</SectionTitle>
                <p className="mb-4 text-xs text-faint">
                  Generated {formatDateTime(aiBrief.createdAt)} by {aiBrief.generator}. Based only on client-provided answers — verify before use.
                </p>
                <BriefContent content={aiBrief.content as Record<string, unknown>} />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent>
              <SectionTitle icon={Icons.account}>Client</SectionTitle>
              {members.length ? (
                <ul className="space-y-3">
                  {members.map((u) => (
                    <li key={u.id} className="text-sm">
                      <Link href={`/admin/clients/${project.organization.id}`} className="font-medium hover:underline">
                        {u.firstName} {u.lastName}
                      </Link>
                      <a href={`mailto:${u.email}`} className="mt-1 flex items-center gap-2 text-muted hover:text-foreground">
                        <Icons.email aria-hidden /> {u.email}
                      </a>
                      {u.clientProfile?.phone && (
                        <a href={`tel:${u.clientProfile.phone}`} className="mt-0.5 flex items-center gap-2 text-muted hover:text-foreground">
                          <Icons.phone aria-hidden /> {u.clientProfile.phone}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted">Invited: {extras.inviteEmail ?? "—"}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <SectionTitle icon={Icons.business}>Business</SectionTitle>
              <dl className="space-y-2.5 text-sm">
                {[
                  ["Name", project.business?.name],
                  ["Industry", project.business?.industry],
                  ["Website", project.business?.existingWebsite],
                  ["Services", project.services.map((s) => s.service.name).join(", ")],
                  ["Budget", project.budgetRange],
                  ["Timeframe", project.timeframe],
                  ["Submitted", project.submittedAt ? formatDate(project.submittedAt) : null],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className="text-faint">{label}</dt>
                    <dd className="text-right">{value || "—"}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <SectionTitle icon={Icons.timeline}>Client-facing timeline</SectionTitle>
              <ProjectProgress phases={project.phases} onHold={project.status === "ON_HOLD"} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
