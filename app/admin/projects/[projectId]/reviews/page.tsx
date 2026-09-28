import { BadgeCheck, History, Palette } from "lucide-react";
import { SectionTitle } from "@/components/app/page-header";
import { ApprovalRequestDialog } from "@/components/admin/approval-request";
import { DesignUploadDialog } from "@/components/admin/design-upload";
import { ApprovalCard } from "@/components/project/approval-card";
import { DesignReviewCard } from "@/components/project/design-review-card";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { listApprovals } from "@/services/approvals";
import { listDesignReviews } from "@/services/reviews";
import { orNotFound } from "@/server/guards";
import { requireAdminActor } from "@/server/session";

export default async function AdminReviewsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const actor = await requireAdminActor();
  const [reviews, approvals] = await Promise.all([orNotFound(listDesignReviews(actor, projectId)), orNotFound(listApprovals(actor, projectId))]);
  const titles = [...new Set(reviews.map((r) => r.title))];
  const current = reviews.filter((r) => r.status !== "SUPERSEDED");
  const history = reviews.filter((r) => r.status === "SUPERSEDED");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <ApprovalRequestDialog projectId={projectId} />
        <DesignUploadDialog projectId={projectId} existingTitles={titles} />
      </div>

      <section>
        <SectionTitle icon={Palette}>Designs</SectionTitle>
        {current.length ? (
          <div className="space-y-6">
            {current.map((r) => (
              <DesignReviewCard key={r.id} review={r} viewer="admin" />
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState icon={Palette} title="No designs uploaded" description="Upload a design to share it with the client for review." />
          </Card>
        )}
      </section>

      <section>
        <SectionTitle icon={BadgeCheck}>Approvals</SectionTitle>
        {approvals.length ? (
          <div className="space-y-3">
            {approvals.map((a) => (
              <ApprovalCard key={a.id} approval={a} viewer="admin" />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No approvals yet. Design approvals are recorded when the client approves a design version.</p>
        )}
      </section>

      {history.length > 0 && (
        <section>
          <SectionTitle icon={History}>Version history</SectionTitle>
          <div className="space-y-3">
            {history.map((r) => (
              <DesignReviewCard key={r.id} review={r} viewer="admin" expanded={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
