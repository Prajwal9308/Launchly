import Link from "next/link";

export function LegalBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed text-muted [&_a]:text-accent [&_a]:underline [&_h2]:pt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-heading [&_h3]:pt-2 [&_h3]:text-[15px] [&_h3]:font-semibold [&_h3]:text-heading [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
      {children}
    </div>
  );
}

/** Effective date line, shown only once the owner has set it in Admin → Settings. */
export function LegalDates({ effectiveDate }: { effectiveDate: string | null }) {
  if (!effectiveDate) return null;
  return <p className="text-sm text-faint">Effective date: {effectiveDate}</p>;
}

/** Contact block for legal pages. Unset details are left out rather than shown as placeholders. */
export function LegalContact({ entity, address, email }: { entity: string; address: string | null; email: string | null }) {
  return (
    <address className="not-italic">
      <span className="block font-medium text-foreground">{entity}</span>
      {address && <span className="block whitespace-pre-line">{address}</span>}
      {email ? (
        <a href={`mailto:${email}`}>{email}</a>
      ) : (
        <Link href="/contact">Contact us through our contact form</Link>
      )}
    </address>
  );
}
