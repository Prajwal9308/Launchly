import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-header";
import { ActivityList } from "@/components/project/activity-list";
import { Card, CardContent } from "@/components/ui/card";
import { buildHref, Pagination } from "@/components/ui/pagination";
import { listAllActivityPage } from "@/services/activity";
import { requireAdminActor } from "@/server/session";

export const metadata: Metadata = { title: "Activity" };

export default async function AdminActivityPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const actor = await requireAdminActor();
  const page = Number(params.page) || 1;
  const { items, total, pageSize } = await listAllActivityPage(actor, page);
  return (
    <div>
      <PageHeader title="Activity" description="Every important event across the business." />
      <Card>
        <CardContent>
          <ActivityList events={items} showProject projectHref={(id) => `/admin/projects/${id}`} showVisibility emptyText="No data yet." />
        </CardContent>
      </Card>
      <Pagination page={page} pageSize={pageSize} total={total} hrefFor={(n) => buildHref("/admin/activity", { page: n })} />
    </div>
  );
}
