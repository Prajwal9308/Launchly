import type { Metadata } from "next";
import Link from "next/link";
import { FolderKanban } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { FilterBar } from "@/components/admin/filter-bar";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { buildHref, Pagination } from "@/components/ui/pagination";
import { ProjectStatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PROJECT_STATUSES, STATUS_LABELS } from "@/domain/project-status";
import { formatDate, formatRelative } from "@/lib/format";
import { formatProjectNumber } from "@/lib/utils";
import { listAdminProjects } from "@/services/project-queries";
import { requireAdminActor } from "@/server/session";

export const metadata: Metadata = { title: "Projects" };

type Search = { q?: string; status?: string; sort?: string; page?: string };

export default async function AdminProjectsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const actor = await requireAdminActor();
  const page = Number(params.page) || 1;
  const { items, total, pageSize } = await listAdminProjects(actor, { ...params, page });
  const filtered = Boolean(params.q || params.status);

  return (
    <div>
      <PageHeader title="Projects" description={`${total} project${total === 1 ? "" : "s"}`} />
      <div className="mb-4">
        <FilterBar
          searchPlaceholder="Search client, business or P-number"
          filters={[
            {
              name: "status",
              label: "Filter by status",
              options: [
                { value: "", label: "All statuses" },
                { value: "active", label: "Active" },
                { value: "awaiting-client", label: "Awaiting client" },
                ...PROJECT_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] })),
              ],
            },
            {
              name: "sort",
              label: "Sort",
              options: [
                { value: "", label: "Last activity" },
                { value: "created", label: "Newest" },
                { value: "name", label: "Name" },
                { value: "status", label: "Status" },
              ],
            },
          ]}
        />
      </div>

      <Card className="overflow-hidden">
        {items.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title={filtered ? "No matching projects" : "No projects yet"}
            description={filtered ? "Try a different search or filter." : "New client projects will appear here once a client starts a project."}
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <tr>
                    <TableHead>Client</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last activity</TableHead>
                    <TableHead>Next action</TableHead>
                  </tr>
                </TableHeader>
                <TableBody>
                  {items.map((p) => (
                    <TableRow key={p.id} className="relative">
                      <TableCell>
                        <Link href={`/admin/projects/${p.id}`} className="font-medium after:absolute after:inset-0">
                          {p.client ? `${p.client.firstName} ${p.client.lastName}` : <span className="text-faint">Invited</span>}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted">{p.business?.name ?? p.organization.name}</TableCell>
                      <TableCell>
                        <span className="block max-w-48 truncate">{p.name}</span>
                        <span className="text-xs text-faint">{formatProjectNumber(p.number)}</span>
                      </TableCell>
                      <TableCell>
                        <ProjectStatusBadge status={p.status} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted">{formatDate(p.createdAt)}</TableCell>
                      <TableCell className="whitespace-nowrap text-muted">{formatRelative(p.lastActivityAt)}</TableCell>
                      <TableCell className="max-w-56 truncate text-muted">{p.nextAction}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Mobile list */}
            <ul className="divide-y divide-border md:hidden">
              {items.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/projects/${p.id}`} className="block space-y-1.5 px-4 py-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{p.business?.name ?? p.name}</p>
                        <p className="text-xs text-faint">
                          {p.client ? `${p.client.firstName} ${p.client.lastName}` : "Invited"} · {formatProjectNumber(p.number)}
                        </p>
                      </div>
                      <ProjectStatusBadge status={p.status} />
                    </div>
                    <p className="text-xs text-muted">Next: {p.nextAction}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>
      <Pagination page={page} pageSize={pageSize} total={total} hrefFor={(n) => buildHref("/admin/projects", { ...params, page: n })} />
    </div>
  );
}
