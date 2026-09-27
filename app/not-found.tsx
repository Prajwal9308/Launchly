import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-4 text-center">
      <p className="font-mono text-sm text-faint">404</p>
      <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">The page you&apos;re looking for doesn&apos;t exist, or you don&apos;t have permission to view it.</p>
      <div className="mt-6 flex gap-2">
        <Button asChild>
          <Link href="/">Go to homepage</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
