"use client";

import {
  Activity,
  Briefcase,
  CheckSquare,
  ClipboardList,
  FileStack,
  FolderKanban,
  Home,
  Inbox,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Palette,
  Search,
  Settings,
  Sparkles,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
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
  const base: NavItem[] = [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true }];
  if (projectId) {
    const p = `/dashboard/project/${projectId}`;
    base.push(
      { href: p, label: "My Project", icon: FolderKanban, exact: true },
      { href: `${p}/requirements`, label: "Requirements", icon: ClipboardList },
      { href: `${p}/tasks`, label: "Tasks", icon: CheckSquare },
      { href: `${p}/files`, label: "Files", icon: FileStack },
      { href: `${p}/messages`, label: "Messages", icon: MessageSquare, badge: unreadMessages },
      { href: `${p}/reviews`, label: "Design Reviews", icon: Palette, badge: reviewsAwaiting },
      { href: `${p}/activity`, label: "Activity", icon: Activity },
    );
  }
  base.push({ href: "/dashboard/account", label: "Account", icon: UserRound });
  return base;
}

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/admin/services", label: "Services", icon: Sparkles },
  { href: "/admin/activity", label: "Activity", icon: Activity },
  { href: "/admin/settings", label: "Settings", icon: Settings },
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
                "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                active ? "bg-subtle font-medium text-foreground" : "text-muted hover:bg-subtle/70 hover:text-foreground",
              )}
            >
              <Icon className={cn("size-4 shrink-0", active ? "text-accent" : "text-faint")} aria-hidden />
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
      : [{ label: "Start a new project", href: "/start-project", group: "Actions", keywords: "questionnaire new" }]),
    { label: "View website", href: "/", group: "Actions", keywords: "home public" },
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
    <div className="min-h-dvh bg-canvas">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-background lg:flex">
        <div className="flex h-14 items-center border-b border-border px-4">{brand}</div>
        <nav aria-label={variant === "admin" ? "Studio" : "Client portal"} className="flex-1 overflow-y-auto p-3">
          <NavList items={items} />
          {variant === "client" && !projectId && (
            <Link
              href="/start-project"
              className="mt-4 flex items-center justify-center rounded-md border border-dashed border-border-strong px-3 py-2 text-sm font-medium text-muted hover:text-foreground"
            >
              Start a project
            </Link>
          )}
        </nav>
        <div className="border-t border-border p-3">
          <Link href="/" className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-muted hover:bg-subtle hover:text-foreground">
            <Home className="size-4 text-faint" aria-hidden /> Website
          </Link>
        </div>
      </aside>

      <div className="lg:pl-60">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-6">
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2 lg:hidden" aria-label="Open navigation">
                <Menu className="!size-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent side="left">
              <div className="flex h-14 items-center border-b border-border px-4 pr-12">
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
                  <Search className="!size-[18px]" />
                </Link>
              </Button>
            )}
            <NotificationBell items={notifications.items} unread={notifications.unread} />
            <UserMenu {...user} accountHref={accountHref} />
          </div>
        </header>

        <main id="main" className={cn("mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8", variant === "client" && "pb-24 lg:pb-8")}>
          {children}
        </main>
      </div>

      {/* Client mobile tab bar: status, messages, files and reviews within one tap */}
      {variant === "client" && projectId && (
        <nav aria-label="Quick navigation" className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
          <ul className="mx-auto grid max-w-md grid-cols-5 pb-[env(safe-area-inset-bottom)]">
            {[
              { href: "/dashboard", label: "Home", icon: LayoutDashboard, exact: true },
              { href: `/dashboard/project/${projectId}`, label: "Project", icon: FolderKanban, exact: true },
              { href: `/dashboard/project/${projectId}/messages`, label: "Messages", icon: MessageSquare, badge: unreadMessages },
              { href: `/dashboard/project/${projectId}/files`, label: "Files", icon: FileStack },
              { href: `/dashboard/project/${projectId}/reviews`, label: "Reviews", icon: Palette, badge: reviewsAwaiting },
            ].map((item) => {
              const active = isActive(pathname, item);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn("relative flex flex-col items-center gap-0.5 py-2 text-[11px]", active ? "text-accent" : "text-faint")}
                  >
                    <Icon className="size-5" aria-hidden />
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
