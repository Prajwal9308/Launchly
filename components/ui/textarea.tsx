import * as React from "react";
import { cn } from "@/lib/utils";
import { controlClasses } from "./input";

export function Textarea({ className, rows = 4, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={rows} className={cn(controlClasses, "min-h-20 px-3 py-2 leading-relaxed", className)} {...props} />;
}
