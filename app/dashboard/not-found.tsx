import Link from "next/link";
import { FolderX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default function DashboardNotFound() {
  return (
    <Card>
      <EmptyState
        icon={FolderX}
        title="This project could not be found."
        description="It may have been removed, or you don't have permission to view it."
        action={
          <Button asChild variant="secondary">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        }
      />
    </Card>
  );
}
