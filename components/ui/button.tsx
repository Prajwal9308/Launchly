import { cva, type VariantProps } from "class-variance-authority";
import { Icons } from "@/components/ui/icons";
import { Slot } from "radix-ui";
import * as React from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "relative inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[transform,box-shadow,background-color,border-color,color,filter] duration-200 ease-[var(--ease-out-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200 hover:[&_svg.lucide-arrow-right]:translate-x-0.5 motion-reduce:hover:[&_svg.lucide-arrow-right]:translate-x-0",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-foreground shadow-[0_1px_2px_rgb(15_17_21/0.12),inset_0_1px_0_rgb(255_255_255/0.12)] hover:bg-accent-hover",
        secondary: "border border-border bg-background text-foreground shadow-xs hover:border-border-strong hover:bg-canvas",
        ghost: "text-muted hover:bg-subtle hover:text-foreground",
        destructive: "bg-danger text-white shadow-xs hover:bg-danger/90",
        link: "h-auto px-0 text-accent underline-offset-4 hover:underline",
        dark: "bg-inverse text-inverse-foreground shadow-xs hover:bg-inverse/90",
      },
      size: {
        sm: "h-8 px-3 text-[13px]",
        md: "h-10 px-4",
        lg: "h-12 rounded-lg px-6 text-[15px]",
        icon: "size-10",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export function Button({ className, variant, size, asChild, loading, disabled, children, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={asChild ? undefined : disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading && <Icons.loading className="animate-spin" aria-hidden />}
          {children}
        </>
      )}
    </Comp>
  );
}
