"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      closeButton
      toastOptions={{
        classNames: {
          toast: "!rounded-lg !border !border-border !bg-background !text-foreground !shadow-popover !font-sans",
          description: "!text-muted",
        },
      }}
    />
  );
}

export { toast } from "sonner";
