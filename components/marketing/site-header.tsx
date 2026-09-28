"use client";

import {
  ArrowRight,
  ChevronRight,
  CircleHelp,
  Info,
  Layers,
  LayoutDashboard,
  LogIn,
  Mail,
  Menu,
  Tag,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export const MAIN_NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/services", label: "Services", icon: Layers },
  { href: "/process", label: "Process", icon: Workflow },
  { href: "/pricing", label: "Pricing", icon: Tag },
  { href: "/about", label: "About", icon: Info },
  { href: "/faq", label: "FAQ", icon: CircleHelp },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function SiteHeader({ businessName, signedInHref }: { businessName: string; signedInHref: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const AccountIcon = signedInHref ? LayoutDashboard : LogIn;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Logo name={businessName} />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm transition-colors duration-150",
                    isActive(item.href) ? "bg-accent-subtle font-medium text-accent" : "text-muted hover:bg-subtle hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href={signedInHref ?? "/login"}>
              <AccountIcon aria-hidden /> {signedInHref ? "Dashboard" : "Log in"}
            </Link>
          </Button>
          <Button asChild size="sm" className="rounded-full px-4">
            <Link href="/contact">
              Start a project <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>

        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="-mr-2.5 size-11 lg:hidden" aria-label="Open menu">
              <Menu className="!size-5" aria-hidden />
            </Button>
          </DrawerTrigger>
          <DrawerContent side="right">
            <div className="flex h-16 items-center border-b border-border px-6">
              <DrawerTitle className="text-sm font-semibold">Menu</DrawerTitle>
            </div>
            <nav aria-label="Mobile" className="flex-1 overflow-y-auto p-3">
              <ul className="space-y-0.5">
                {MAIN_NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "group flex h-12 items-center gap-3 rounded-lg px-3 text-[15px] transition-colors hover:bg-subtle",
                        isActive(item.href) ? "bg-accent-subtle font-medium text-accent" : "text-muted hover:text-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-8 items-center justify-center rounded-md",
                          isActive(item.href) ? "bg-accent text-accent-foreground" : "bg-subtle text-accent group-hover:bg-background",
                        )}
                      >
                        <item.icon className="size-4" aria-hidden />
                      </span>
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight className="size-4 text-faint" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="space-y-2 border-t border-border p-4">
              <Button asChild size="lg" className="w-full" onClick={() => setOpen(false)}>
                <Link href="/contact">
                  Start a project <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="w-full" onClick={() => setOpen(false)}>
                <Link href={signedInHref ?? "/login"}>
                  <AccountIcon aria-hidden /> {signedInHref ? "Dashboard" : "Log in"}
                </Link>
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  );
}
