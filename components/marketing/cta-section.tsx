import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-2xl bg-foreground px-6 py-14 text-center sm:px-12">
          <h2 className="mx-auto max-w-xl text-2xl font-semibold text-white sm:text-3xl">Ready to start your website?</h2>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-white/70">
            Tell us about your business. We&apos;ll review your details and get back to you with next steps.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90">
              <Link href="/start-project">Start Your Project</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
              <Link href="/contact">Ask a question</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
