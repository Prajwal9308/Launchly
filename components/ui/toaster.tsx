"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      closeButton
      toastOptions={{
        classNames: {
          toast: "surface-overlay !rounded-xl !border-border !bg-[rgb(18_18_25/0.9)] !text-foreground !font-sans",
          description: "!text-muted",
        },
      }}
    />
  );
}

export { toast } from "sonner";
