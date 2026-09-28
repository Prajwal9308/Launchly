import type { Metadata } from "next";
import Link from "next/link";
import { Inbox } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { FilterBar } from "@/components/admin/filter-bar";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { buildHref, Pagination } from "@/components/ui/pagination";
import { LeadStatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatRelative } from "@/lib/format";
import { listLeads } from "@/services/leads";
import { requireAdminActor } from "@/server/session";

export const metadata: Metadata = { title: "Leads" };

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; page?: string }> }) {
  const params = await searchParams;
  const actor = await requireAdminActor();
  const page = Number(params.page) || 1;
  const { items, total, pageSize, byStatus } = await listLeads(actor, { ...params, page });

  return (
    <div>
      <PageHeader icon={Inbox} title="Leads" description={`${byStatus.NEW ?? 0} new · ${total} shown`} />
      <div className="mb-4">
        <FilterBar
          searchPlaceholder="Search name, business or email"
          filters={[
            {
              name: "status",
              label: "Filter by status",
              options: [
                { value: "", label: "All statuses" },
                { value: "NEW", label: `New (${byStatus.NEW ?? 0})` },
                { value: "CONTACTED", label: `Contacted (${byStatus.CONTACTED ?? 0})` },
                { value: "QUALIFIED", label: `Qualified (${byStatus.QUALIFIED ?? 0})` },
                { value: "CONVERTED", label: `Converted (${byStatus.CONVERTED ?? 0})` },
                { value: "LOST", label: `Lost (${byStatus.LOST ?? 0})` },
              ],
            },
          ]}
        />
      </div>
      <Card className="overflow-hidden">
        {items.length === 0 ? (
          <EmptyState icon={Inbox} title="No leads yet" description="Messages sent through the contact form appear here." />
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Business</TableHead>
                <TableHead className="hidden lg:table-cell">Project type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Received</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {items.map((lead) => (
                <TableRow key={lead.id} className="relative">
                  <TableCell>
                    <Link href={`/admin/leads/${lead.id}`} className="font-medium after:absolute after:inset-0">
                      {lead.name}
                    </Link>
                    <p className="text-xs text-faint">{lead.email}</p>
                  </TableCell>
                  <TableCell className="hidden text-muted md:table-cell">{lead.businessName ?? "—"}</TableCell>
                  <TableCell className="hidden text-muted lg:table-cell">{lead.service ?? "—"}</TableCell>
                  <TableCell>
                    <LeadStatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap text-muted sm:table-cell">{formatRelative(lead.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
      <Pagination page={page} pageSize={pageSize} total={total} hrefFor={(n) => buildHref("/admin/leads", { ...params, page: n })} />
    </div>
  );
}
