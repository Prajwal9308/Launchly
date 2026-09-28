import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { WHY } from "@/content/why";
import { NamedIcon } from "./icons";

/** Four working principles as quiet columns: a small icon, a title, one sentence. */
export function WhyGrid() {
  return (
    <RevealGroup className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
      {WHY.map((item) => (
        <RevealItem key={item.title} className="border-t border-border pt-5">
          <NamedIcon name={item.icon} className="text-accent" />
          <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
