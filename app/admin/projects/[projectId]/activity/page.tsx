import { ActivityList } from "@/components/project/activity-list";
import { Card, CardContent } from "@/components/ui/card";
import { listProjectActivity } from "@/services/activity";
import { orNotFound } from "@/server/guards";
import { requireAdminActor } from "@/server/session";

export default async function AdminProjectActivityPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const actor = await requireAdminActor();
  const events = await orNotFound(listProjectActivity(actor, projectId, 200));
  return (
    <Card>
      <CardContent>
        <ActivityList events={events} showVisibility />
      </CardContent>
    </Card>
  );
}
