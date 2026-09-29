"use client";

import { IconTile, Icons, type LucideIcon } from "@/components/ui/icons";
import type { NotificationType } from "@/db/enums";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import { markAllNotificationsReadAction, markNotificationReadAction } from "@/server/actions/notifications";

/** One icon per notification type; complete by type so new types must pick one. */
const TYPE_ICONS: Record<NotificationType, LucideIcon> = {
  PROJECT_SUBMITTED: Icons.send,
  NEW_MESSAGE: Icons.messages,
  DESIGN_READY: Icons.design,
  REVISION_REQUESTED: Icons.revision,
  APPROVAL_REQUESTED: Icons.waiting,
  APPROVAL_RECEIVED: Icons.approved,
  STATUS_CHANGED: Icons.timeline,
  LEAD_CREATED: Icons.leads,
  USER_REGISTERED: Icons.signup,
  INFORMATION_REQUESTED: Icons.help,
};

export interface NotificationView {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  href: string | null;
  readAt: string | null;
  createdAt: string;
}

export function NotificationBell({ items, unread }: { items: NotificationView[]; unread: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const open = (item: NotificationView) => {
    startTransition(async () => {
      if (!item.readAt) await markNotificationReadAction(item.id);
      if (item.href) router.push(item.href);
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={unread ? `Notifications (${unread} unread)` : "Notifications"}>
          <Icons.notifications />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-4 text-accent-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[22rem] max-w-[calc(100vw-2rem)] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          {unread > 0 && (
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(async () => {
                await markAllNotificationsReadAction();
                router.refresh();
              })}
              className="text-xs font-medium text-accent hover:underline disabled:opacity-50"
            >
              Mark all as read
            </button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto p-1">
          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">You have no new notifications.</p>
          ) : (
            items.map((item) => (
              <DropdownMenuItem key={item.id} onSelect={() => open(item)} className="items-start gap-3 px-3 py-2.5">
                <span className="relative">
                  <IconTile icon={TYPE_ICONS[item.type]} size="sm" tone={item.readAt ? "neutral" : "accent"} />
                  {!item.readAt && <span aria-hidden className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-background bg-accent" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block text-sm", item.readAt ? "text-muted" : "font-medium text-foreground")}>{item.title}</span>
                  {item.body && <span className="mt-0.5 block truncate text-xs text-faint">{item.body}</span>}
                  <span className="mt-1 block text-[11px] text-faint">{formatRelative(item.createdAt)}</span>
                </span>
                {!item.readAt && <span className="sr-only">Unread</span>}
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
