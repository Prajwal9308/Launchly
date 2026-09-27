"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/process", label: "Process" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ businessName, signedInHref }: { businessName: string; signedInHref: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Logo name={businessName} />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm transition-colors",
                      active ? "text-foreground" : "text-muted hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {signedInHref ? (
            <Button asChild variant="ghost" size="sm">
              <Link href={signedInHref}>Dashboard</Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Log in</Link>
            </Button>
          )}
          <Button asChild size="sm">
            <Link href="/start-project">Start Your Project</Link>
          </Button>
        </div>

        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="!size-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent side="right">
            <div className="flex h-16 items-center border-b border-border px-5">
              <DrawerTitle className="text-sm font-semibold">Menu</DrawerTitle>
            </div>
            <nav aria-label="Mobile" className="flex-1 overflow-y-auto p-3">
              <ul className="space-y-0.5">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-3 py-2.5 text-[15px] text-foreground hover:bg-subtle"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/faq" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2.5 text-[15px] hover:bg-subtle">
                    FAQ
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="space-y-2 border-t border-border p-4">
              <Button asChild className="w-full" onClick={() => setOpen(false)}>
                <Link href="/start-project">Start Your Project</Link>
              </Button>
              <Button asChild variant="secondary" className="w-full" onClick={() => setOpen(false)}>
                <Link href={signedInHref ?? "/login"}>{signedInHref ? "Dashboard" : "Log in"}</Link>
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  );
}
