import Link from "next/link";
import { FolderX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default function AdminNotFound() {
  return (
    <Card>
      <EmptyState
        icon={FolderX}
        title="This item could not be found."
        description="It may have been removed or the link is incorrect."
        action={
          <Button asChild variant="secondary">
            <Link href="/admin">Back to overview</Link>
          </Button>
        }
      />
    </Card>
  );
}
