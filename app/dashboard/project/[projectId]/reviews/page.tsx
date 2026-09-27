import type { Metadata } from "next";
import { Palette } from "lucide-react";
import { SectionTitle } from "@/components/app/page-header";
import { ApprovalCard } from "@/components/project/approval-card";
import { DesignReviewCard } from "@/components/project/design-review-card";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { listApprovals } from "@/services/approvals";
import { listDesignReviews } from "@/services/reviews";
import { orNotFound } from "@/server/guards";
import { requireClientActor } from "@/server/session";

export const metadata: Metadata = { title: "Design Reviews" };

export default async function ClientReviewsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const actor = await requireClientActor();
  const [reviews, approvals] = await Promise.all([
    orNotFound(listDesignReviews(actor, projectId)),
    orNotFound(listApprovals(actor, projectId)),
  ]);
  const pendingApprovals = approvals.filter((a) => a.status === "PENDING");
  const pastApprovals = approvals.filter((a) => a.status !== "PENDING");
  const active = reviews.filter((r) => r.status !== "SUPERSEDED");
  const superseded = reviews.filter((r) => r.status === "SUPERSEDED");

  return (
    <div className="space-y-8">
      {pendingApprovals.length > 0 && (
        <section>
          <SectionTitle>Approvals needed</SectionTitle>
          <div className="space-y-4">
            {pendingApprovals.map((a) => (
              <ApprovalCard key={a.id} approval={a} viewer="client" />
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionTitle>Designs</SectionTitle>
        {active.length ? (
          <div className="space-y-6">
            {active.map((r) => (
              <DesignReviewCard key={r.id} review={r} viewer="client" />
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState icon={Palette} title="No designs to review yet" description="When a design is ready, you'll see it here and get a notification." />
          </Card>
        )}
      </section>

      {superseded.length > 0 && (
        <section>
          <SectionTitle>Previous versions</SectionTitle>
          <div className="space-y-3">
            {superseded.map((r) => (
              <details key={r.id} className="group">
                <summary className="cursor-pointer list-none text-sm text-muted hover:text-foreground [&::-webkit-details-marker]:hidden">
                  {r.title} v{r.version} <span className="text-faint">— show</span>
                </summary>
                <div className="mt-3">
                  <DesignReviewCard review={r} viewer="client" />
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {pastApprovals.length > 0 && (
        <section>
          <SectionTitle>Approval history</SectionTitle>
          <div className="space-y-3">
            {pastApprovals.map((a) => (
              <ApprovalCard key={a.id} approval={a} viewer="client" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
