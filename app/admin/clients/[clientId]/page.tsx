import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { PageHeader, SectionTitle } from "@/components/app/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectStatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatRelative } from "@/lib/format";
import { formatProjectNumber } from "@/lib/utils";
import { getClient } from "@/services/clients";
import { orNotFound } from "@/server/guards";
import { requireAdminActor } from "@/server/session";

export default async function ClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const actor = await requireAdminActor();
  const org = await orNotFound(getClient(actor, clientId));

  return (
    <div>
      <PageHeader breadcrumb={[{ label: "Clients", href: "/admin/clients" }, { label: org.name }]} title={org.name} description={`Client since ${formatDate(org.createdAt)}`} />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <div className="space-y-6">
          <Card>
            <CardContent>
              <SectionTitle>Contacts</SectionTitle>
              {org.members.length ? (
                <ul className="space-y-4">
                  {org.members.map(({ user }) => (
                    <li key={user.id} className="text-sm">
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <a href={`mailto:${user.email}`} className="mt-1 flex items-center gap-2 text-muted hover:text-foreground">
                        <Mail className="size-3.5" aria-hidden /> {user.email}
                      </a>
                      {user.clientProfile?.phone && (
                        <a href={`tel:${user.clientProfile.phone}`} className="mt-0.5 flex items-center gap-2 text-muted hover:text-foreground">
                          <Phone className="size-3.5" aria-hidden /> {user.clientProfile.phone}
                        </a>
                      )}
                      <p className="mt-1 text-xs text-faint">Last login: {user.lastLoginAt ? formatRelative(user.lastLoginAt) : "never"}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted">Invitation sent to {org.inviteEmail}. They&apos;ll be linked when they sign up with that email.</p>
              )}
            </CardContent>
          </Card>
          {org.businesses.map((b) => (
            <Card key={b.id}>
              <CardContent>
                <SectionTitle>{b.name}</SectionTitle>
                <dl className="space-y-2 text-sm">
                  {[
                    ["Industry", b.industry],
                    ["Type", b.businessType],
                    ["Phone", b.phone],
                    ["Email", b.email],
                    ["Address", b.address],
                    ["Website", b.existingWebsite],
                    ["Domain", b.domain],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <dt className="text-faint">{label}</dt>
                      <dd className="text-right">{value || "—"}</dd>
                    </div>
                  ))}
                </dl>
                {b.description && <p className="mt-4 text-sm leading-relaxed text-muted">{b.description}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="self-start overflow-hidden">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="text-sm font-semibold">Projects</h2>
          </div>
          {org.projects.length ? (
            <ul className="divide-y divide-border">
              {org.projects.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/projects/${p.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-canvas">
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-faint">
                        {formatProjectNumber(p.number)} · Created {formatDate(p.createdAt)}
                      </p>
                    </div>
                    <ProjectStatusBadge status={p.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-6 text-sm text-muted">No projects yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
