import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { ConvertLeadButton, LeadStatusSelect } from "@/components/admin/lead-actions";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { LeadStatusBadge } from "@/components/ui/status-badge";
import { formatDateTime } from "@/lib/format";
import { getLead } from "@/services/leads";
import { orNotFound } from "@/server/guards";
import { requireAdminActor } from "@/server/session";

export default async function LeadDetailPage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params;
  const actor = await requireAdminActor();
  const lead = await orNotFound(getLead(actor, leadId));
  const converted = Boolean(lead.projectId);

  return (
    <div className="max-w-3xl">
      <PageHeader
        breadcrumb={[{ label: "Leads", href: "/admin/leads" }, { label: lead.name }]}
        title={lead.name}
        meta={
          <>
            <LeadStatusBadge status={lead.status} />
            <span className="text-faint">Received {formatDateTime(lead.createdAt)}</span>
          </>
        }
        actions={
          <>
            <LeadStatusSelect leadId={lead.id} status={lead.status} converted={converted} />
            {!converted && <ConvertLeadButton leadId={lead.id} />}
          </>
        }
      />
      {converted && lead.project && (
        <Alert tone="success" title="Converted to a project" className="mb-6">
          <Link href={`/admin/projects/${lead.project.id}`} className="font-medium text-accent hover:underline">
            Open {lead.project.name}
          </Link>
        </Alert>
      )}
      <Card>
        <CardContent className="space-y-6">
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-faint">Business</dt>
              <dd>{lead.businessName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-faint">Service</dt>
              <dd>{lead.service ?? "Not specified"}</dd>
            </div>
            <div>
              <dt className="text-faint">Email</dt>
              <dd>
                <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1.5 hover:underline">
                  <Mail className="size-3.5 text-faint" aria-hidden /> {lead.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-faint">Phone</dt>
              <dd>
                {lead.phone ? (
                  <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1.5 hover:underline">
                    <Phone className="size-3.5 text-faint" aria-hidden /> {lead.phone}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
          </dl>
          <div>
            <p className="text-sm text-faint">Message</p>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{lead.message}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
