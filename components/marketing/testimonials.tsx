import { SAMPLE_TESTIMONIALS } from "@/content/testimonials";

export function Testimonials() {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        {SAMPLE_TESTIMONIALS.map((t, i) => (
          <figure key={i} className="flex flex-col rounded-xl border border-dashed border-border-strong bg-background p-6">
            <span className="self-start rounded-md bg-subtle px-2 py-0.5 text-[11px] font-medium text-muted">
              Sample testimonial
            </span>
            <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground">“{t.quote}”</blockquote>
            <figcaption className="mt-5 text-sm">
              <span className="font-medium">{t.name}</span>
              <span className="text-faint"> · {t.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-4 text-xs text-faint">
        These testimonials are placeholders that show how client feedback will appear. They are not from real clients.
      </p>
    </div>
  );
}
