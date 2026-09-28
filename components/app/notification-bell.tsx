"use client";

import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import { markAllNotificationsReadAction, markNotificationReadAction } from "@/server/actions/notifications";

export interface NotificationView {
  id: string;
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
          <Bell className="!size-[18px]" />
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
            <p className="px-4 py-8 text-center text-sm text-muted">You&apos;re all caught up.</p>
          ) : (
            items.map((item) => (
              <DropdownMenuItem key={item.id} onSelect={() => open(item)} className="items-start gap-3 px-3 py-2.5">
                <span
                  aria-hidden
                  className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", item.readAt ? "bg-transparent" : "bg-accent")}
                />
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
