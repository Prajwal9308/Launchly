import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { WHY } from "@/content/why";
import { IconBadge } from "./icons";

export function WhyGrid() {
  return (
    <RevealGroup className="grid gap-x-8 gap-y-7 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
      {WHY.map((item) => (
        <RevealItem key={item.title} className="flex gap-4 sm:block">
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
