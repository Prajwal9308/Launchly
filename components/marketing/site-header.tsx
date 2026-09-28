"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export const MAIN_NAV = [
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ businessName, signedInHref }: { businessName: string; signedInHref: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
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
                    "rounded-md px-3 py-2 text-sm transition-colors duration-150",
                    isActive(item.href) ? "bg-subtle font-medium text-foreground" : "text-muted hover:bg-subtle/60 hover:text-foreground",
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
            <Link href={signedInHref ?? "/login"}>{signedInHref ? "Dashboard" : "Log in"}</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/contact">Start a project</Link>
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
                        "flex h-11 items-center rounded-md px-3 text-[15px] transition-colors hover:bg-subtle",
                        isActive(item.href) ? "bg-subtle font-medium text-foreground" : "text-muted hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="space-y-2 border-t border-border p-4">
              <Button asChild size="lg" className="w-full" onClick={() => setOpen(false)}>
                <Link href="/contact">Start a project</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="w-full" onClick={() => setOpen(false)}>
                <Link href={signedInHref ?? "/login"}>{signedInHref ? "Dashboard" : "Log in"}</Link>
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  );
}
