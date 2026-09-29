"use client";

import { IconTile, Icons } from "@/components/ui/icons";
import type { LucideIcon } from "@/components/ui/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@/components/marketing/logo";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { CommandMenu, type CommandItem } from "./command-menu";
import { NotificationBell, type NotificationView } from "./notification-bell";
import { UserMenu } from "./user-menu";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: number;
}

function clientNav(projectId: string | null, unreadMessages: number, reviewsAwaiting: number): NavItem[] {
  const base: NavItem[] = [{ href: "/dashboard", label: "Dashboard", icon: Icons.dashboard, exact: true }];
  if (projectId) {
    const p = `/dashboard/project/${projectId}`;
    base.push(
      { href: p, label: "My Project", icon: Icons.project, exact: true },
      { href: `${p}/requirements`, label: "Requirements", icon: Icons.requirements },
      { href: `${p}/tasks`, label: "Tasks", icon: Icons.tasks },
      { href: `${p}/files`, label: "Files", icon: Icons.files },
      { href: `${p}/messages`, label: "Messages", icon: Icons.messages, badge: unreadMessages },
      { href: `${p}/reviews`, label: "Design Reviews", icon: Icons.design, badge: reviewsAwaiting },
      { href: `${p}/activity`, label: "Activity", icon: Icons.activity },
    );
  }
  base.push({ href: "/dashboard/account", label: "Account", icon: Icons.account });
  return base;
}

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: Icons.dashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: Icons.project },
  { href: "/admin/clients", label: "Clients", icon: Icons.clients },
  { href: "/admin/leads", label: "Leads", icon: Icons.leads },
  { href: "/admin/tasks", label: "Tasks", icon: Icons.tasks },
  { href: "/admin/messages", label: "Messages", icon: Icons.messages },
  { href: "/admin/portfolio", label: "Portfolio", icon: Icons.portfolio },
  { href: "/admin/services", label: "Services", icon: Icons.services, exact: true },
  { href: "/admin/services/pricing", label: "Pricing", icon: Icons.pricing },
  { href: "/admin/activity", label: "Activity", icon: Icons.activity },
  { href: "/admin/settings", label: "Settings", icon: Icons.settings },
];

function isActive(pathname: string, item: NavItem) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function NavList({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const active = isActive(pathname, item);
        const Icon = item.icon;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-[background-color,color,box-shadow] duration-200",
                active
                  ? "bg-accent-subtle font-medium text-accent"
                  : "text-muted hover:bg-subtle hover:text-foreground",
              )}
            >
              <IconTile icon={Icon} size="sm" tone={active ? "solid" : "ghost"} className={active ? undefined : "group-hover:bg-background group-hover:text-accent"} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge ? (
                <span className="rounded-full bg-accent px-1.5 text-[11px] font-semibold leading-4 text-accent-foreground">
                  {item.badge}
                  <span className="sr-only"> new</span>
                </span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export interface AppShellProps {
  variant: "client" | "admin";
  businessName: string;
  subtitle?: string;
  user: { firstName: string; lastName: string; email: string };
  notifications: { items: NotificationView[]; unread: number };
  /** Client only: most recent project, used when the URL doesn't name one. */
  defaultProjectId?: string | null;
  unreadMessages?: number;
  reviewsAwaiting?: number;
  children: React.ReactNode;
}

export function AppShell({
  variant,
  businessName,
  subtitle,
  user,
  notifications,
  defaultProjectId = null,
  unreadMessages = 0,
  reviewsAwaiting = 0,
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const urlProjectId = /^\/dashboard\/project\/([^/]+)/.exec(pathname)?.[1] ?? null;
  const projectId = urlProjectId ?? defaultProjectId;
  const items = variant === "admin" ? ADMIN_NAV : clientNav(projectId, unreadMessages, reviewsAwaiting);
  const home = variant === "admin" ? "/admin" : "/dashboard";
  const accountHref = variant === "admin" ? "/admin/settings" : "/dashboard/account";
  const commandItems: CommandItem[] = [
    ...items.map((i) => ({ label: i.label, href: i.href, group: "Go to" })),
    ...(variant === "admin"
      ? [
          { label: "New portfolio project", href: "/admin/portfolio/new", group: "Actions", keywords: "add create" },
          { label: "New service", href: "/admin/services/new", group: "Actions", keywords: "add create" },
          { label: "New pricing package", href: "/admin/services/pricing/new", group: "Actions", keywords: "add create price" },
          { label: "Open tasks assigned to me", href: "/admin/tasks?mine=1", group: "Actions" },
          { label: "New leads", href: "/admin/leads?status=NEW", group: "Actions", keywords: "enquiries contact" },
        ]
      : [{ label: "Start a Project", href: "/start-project", group: "Actions", keywords: "questionnaire new request" }]),
    { label: "View Website", href: "/", group: "Actions", keywords: "home public" },
  ];

  const brand = (
    <Link href={home} className="flex min-w-0 items-center gap-2.5 rounded-md">
      <LogoMark className="size-6 shrink-0" />
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold leading-tight">{businessName}</span>
        {subtitle && <span className="block truncate text-[11px] leading-tight text-faint">{subtitle}</span>}
      </span>
    </Link>
  );

  return (
    <div className="relative isolate min-h-dvh">
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-96 bg-glow" />
      {/* Desktop sidebar: a floating surface rail */}
      <aside className="surface fixed inset-y-3 left-3 z-30 hidden w-60 flex-col overflow-hidden rounded-2xl lg:flex">
        <div className="flex h-16 items-center border-b border-border px-5">{brand}</div>
        <nav aria-label={variant === "admin" ? "Studio" : "Client Portal"} className="flex-1 overflow-y-auto p-3">
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-faint">{variant === "admin" ? "Studio" : "Client Portal"}</p>
          <NavList items={items} />
          {variant === "client" && !projectId && (
            <Link
              href="/start-project"
              className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-sm font-medium text-muted transition-colors hover:border-accent/50 hover:bg-accent-subtle hover:text-accent"
            >
              <Icons.add aria-hidden /> Start a Project
            </Link>
          )}
        </nav>
        <div className="border-t border-border p-3">
          <Link href="/" className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-muted transition-colors hover:bg-subtle hover:text-foreground">
            <IconTile icon={Icons.home} size="sm" tone="ghost" className="group-hover:bg-background group-hover:text-accent" />
            Website
          </Link>
        </div>
      </aside>

      <div className="lg:pl-[16.25rem]">
        {/* Top bar: floating surface strip */}
        <header className="surface sticky top-3 z-20 mx-3 flex h-14 items-center gap-3 rounded-2xl px-3 sm:px-4 lg:ml-3">
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2 lg:hidden" aria-label="Open navigation">
                <Icons.menu />
              </Button>
            </DrawerTrigger>
            <DrawerContent side="left">
              <div className="flex h-16 items-center border-b border-border px-5 pr-12">
                <DrawerTitle className="sr-only">Navigation</DrawerTitle>
                {brand}
              </div>
              <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto p-3">
                <NavList items={items} onNavigate={() => setOpen(false)} />
              </nav>
            </DrawerContent>
          </Drawer>

          <div className="min-w-0 lg:hidden">{brand}</div>

          <div className="hidden flex-1 md:block">
            <CommandMenu
              items={commandItems}
              searchHref={variant === "admin" ? (q) => `/admin/search?q=${encodeURIComponent(q)}` : undefined}
            />
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            {variant === "admin" && (
              <Button asChild variant="ghost" size="icon" className="md:hidden" aria-label="Search">
                <Link href="/admin/search">
                  <Icons.search />
                </Link>
              </Button>
            )}
            <NotificationBell items={notifications.items} unread={notifications.unread} />
            <UserMenu {...user} accountHref={accountHref} />
          </div>
        </header>

        <main id="main" className={cn("mx-auto w-full max-w-6xl animate-rise px-4 py-8 sm:px-6 sm:py-10", variant === "client" && "pb-28 lg:pb-10")}>
          {children}
        </main>
      </div>

      {/* Client mobile tab bar: status, messages, files and reviews within one tap */}
      {variant === "client" && projectId && (
        <nav
          aria-label="Quick navigation"
          className="surface-overlay fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 mx-auto max-w-md rounded-2xl lg:hidden"
        >
          <ul className="grid grid-cols-5">
            {[
              { href: "/dashboard", label: "Home", icon: Icons.dashboard, exact: true },
              { href: `/dashboard/project/${projectId}`, label: "Project", icon: Icons.project, exact: true },
              { href: `/dashboard/project/${projectId}/messages`, label: "Messages", icon: Icons.messages, badge: unreadMessages },
              { href: `/dashboard/project/${projectId}/files`, label: "Files", icon: Icons.files },
              { href: `/dashboard/project/${projectId}/reviews`, label: "Reviews", icon: Icons.design, badge: reviewsAwaiting },
            ].map((item) => {
              const active = isActive(pathname, item);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] transition-colors",
                      active ? "text-accent" : "text-faint",
                    )}
                  >
                    <Icon aria-hidden />
                    {item.label}
                    {item.badge ? (
                      <span className="absolute right-1/2 top-1 translate-x-4 rounded-full bg-accent px-1 text-[10px] font-semibold leading-4 text-accent-foreground">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
