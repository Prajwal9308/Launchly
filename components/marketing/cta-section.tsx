import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Closing call to action. On the homepage it points at the contact form below it. */
export function CtaSection({ href = "/contact" }: { href?: string }) {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-2xl bg-inverse px-6 py-12 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
          />
          <h2 className="relative mx-auto max-w-2xl text-[1.75rem] font-semibold leading-tight text-inverse-foreground sm:text-4xl">Have an idea in mind? Let&apos;s build it.</h2>
          <p className="relative mx-auto mt-4 max-w-lg text-base leading-relaxed text-inverse-foreground/70">
            Tell us what you want to build. We&apos;ll reply with questions, a plan and a clear quote.
          </p>
          <Button asChild size="lg" className="relative mt-8 w-full bg-white text-foreground shadow-xs hover:bg-white/90 focus-visible:outline-white sm:w-auto">
            <Link href={href}>
              Start a Project <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
