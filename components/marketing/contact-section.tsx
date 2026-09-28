import { IconTile, Icons } from "@/components/ui/icons";
import Link from "next/link";
import { isPlaceholderEmail } from "@/lib/site";
import { ContactForm } from "./contact-form";
import { NamedIcon } from "./icons";

const NEXT_STEPS = [
  { text: "We read your project details and reply by email, usually with a few questions.", icon: Icons.messages },
  { text: "We agree on scope, timeline and cost in writing before any work starts.", icon: Icons.scope },
  { text: "Once we begin, you follow updates, share files and review designs in your project portal.", icon: Icons.dashboard },
];

/** Contact block used on the homepage and the Contact page. */
export function ContactSection({ contactEmail, heading = true }: { contactEmail: string; heading?: boolean }) {
  const Sub = heading ? "h3" : "h2";
  return (
    // Mobile order: intro → form → what happens next. Desktop: intro and details on the left, form on the right.
    <div className="grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-x-16 lg:gap-y-0">
      {heading && (
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="eyebrow">
            <NamedIcon name="mail" /> Contact
          </p>
          <h2 className="mt-4 text-[1.75rem] font-semibold leading-[1.15] sm:text-4xl">Start a project</h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            Share a few details about what you want to build. There&apos;s no obligation — we&apos;ll reply with next steps.
          </p>
        </div>
      )}
      <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <ContactForm />
      </div>
      <div className={heading ? "lg:col-start-1 lg:row-start-2 lg:pt-10" : "lg:col-start-1 lg:row-start-1"}>
        <Sub className="text-sm font-semibold">What happens next</Sub>
        <ol className="mt-4 space-y-4">
          {NEXT_STEPS.map(({ text, icon: Icon }, i) => (
            <li key={text} className="flex gap-3 text-sm leading-relaxed text-muted">
              <span className="relative">
                <IconTile icon={Icon} />
                <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-accent font-mono text-[10px] font-medium text-accent-foreground">
                  {i + 1}
                </span>
              </span>
              <span className="pt-2">{text}</span>
            </li>
          ))}
        </ol>
        <div className="mt-8 space-y-2 text-sm">
          {!isPlaceholderEmail(contactEmail) && (
            <a href={`mailto:${contactEmail}`} className="inline-flex min-h-11 items-center gap-2 text-muted hover:text-foreground sm:min-h-0">
              <Icons.email className="text-accent" aria-hidden /> {contactEmail}
            </a>
          )}
          <p className="flex items-start gap-2 text-muted">
            <Icons.requirements className="mt-0.5 shrink-0 text-accent" aria-hidden />
            <span>
              Planning a website?{" "}
              <Link href="/start-project" className="font-medium text-accent hover:underline">
                Use the detailed website questionnaire
              </Link>
              .
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
