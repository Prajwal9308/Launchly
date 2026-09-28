import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

const POINTS = [
  { label: "Written scope and quote", icon: Icons.scope },
  { label: "No obligation", icon: Icons.success },
  { label: "Reply by email", icon: Icons.email },
];

/** Closing call to action. On the homepage it points at the contact form below it. */
export function CtaSection({ href = "/contact" }: { href?: string }) {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-page">
        <div className="relative isolate overflow-hidden rounded-2xl bg-inverse px-6 py-12 sm:px-12 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(40rem_18rem_at_0%_0%,rgb(234_106_31/0.16),transparent_70%)]"
          />
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-[1.75rem] font-semibold leading-tight text-inverse-foreground sm:text-[2.25rem]">Tell us what you want to build.</h2>
              <p className="mt-4 text-base leading-relaxed text-inverse-foreground/70">
                Send a few details. We&apos;ll reply with questions, a plan and a written quote.
              </p>
              <ul className="mt-6 flex flex-col gap-2.5 text-sm text-inverse-foreground/75 sm:flex-row sm:flex-wrap sm:gap-x-6">
                {POINTS.map(({ label, icon: Icon }) => (
                  <li key={label} className="flex items-center gap-2">
                    <Icon className="text-white/70" aria-hidden /> {label}
                  </li>
                ))}
              </ul>
            </div>
            <Button asChild size="lg" className="w-full shrink-0 bg-white text-foreground shadow-xs hover:bg-white/90 focus-visible:outline-white sm:w-auto">
              <Link href={href}>
                Start a project <Icons.forward aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
