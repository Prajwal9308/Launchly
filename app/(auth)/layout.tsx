import Link from "next/link";
import { connection } from "next/server";
import { Logo } from "@/components/marketing/logo";
import { getSiteSettings } from "@/services/catalog";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  // Rendered per request: content comes from the database and must not be baked in at build time.
  await connection();
  const settings = await getSiteSettings();
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="container-page flex h-16 items-center justify-between">
        <Logo name={settings.businessName} />
        <Link href="/" className="inline-flex min-h-11 items-center text-sm text-muted hover:text-foreground sm:min-h-0">
          Back to website
        </Link>
      </header>
      <main id="main" className="flex flex-1 items-start justify-center px-4 pb-16 pt-6 sm:items-center sm:pt-0">
        {children}
      </main>
    </div>
  );
}
