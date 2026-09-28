import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { WHY } from "@/content/why";
import { NamedIcon } from "./icons";

export function WhyGrid() {
  return (
    <RevealGroup className="grid gap-x-8 gap-y-7 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
      {WHY.map((item) => (
        <RevealItem key={item.title} className="flex gap-4 sm:block">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-accent shadow-xs">
            <NamedIcon name={item.icon} className="size-5" />
          </span>
          <div>
            <h3 className="text-base font-semibold sm:mt-5">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted sm:mt-2">{item.body}</p>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
