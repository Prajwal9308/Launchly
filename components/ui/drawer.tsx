"use client";

import { Icons } from "@/components/ui/icons";
import { Dialog as DialogPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Side sheet built on the dialog primitive (focus trap, Escape to close). */
export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;
export const DrawerTitle = DialogPrimitive.Title;

export function DrawerContent({
  className,
  children,
  side = "left",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { side?: "left" | "right" }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#0f1115]/40 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />
      <DialogPrimitive.Content
        aria-describedby={undefined}
        className={cn(
          "surface-overlay fixed inset-y-0 z-50 flex w-[18rem] max-w-[85vw] flex-col !shadow-dialog",
          side === "left"
            ? "left-0 !border-y-0 !border-l-0 data-[state=open]:animate-slide-in-left data-[state=closed]:animate-slide-out-left"
            : "right-0 !border-y-0 !border-r-0 data-[state=open]:animate-slide-in-right data-[state=closed]:animate-slide-out-right",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-2.5 top-2.5 flex size-11 items-center justify-center rounded-md text-faint transition-colors hover:bg-subtle hover:text-foreground">
          <Icons.close aria-hidden />
          <span className="sr-only">Close menu</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
