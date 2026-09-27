"use client";

import { X } from "lucide-react";
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
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/30 data-[state=open]:animate-fade-in" />
      <DialogPrimitive.Content
        aria-describedby={undefined}
        className={cn(
          "fixed inset-y-0 z-50 flex w-[18rem] max-w-[85vw] flex-col bg-background shadow-dialog",
          side === "left"
            ? "left-0 border-r border-border data-[state=open]:animate-slide-in-left"
            : "right-0 border-l border-border data-[state=open]:animate-slide-in-right",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-3 top-3.5 rounded-md p-1.5 text-faint hover:bg-subtle hover:text-foreground">
          <X className="size-4" />
          <span className="sr-only">Close menu</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
