import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { Slot } from "radix-ui";
import * as React from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "relative inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[transform,box-shadow,background-color,border-color,color,filter] duration-200 ease-[var(--ease-out-soft)] active:translate-y-px active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-[linear-gradient(180deg,#8ea0ff_0%,#6a80fb_48%,#566cea_100%)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35),inset_0_-1px_0_rgb(0_0_0/0.2),0_10px_28px_-10px_rgb(111_134_255/0.7),0_1px_2px_rgb(0_0_0/0.4)] hover:-translate-y-px hover:brightness-110 hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.4),inset_0_-1px_0_rgb(0_0_0/0.2),0_16px_36px_-10px_rgb(111_134_255/0.8),0_1px_2px_rgb(0_0_0/0.4)]",
        secondary:
          "border border-white/12 bg-white/[0.06] text-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_6px_18px_-10px_rgb(0_0_0/0.8)] backdrop-blur-md hover:-translate-y-px hover:border-white/20 hover:bg-white/[0.1]",
        ghost: "text-muted hover:bg-white/[0.06] hover:text-foreground",
        destructive: "bg-danger text-white shadow-xs hover:bg-danger/90",
        link: "h-auto px-0 text-accent underline-offset-4 hover:underline",
        dark: "bg-white text-[#0b0b10] shadow-[inset_0_-1px_0_rgb(0_0_0/0.15),0_10px_28px_-12px_rgb(255_255_255/0.35)] hover:-translate-y-px hover:bg-white/90",
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
          {loading && <Loader2 className="animate-spin" aria-hidden />}
          {children}
        </>
      )}
    </Comp>
  );
}
