import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { isPlaceholderEmail } from "@/lib/site";
import { Logo } from "./logo";

const COMPANY = [
  { href: "/services", label: "Services" },
  { href: "/solutions", label: "Solutions" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

export function SiteFooter({
  businessName,
  tagline,
  contactEmail,
  contactPhone,
  services,
}: {
  businessName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string | null;
  services: { slug: string; name: string }[];
}) {
  return (
    <footer className="border-t border-border bg-canvas">
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:py-14 lg:grid-cols-[1.5fr_1fr_1.2fr_1fr]">
        <div className="col-span-2 space-y-3 lg:col-span-1">
          <Logo name={businessName} />
          <p className="max-w-xs text-sm leading-relaxed text-muted">{tagline}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Company</h2>
          <ul className="mt-4 space-y-2.5">
            {COMPANY.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex min-h-10 items-center text-sm text-muted transition-colors hover:text-foreground sm:min-h-0">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Services</h2>
          <ul className="mt-4 space-y-2.5">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services#${s.slug}`} className="inline-flex min-h-10 items-center text-sm text-muted transition-colors hover:text-foreground sm:min-h-0">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <h2 className="text-sm font-semibold text-foreground">Contact</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {!isPlaceholderEmail(contactEmail) && (
              <li>
                <a href={`mailto:${contactEmail}`} className="inline-flex min-h-10 items-center gap-2 break-all text-muted transition-colors hover:text-foreground sm:min-h-0">
                  <Icons.email className="shrink-0 text-accent" aria-hidden />
                  {contactEmail}
                </a>
              </li>
            )}
            {contactPhone && (
              <li>
                <a href={`tel:${contactPhone.replace(/[^\d+]/g, "")}`} className="inline-flex min-h-10 items-center gap-2 text-muted transition-colors hover:text-foreground sm:min-h-0">
                  <Icons.phone className="shrink-0 text-accent" aria-hidden />
                  {contactPhone}
                </a>
              </li>
            )}
            <li>
              <Link href="/contact" className="group inline-flex min-h-10 items-center gap-2 font-medium text-accent hover:underline sm:min-h-0">
                <Icons.forward className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
                Start a project
              </Link>
            </li>
            <li>
              <Link href="/login" className="inline-flex min-h-10 items-center gap-2 text-muted transition-colors hover:text-foreground sm:min-h-0">
                <Icons.login className="shrink-0 text-accent" aria-hidden />
                Client login
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-faint sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {businessName}. All rights reserved.
          </p>
          <p className="flex gap-4">
            <Link href="/privacy" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <Icons.privacy aria-hidden />
              Privacy
            </Link>
            <Link href="/terms" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <Icons.document aria-hidden />
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
