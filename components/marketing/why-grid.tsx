import { WHY } from "@/content/why";
import { NamedIcon } from "./icons";

export function WhyGrid() {
  return (
    <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {WHY.map((item) => (
        <div key={item.title}>
          <dt>
            <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-background text-accent shadow-xs">
              <NamedIcon name={item.icon} className="size-5" />
            </span>
            <span className="mt-5 block text-base font-semibold">{item.title}</span>
          </dt>
          <dd className="mt-2 text-sm leading-relaxed text-muted">{item.body}</dd>
        </div>
      ))}
    </dl>
  );
}
