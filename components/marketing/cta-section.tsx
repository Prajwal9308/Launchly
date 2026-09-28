import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-page">
        <div className="glass-elevated relative isolate overflow-hidden rounded-[2rem] px-6 py-20 text-center sm:px-12 sm:py-24">
          {/* Accent light spilling from above, with a faint horizon line */}
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/35 blur-[100px]" />
          <div aria-hidden className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <h2 className="text-lit mx-auto max-w-2xl text-4xl font-semibold leading-[1.05] sm:text-5xl">Ready to start your website?</h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            Tell us about your business. We&apos;ll review your details and get back to you with next steps.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="dark">
              <Link href="/start-project">Start Your Project</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Ask a question</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
