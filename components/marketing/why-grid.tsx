import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { WHY } from "@/content/why";
import { IconBadge } from "./icons";

export function WhyGrid() {
  return (
    <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {WHY.map((item) => (
        <RevealItem key={item.title} className="surface flex gap-4 rounded-2xl p-5 sm:block sm:p-6">
          <IconBadge name={item.icon} />
          <div>
            <h3 className="text-base font-semibold sm:mt-5">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted sm:mt-2">{item.body}</p>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
