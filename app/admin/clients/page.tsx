import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { FilterBar } from "@/components/admin/filter-bar";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { buildHref, Pagination } from "@/components/ui/pagination";
import { ProjectStatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatRelative } from "@/lib/format";
import { listClients } from "@/services/clients";
import { requireAdminActor } from "@/server/session";

export const metadata: Metadata = { title: "Clients" };

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const params = await searchParams;
  const actor = await requireAdminActor();
  const page = Number(params.page) || 1;
  const { items, total, pageSize } = await listClients(actor, { q: params.q, page });

  return (
    <div>
      <PageHeader title="Clients" description={`${total} client${total === 1 ? "" : "s"}`} />
      <div className="mb-4">
        <FilterBar searchPlaceholder="Search name, email or business" />
      </div>
      <Card className="overflow-hidden">
        {items.length === 0 ? (
          <EmptyState icon={Users} title={params.q ? "No matching clients" : "No clients yet"} description={params.q ? "Try a different search." : "Clients appear here when they create an account or you convert a lead."} />
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Client</TableHead>
                <TableHead className="hidden md:table-cell">Business</TableHead>
                <TableHead className="hidden sm:table-cell">Projects</TableHead>
                <TableHead>Latest status</TableHead>
                <TableHead className="hidden lg:table-cell">Last login</TableHead>
                <TableHead className="hidden lg:table-cell">Since</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {items.map((org) => {
                const owner = org.members[0]?.user;
                return (
                  <TableRow key={org.id} className="relative">
                    <TableCell>
                      <Link href={`/admin/clients/${org.id}`} className="font-medium after:absolute after:inset-0">
                        {owner ? `${owner.firstName} ${owner.lastName}` : "Invitation pending"}
                      </Link>
                      <p className="text-xs text-faint">{owner?.email ?? org.inviteEmail}</p>
                    </TableCell>
                    <TableCell className="hidden text-muted md:table-cell">
                      {org.businesses[0]?.name ?? org.name}
                      {org.businesses[0]?.industry && <p className="text-xs text-faint">{org.businesses[0].industry}</p>}
                    </TableCell>
                    <TableCell className="hidden tabular-nums text-muted sm:table-cell">{org._count.projects}</TableCell>
                    <TableCell>{org.projects[0] ? <ProjectStatusBadge status={org.projects[0].status} /> : <span className="text-faint">—</span>}</TableCell>
                    <TableCell className="hidden whitespace-nowrap text-muted lg:table-cell">{owner?.lastLoginAt ? formatRelative(owner.lastLoginAt) : "Never"}</TableCell>
                    <TableCell className="hidden whitespace-nowrap text-muted lg:table-cell">{formatDate(org.createdAt)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
      <Pagination page={page} pageSize={pageSize} total={total} hrefFor={(n) => buildHref("/admin/clients", { ...params, page: n })} />
    </div>
  );
}
