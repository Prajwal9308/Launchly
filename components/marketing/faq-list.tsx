import { ChevronDown } from "lucide-react";

/** Accessible accordion using native <details>. Works without JavaScript. */
export function FaqList({ items }: { items: readonly { question: string; answer: string }[] }) {
  return (
    <div className="divide-y divide-border">
      {items.map((item) => (
        <details key={item.question} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md py-4 text-left text-[15px] font-medium [&::-webkit-details-marker]:hidden">
            {item.question}
            <ChevronDown className="size-4 shrink-0 text-faint transition-transform duration-200 group-open:rotate-180" aria-hidden />
          </summary>
          <p className="pb-5 pr-8 text-sm leading-relaxed text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
