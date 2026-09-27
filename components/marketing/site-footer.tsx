import Link from "next/link";
import { Logo } from "./logo";

const COLUMNS = [
  {
    title: "Company",
    links: [
      { href: "/services", label: "Services" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/process", label: "Process" },
      { href: "/about", label: "About" },
    ],
  },
  {
    title: "Get started",
    links: [
      { href: "/start-project", label: "Start Project" },
      { href: "/pricing", label: "Pricing" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function SiteFooter({
  businessName,
  tagline,
  contactEmail,
  contactPhone,
}: {
  businessName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string | null;
}) {
  return (
    <footer className="border-t border-border bg-canvas">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-3">
          <Logo name={businessName} />
          <p className="max-w-xs text-sm leading-relaxed text-muted">{tagline}</p>
          <div className="space-y-1 text-sm text-muted">
            <a href={`mailto:${contactEmail}`} className="block hover:text-foreground">
              {contactEmail}
            </a>
            {contactPhone && (
              <a href={`tel:${contactPhone.replace(/[^\d+]/g, "")}`} className="block hover:text-foreground">
                {contactPhone}
              </a>
            )}
          </div>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h2 className="text-xs font-medium uppercase tracking-wider text-faint">{column.title}</h2>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-faint sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {businessName}. All rights reserved.
          </p>
          <p>Web design & development for small businesses.</p>
        </div>
      </div>
    </footer>
  );
}
