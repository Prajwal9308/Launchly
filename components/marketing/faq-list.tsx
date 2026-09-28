import { CircleHelp, Plus } from "lucide-react";

/** Accessible accordion using native <details>. Works without JavaScript. */
export function FaqList({ items }: { items: readonly { question: string; answer: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details
          key={item.question}
          className="surface group rounded-xl transition-[border-color,box-shadow] duration-200 open:border-accent-border open:shadow-popover"
        >
          <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl p-4 text-left text-[15px] font-medium sm:px-5 [&::-webkit-details-marker]:hidden">
            <CircleHelp className="size-5 shrink-0 text-accent" aria-hidden />
            <span className="flex-1">{item.question}</span>
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-subtle text-muted transition-[transform,background-color,color] duration-200 group-open:rotate-45 group-open:bg-accent group-open:text-accent-foreground">
              <Plus className="size-4" aria-hidden />
            </span>
          </summary>
          <p className="px-4 pb-5 pl-12 pr-6 text-sm leading-relaxed text-muted sm:pl-[3.25rem]">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
