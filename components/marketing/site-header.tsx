"use client";

import { Icons } from "@/components/ui/icons";
import type { LucideIcon } from "@/components/ui/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import type { CountryCode } from "@/domain/country";
import { CountrySelect } from "./country-select";
import { Logo } from "./logo";

export const MAIN_NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/services", label: "Services", icon: Icons.services },
  { href: "/solutions", label: "Solutions", icon: Icons.solutions },
  { href: "/process", label: "Process", icon: Icons.process },
  { href: "/about", label: "About", icon: Icons.info },
  { href: "/pricing", label: "Pricing", icon: Icons.pricing },
  { href: "/faq", label: "FAQ", icon: Icons.help },
  { href: "/contact", label: "Contact", icon: Icons.email },
];

export function SiteHeader({
  businessName,
  signedInHref,
  country,
}: {
  businessName: string;
  signedInHref: string | null;
  country: CountryCode | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const AccountIcon = signedInHref ? Icons.dashboard : Icons.login;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
        <Logo name={businessName} />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-md px-2.5 py-2 text-[15px] transition-colors duration-150",
                    isActive(item.href)
                      ? "font-medium text-foreground after:absolute after:inset-x-2.5 after:-bottom-[1.1rem] after:h-0.5 after:rounded-full after:bg-accent"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <CountrySelect country={country} className="hidden w-44 xl:flex" />
          <Button asChild variant="ghost" size="sm" className="text-sm">
            <Link href={signedInHref ?? "/login"}>{signedInHref ? "Dashboard" : "Client Login"}</Link>
          </Button>
          <Button asChild className="h-9 px-4">
            <Link href="/contact">Start a Project</Link>
          </Button>
        </div>

        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="-mr-2.5 size-11 lg:hidden" aria-label="Open menu">
              <Icons.menu aria-hidden />
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
                        isActive(item.href) ? "bg-subtle font-medium text-foreground" : "text-muted hover:text-foreground",
                      )}
                    >
                      <item.icon className={isActive(item.href) ? "text-accent" : "text-faint group-hover:text-muted"} aria-hidden />
                      <span className="flex-1">{item.label}</span>
                      <Icons.chevronRight className="text-faint" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="space-y-2 border-t border-border p-4">
              <CountrySelect country={country} showLabel className="pb-2" />
              <Button asChild size="lg" className="w-full" onClick={() => setOpen(false)}>
                <Link href="/contact">
                  Start a Project <Icons.forward aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="w-full" onClick={() => setOpen(false)}>
                <Link href={signedInHref ?? "/login"}>
                  <AccountIcon aria-hidden /> {signedInHref ? "Dashboard" : "Client Login"}
                </Link>
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  );
}
