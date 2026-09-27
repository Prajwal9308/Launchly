import type { Metadata } from "next";
import { ActivityList } from "@/components/project/activity-list";
import { Card, CardContent } from "@/components/ui/card";
import { listProjectActivity } from "@/services/activity";
import { orNotFound } from "@/server/guards";
import { requireClientActor } from "@/server/session";

export const metadata: Metadata = { title: "Activity" };

export default async function ClientActivityPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const actor = await requireClientActor();
  const events = await orNotFound(listProjectActivity(actor, projectId, 100));
  return (
    <Card>
      <CardContent>
        <ActivityList events={events} />
      </CardContent>
    </Card>
  );
}
