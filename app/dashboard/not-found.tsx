import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default function DashboardNotFound() {
  return (
    <Card>
      <EmptyState
        icon={Icons.projectMissing}
        title="We couldn't find this project."
        description="It may have been removed or you may no longer have access."
        action={
          <Button asChild variant="secondary">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        }
      />
    </Card>
  );
}
