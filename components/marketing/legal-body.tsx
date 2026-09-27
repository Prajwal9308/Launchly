export function LegalBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed text-muted [&_a]:text-accent [&_a]:underline [&_h2]:pt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground">
      {children}
    </div>
  );
}
