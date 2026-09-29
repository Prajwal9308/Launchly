"use client";

import { Icons } from "@/components/ui/icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addRequirementAction, deleteRequirementAction } from "@/server/actions/admin";
import { useServerAction } from "./use-action";

const SECTIONS = ["Business", "Goals", "Website", "Brand", "Content", "Inspiration", "Features", "Budget and timeline", "Technical", "Other"];

export function AddRequirementDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState({ section: "Website", label: "", value: "" });
  const { pending, run } = useServerAction();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Icons.add /> Add Requirement
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Requirement</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Field id="req-section" label="Section">
            {(p) => (
              <Select {...p} value={value.section} onChange={(e) => setValue({ ...value, section: e.target.value })}>
                {SECTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            )}
          </Field>
          <Field id="req-label" label="Label" required>
            {(p) => <Input {...p} value={value.label} onChange={(e) => setValue({ ...value, label: e.target.value })} placeholder="e.g. Booking system" />}
          </Field>
          <Field id="req-value" label="Details" required>
            {(p) => <Textarea {...p} rows={4} value={value.value} onChange={(e) => setValue({ ...value, value: e.target.value })} />}
          </Field>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button loading={pending} onClick={() => run(() => addRequirementAction(projectId, value), () => { setOpen(false); setValue({ section: "Website", label: "", value: "" }); })}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteRequirementButton({ id, label }: { id: string; label: string }) {
  const { pending, run } = useServerAction();
  return (
    <Button variant="ghost" size="icon-sm" loading={pending} aria-label={`Remove requirement ${label}`} onClick={() => { if (confirm(`Remove “${label}”?`)) run(() => deleteRequirementAction(id)); }}>
      {!pending && <Icons.delete />}
    </Button>
  );
}
