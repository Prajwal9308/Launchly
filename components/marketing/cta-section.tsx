import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-page">
        <div className="relative isolate overflow-hidden rounded-3xl border border-border bg-inverse px-6 py-16 text-center sm:px-12 sm:py-20">
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 -z-10 h-64 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/30 blur-3xl" />
          <h2 className="mx-auto max-w-xl text-3xl font-semibold text-inverse-foreground sm:text-4xl">Ready to start your website?</h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-inverse-foreground/70">
            Tell us about your business. We&apos;ll review your details and get back to you with next steps.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-inverse-foreground text-inverse hover:bg-inverse-foreground/90">
              <Link href="/start-project">Start Your Project</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-inverse-foreground hover:bg-inverse-foreground/10 hover:text-inverse-foreground">
              <Link href="/contact">Ask a question</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
