import { ArrowRight, Clock, FileSignature, Rocket, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const POINTS = [
  { label: "Written quote", icon: FileSignature },
  { label: "No obligation", icon: ShieldCheck },
  { label: "Reply by email", icon: Clock },
];

/** Closing call to action. On the homepage it points at the contact form below it. */
export function CtaSection({ href = "/contact" }: { href?: string }) {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-page">
        <div className="relative isolate overflow-hidden rounded-3xl bg-inverse px-6 py-12 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(36rem_20rem_at_50%_-10%,rgb(77_107_240/0.45),transparent_70%),radial-gradient(28rem_18rem_at_100%_100%,rgb(124_77_255/0.25),transparent_70%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
          />
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-inset ring-white/15">
            <Rocket className="size-5" aria-hidden />
          </span>
          <h2 className="mx-auto mt-6 max-w-2xl text-[1.75rem] font-bold leading-tight text-inverse-foreground sm:text-4xl">Tell us what you want to build.</h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-inverse-foreground/70">
            Send a few details. We&apos;ll reply with questions, a plan and a written quote — no obligation.
          </p>
          <Button asChild size="lg" className="mt-8 w-full rounded-full bg-white text-foreground shadow-xs hover:bg-white/90 focus-visible:outline-white sm:w-auto">
            <Link href={href}>
              Get a free quote <ArrowRight aria-hidden />
            </Link>
          </Button>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-inverse-foreground/70">
            {POINTS.map(({ label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-1.5">
                <Icon className="size-4 text-white/80" aria-hidden /> {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
