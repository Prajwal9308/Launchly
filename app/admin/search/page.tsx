import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { FilterBar } from "@/components/admin/filter-bar";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { LeadStatusBadge, ProjectStatusBadge } from "@/components/ui/status-badge";
import { formatProjectNumber } from "@/lib/utils";
import { searchAll } from "@/services/search";
import { requireAdminActor } from "@/server/session";

export const metadata: Metadata = { title: "Search" };

function Group({ title, children, count }: { title: string; children: React.ReactNode; count: number }) {
  if (!count) return null;
  return (
    <Card className="overflow-hidden">
      <h2 className="border-b border-border bg-canvas px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-faint">
        {title} ({count})
      </h2>
      <ul className="divide-y divide-border">{children}</ul>
    </Card>
  );
}

const rowClass = "flex items-center justify-between gap-3 px-5 py-3 text-sm hover:bg-subtle";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const actor = await requireAdminActor();
  const results = await searchAll(actor, q);
  const total = results.projects.length + results.clients.length + results.businesses.length + results.leads.length;

  return (
    <div>
      <PageHeader icon={Search} title="Search" description="Clients, projects, businesses and leads." />
      <div className="mb-6">
        <FilterBar searchPlaceholder="Search…" />
      </div>
      {results.q.length < 2 ? (
        <Card>
          <EmptyState icon={Search} title="Search your business" description="Type at least two characters." compact />
        </Card>
      ) : total === 0 ? (
        <Card>
          <EmptyState icon={Search} title={`No results for “${results.q}”`} description="Try a name, email, business or project number." compact />
        </Card>
      ) : (
        <div className="space-y-4">
          <Group title="Projects" count={results.projects.length}>
            {results.projects.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/projects/${p.id}`} className={rowClass}>
                  <span>
                    {p.business?.name ?? p.name} <span className="text-faint">· {formatProjectNumber(p.number)}</span>
                  </span>
                  <ProjectStatusBadge status={p.status} />
                </Link>
              </li>
            ))}
          </Group>
          <Group title="Clients" count={results.clients.length}>
            {results.clients.map((c) => (
              <li key={c.id}>
                <Link href={c.memberships[0] ? `/admin/clients/${c.memberships[0].organizationId}` : "/admin/clients"} className={rowClass}>
                  <span>
                    {c.firstName} {c.lastName}
                  </span>
                  <span className="text-faint">{c.email}</span>
                </Link>
              </li>
            ))}
          </Group>
          <Group title="Businesses" count={results.businesses.length}>
            {results.businesses.map((b) => (
              <li key={b.id}>
                <Link href={`/admin/clients/${b.organizationId}`} className={rowClass}>
                  <span>{b.name}</span>
                  <span className="text-faint">{b.industry}</span>
                </Link>
              </li>
            ))}
          </Group>
          <Group title="Leads" count={results.leads.length}>
            {results.leads.map((l) => (
              <li key={l.id}>
                <Link href={`/admin/leads/${l.id}`} className={rowClass}>
                  <span>
                    {l.name} {l.businessName && <span className="text-faint">· {l.businessName}</span>}
                  </span>
                  <LeadStatusBadge status={l.status} />
                </Link>
              </li>
            ))}
          </Group>
        </div>
      )}
    </div>
  );
}
