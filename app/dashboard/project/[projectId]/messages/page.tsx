import type { Metadata } from "next";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import { MessageComposer } from "@/components/project/message-composer";
import { MessageThread } from "@/components/project/message-thread";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getSiteSettings } from "@/services/catalog";
import { listMessages } from "@/services/messages";
import { orNotFound } from "@/server/guards";
import { requireClientActor } from "@/server/session";

export const metadata: Metadata = { title: "Messages" };

export default async function ClientMessagesPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ before?: string }>;
}) {
  const { projectId } = await params;
  const { before } = await searchParams;
  const actor = await requireClientActor();
  const [{ messages, hasMore, oldest }, settings] = await Promise.all([
    orNotFound(listMessages(actor, projectId, { before })),
    getSiteSettings(),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Card className="p-4 sm:p-6">
        {hasMore && oldest && (
          <div className="mb-5 text-center">
            <Link href={`?before=${encodeURIComponent(oldest.toISOString())}`} className="text-xs font-medium text-accent hover:underline">
              Show earlier messages
            </Link>
          </div>
        )}
        {before && (
          <div className="mb-5 text-center">
            <Link href="?" className="text-xs font-medium text-accent hover:underline">
              Back to latest
            </Link>
          </div>
        )}
        {messages.length ? (
          <MessageThread messages={messages} currentUserId={actor.id} studioName={settings.businessName} />
        ) : (
          <EmptyState icon={Icons.messages} title="No messages yet" description="Send us a question or an update about your project." compact />
        )}
      </Card>
      <MessageComposer projectId={projectId} />
    </div>
  );
}
