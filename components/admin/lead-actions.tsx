"use client";

import type { LeadStatus } from "@/db/enums";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { convertLeadAction, updateLeadStatusAction } from "@/server/actions/admin";
import { useServerAction } from "./use-action";

export function LeadStatusSelect({ leadId, status, converted }: { leadId: string; status: LeadStatus; converted: boolean }) {
  const { pending, run } = useServerAction();
  return (
    <Select
      aria-label="Lead status"
      value={status}
      disabled={pending || converted}
      onChange={(e) => run(() => updateLeadStatusAction(leadId, e.target.value as LeadStatus))}
      className="w-40"
    >
      <option value="NEW">New</option>
      <option value="CONTACTED">Contacted</option>
      <option value="QUALIFIED">Qualified</option>
      <option value="LOST">Lost</option>
      {converted && <option value="CONVERTED">Converted</option>}
    </Select>
  );
}

export function ConvertLeadButton({ leadId }: { leadId: string }) {
  const { pending, run } = useServerAction();
  return (
    <Button
      loading={pending}
      onClick={() => {
        if (confirm("Create a client and draft project from this lead? If they don't have an account yet, they'll be invited by email."))
          run(() => convertLeadAction(leadId));
      }}
    >
      Convert to project
    </Button>
  );
}
