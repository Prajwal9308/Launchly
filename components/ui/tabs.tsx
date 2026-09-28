"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs as TabsPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List className={cn("flex gap-1 border-b border-border", className)} {...props} />;
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "-mb-px border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground data-[state=active]:border-accent data-[state=active]:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export const TabsContent = TabsPrimitive.Content;

export interface NavTab {
  href: string;
  label: string;
  count?: number;
  /** Rendered icon element, e.g. `<ListChecks />` (passed as an element so server layouts can supply it). */
  icon?: React.ReactNode;
  /** Match only the exact path (for the overview tab). */
  exact?: boolean;
}

/** Route-based tabs rendered as links, horizontally scrollable on mobile. */
export function NavTabs({ tabs, className }: { tabs: NavTab[]; className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Sections" className={cn("-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0", className)}>
      <ul className="flex min-w-max gap-1 border-b border-border">
        {tabs.map((tab) => {
          const active = tab.exact ? pathname === tab.href : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors [&_svg]:shrink-0",
                  active ? "border-accent text-foreground [&_svg]:text-accent" : "border-transparent text-muted hover:text-foreground [&_svg]:text-faint",
                )}
              >
                {tab.icon && <span aria-hidden className="contents">{tab.icon}</span>}
                {tab.label}
                {tab.count ? (
                  <span className="rounded-full bg-accent px-1.5 text-[11px] font-semibold leading-4 text-accent-foreground">{tab.count}</span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
