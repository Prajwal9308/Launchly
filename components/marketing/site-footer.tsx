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
  { href: "/contact", label: "Contact" },
];

const CLIENT = [
  { href: "/login", label: "Client Login" },
  { href: "/contact", label: "Start a Project" },
];

const LEGAL = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
];

const linkClass = "inline-flex min-h-10 items-center text-sm text-muted transition-colors hover:text-foreground sm:min-h-0";

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-heading">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link href={link.href} className={linkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter({
  businessName,
  legalName,
  tagline,
  contactEmail,
  contactPhone,
  services,
}: {
  businessName: string;
  /** The registered legal name, when configured in Admin → Settings. */
  legalName: string | null;
  tagline: string;
  contactEmail: string;
  contactPhone: string | null;
  services: { slug: string; name: string }[];
}) {
  return (
    <footer className="border-t border-border bg-canvas">
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:py-14 lg:grid-cols-[1.6fr_1fr_1.3fr_1fr]">
        <div className="col-span-2 space-y-4 lg:col-span-1">
          <Logo name={businessName} />
          {tagline && <p className="max-w-xs text-sm leading-relaxed text-muted">{tagline}</p>}
          <ul className="space-y-2 text-sm">
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
          </ul>
        </div>
        <FooterColumn title="Company" links={COMPANY} />
        <FooterColumn title="Services" links={services.map((s) => ({ href: `/services#${s.slug}`, label: s.name }))} />
        <div className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-10 sm:col-span-1 sm:grid-cols-1">
          <FooterColumn title="Client" links={CLIENT} />
          <FooterColumn title="Legal" links={LEGAL} />
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-faint sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {legalName || businessName}. All rights reserved.
          </p>
          <p>We serve small businesses in Canada and India.</p>
        </div>
      </div>
    </footer>
  );
}
