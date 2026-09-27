"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateBriefAction } from "@/server/actions/admin";
import { useServerAction } from "./use-action";

/** Only rendered when an AI provider is configured. */
export function GenerateBriefButton({ projectId }: { projectId: string }) {
  const { pending, run } = useServerAction();
  return (
    <Button variant="secondary" size="sm" loading={pending} onClick={() => run(() => generateBriefAction(projectId))}>
      {!pending && <Sparkles />} Generate AI brief
    </Button>
  );
}
