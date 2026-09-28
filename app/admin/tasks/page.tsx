import type { Metadata } from "next";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import { PageHeader } from "@/components/app/page-header";
import { FilterBar } from "@/components/admin/filter-bar";
import { AdminTaskRow } from "@/components/admin/task-row";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { buildHref, Pagination } from "@/components/ui/pagination";
import { formatProjectNumber } from "@/lib/utils";
import { listAdmins, listAllTasks } from "@/services/tasks";
import { requireAdminActor } from "@/server/session";

export const metadata: Metadata = { title: "Tasks" };

export default async function AdminTasksPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; mine?: string; page?: string }> }) {
  const params = await searchParams;
  const actor = await requireAdminActor();
  const page = Number(params.page) || 1;
  const [{ items, total, pageSize }, team] = await Promise.all([
    listAllTasks(actor, { q: params.q, status: params.status, mine: params.mine === "1", page }),
    listAdmins(actor),
  ]);

  return (
    <div>
      <PageHeader icon={Icons.tasks} title="Tasks" description="Across all active projects, soonest due first." />
      <div className="mb-4">
        <FilterBar
          searchPlaceholder="Search tasks or projects"
          filters={[
            {
              name: "status",
              label: "Filter by status",
              options: [
                { value: "", label: "Open tasks" },
                { value: "TODO", label: "To do" },
                { value: "IN_PROGRESS", label: "In progress" },
                { value: "BLOCKED", label: "Blocked" },
                { value: "DONE", label: "Done" },
              ],
            },
            { name: "mine", label: "Assignee", options: [{ value: "", label: "Everyone" }, { value: "1", label: "Assigned to me" }] },
          ]}
        />
      </div>
      <Card className="divide-y divide-border overflow-hidden">
        {items.length === 0 ? (
          <EmptyState icon={Icons.tasks} title="No tasks" description="Nothing matches these filters." />
        ) : (
          items.map((t) => (
            <div key={t.id}>
              <Link href={`/admin/projects/${t.project.id}/tasks`} className="block px-4 pt-3 text-xs text-faint hover:text-foreground">
                {t.project.business?.name ?? t.project.name} · {formatProjectNumber(t.project.number)}
              </Link>
              <AdminTaskRow task={t} projectId={t.project.id} team={team} />
            </div>
          ))
        )}
      </Card>
      <Pagination page={page} pageSize={pageSize} total={total} hrefFor={(n) => buildHref("/admin/tasks", { ...params, page: n })} />
    </div>
  );
}
