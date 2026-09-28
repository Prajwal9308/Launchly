import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-2xl bg-inverse px-6 py-16 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
          />
          <h2 className="relative mx-auto max-w-2xl text-3xl font-semibold text-inverse-foreground sm:text-4xl">Have an idea in mind? Let&apos;s build it.</h2>
          <p className="relative mx-auto mt-4 max-w-lg text-base leading-relaxed text-inverse-foreground/70">
            Tell us what you&apos;re looking to build, and we&apos;ll help turn it into a practical digital solution.
          </p>
          <Button asChild size="lg" className="relative mt-8 bg-white text-foreground shadow-xs hover:bg-white/90">
            <Link href="/contact">
              Start a Project <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
