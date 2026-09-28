/**
 * Small schematic drawings for each "What we build" category. They illustrate
 * the kind of product, not a real project, so they contain no names or data.
 */
const line = "block rounded-full bg-border-strong";

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[14rem] overflow-hidden rounded-lg border border-border bg-background shadow-xs">
      <div className="flex gap-1 border-b border-border px-2.5 py-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-1.5 rounded-full bg-border-strong" />
        ))}
      </div>
      {children}
    </div>
  );
}

function Website() {
  return (
    <BrowserFrame>
      <div className="space-y-2.5 p-3">
        <div className="flex items-center justify-between">
          <span className="h-2 w-8 rounded-sm bg-foreground/80" />
          <span className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`${line} h-1 w-4`} />
            ))}
          </span>
        </div>
        <div className="rounded-md bg-accent-subtle p-2.5">
          <span className="block h-1.5 w-3/5 rounded-full bg-accent/70" />
          <span className={`${line} mt-1.5 h-1 w-2/5`} />
          <span className="mt-2 block h-2.5 w-10 rounded-sm bg-accent" />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-5 rounded-sm border border-border bg-canvas" />
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

function WebApp() {
  return (
    <BrowserFrame>
      <div className="grid grid-cols-[2.25rem_1fr]">
        <div className="space-y-1.5 border-r border-border bg-canvas p-2">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`block h-1.5 rounded-full ${i === 0 ? "bg-accent" : "bg-border-strong"}`} />
          ))}
        </div>
        <div className="space-y-1.5 p-2.5">
          <div className="grid grid-cols-2 gap-1.5">
            {[0, 1].map((i) => (
              <span key={i} className="h-5 rounded-sm border border-border" />
            ))}
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-1.5 border-b border-border pb-1.5 last:border-0">
              <span className="size-2 rounded-full bg-accent/30" />
              <span className={`${line} h-1 flex-1`} />
              <span className={`${line} h-1 w-4`} />
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

function Phone({ offset = false }: { offset?: boolean }) {
  return (
    <div className={`w-[4.25rem] rounded-[0.9rem] border border-border-strong bg-foreground p-[3px] shadow-xs ${offset ? "translate-y-3" : ""}`}>
      <div className="space-y-1.5 rounded-[0.7rem] bg-background p-1.5 pb-2">
        <span className="mx-auto block h-0.5 w-5 rounded-full bg-border-strong" />
        <span className={`block h-6 rounded ${offset ? "bg-canvas border border-border" : "bg-accent"}`} />
        {[0, 1, 2].map((i) => (
          <span key={i} className={`${line} h-1 ${i === 1 ? "w-2/3" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}

function Mobile() {
  return (
    <div className="flex items-start gap-3">
      <Phone />
      <Phone offset />
    </div>
  );
}

function Store() {
  return (
    <BrowserFrame>
      <div className="grid grid-cols-3 gap-1.5 p-2.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-1">
            <span className="block aspect-square rounded-sm bg-canvas ring-1 ring-border" />
            <span className={`${line} h-1 w-4/5`} />
            <span className="block h-1 w-1/2 rounded-full bg-foreground/60" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-border px-2.5 py-1.5">
        <span className={`${line} h-1 w-10`} />
        <span className="h-2.5 w-9 rounded-sm bg-accent" />
      </div>
    </BrowserFrame>
  );
}

const SKETCHES: Record<string, () => React.ReactElement> = {
  "business-websites": Website,
  "web-applications": WebApp,
  "mobile-applications": Mobile,
  ecommerce: Store,
};

export function SolutionSketch({ slug }: { slug: string }) {
  const Sketch = SKETCHES[slug];
  if (!Sketch) return null;
  return (
    <div aria-hidden className="flex h-44 items-center justify-center border-b border-border bg-canvas px-6">
      <Sketch />
    </div>
  );
}
