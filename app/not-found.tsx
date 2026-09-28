import { Compass, House, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-accent-subtle text-accent ring-1 ring-inset ring-accent-border/60">
        <Compass className="size-6" aria-hidden />
      </span>
      <p className="mt-5 font-mono text-sm text-faint">404</p>
      <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">This page doesn&apos;t exist or may have moved.</p>
      <div className="mt-6 flex gap-2">
        <Button asChild>
          <Link href="/">
            <House aria-hidden /> Go to homepage
          </Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/contact">
            <Mail aria-hidden /> Contact us
          </Link>
        </Button>
      </div>
    </main>
  );
}
