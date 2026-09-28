"use client";

import { useFormAction } from "@/components/forms/use-form-action";
import { Trash2 } from "lucide-react";
import { FormStatus, fieldError } from "@/components/forms/form-status";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioItem, PricingPackage, Service } from "@/db/types";
import { SERVICE_ICONS } from "@/domain/service-icons";
import {
  deletePortfolioAction,
  deletePricingAction,
  deleteServiceAction,
  savePortfolioAction,
  savePricingAction,
  saveServiceAction,
  updateSettingsAction,
} from "@/server/actions/admin";
import { useServerAction } from "./use-action";

function Toggle({ name, label, description, defaultChecked }: { name: string; label: string; description?: string; defaultChecked: boolean }) {
  return (
    <label className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5 size-4 accent-[var(--color-accent)]" />
      <span>
        <span className="font-medium">{label}</span>
        {description && <span className="block text-xs text-faint">{description}</span>}
      </span>
    </label>
  );
}

function DeleteButton({ onDelete, label }: { onDelete: () => ReturnType<typeof deleteServiceAction>; label: string }) {
  const { pending, run } = useServerAction();
  return (
    <Button type="button" variant="ghost" className="text-danger hover:bg-danger-subtle hover:text-danger" loading={pending} onClick={() => { if (confirm(`Delete ${label}? This can't be undone.`)) run(onDelete); }}>
      {!pending && <Trash2 />} Delete
    </Button>
  );
}

const ICON_OPTIONS = SERVICE_ICONS;

export function ServiceForm({ service }: { service?: Service }) {
  const { state, onSubmit, pending } = useFormAction(saveServiceAction.bind(null, service?.id ?? null));
  const err = (n: string) => fieldError(state, n);
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormStatus state={state} />
      <Field id="name" label="Name" required error={err("name")}>
        {(p) => <Input {...p} name="name" defaultValue={service?.name} />}
      </Field>
      <Field id="summary" label="Short description" required error={err("summary")}>
        {(p) => <Textarea {...p} name="summary" rows={2} defaultValue={service?.summary} />}
      </Field>
      <Field id="features" label="Features" optional hint="One per line." error={err("features")}>
        {(p) => <Textarea {...p} name="features" rows={4} defaultValue={service?.features.join("\n")} />}
      </Field>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field id="pricingText" label="Pricing text" optional hint='e.g. "Included in all packages"' error={err("pricingText")}>
          {(p) => <Input {...p} name="pricingText" defaultValue={service?.pricingText ?? ""} />}
        </Field>
        <Field id="icon" label="Icon" error={err("icon")}>
          {(p) => (
            <Select {...p} name="icon" defaultValue={service?.icon ?? "layout"}>
              {ICON_OPTIONS.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </Select>
          )}
        </Field>
        <Field id="sortOrder" label="Order" error={err("sortOrder")}>
          {(p) => <Input {...p} name="sortOrder" type="number" min={0} defaultValue={service?.sortOrder ?? 0} />}
        </Field>
      </div>
      <Toggle name="published" label="Published" description="Shown on the public website and in the questionnaire." defaultChecked={service?.published ?? true} />
      <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
        {service ? <DeleteButton label={service.name} onDelete={() => deleteServiceAction(service.id)} /> : <span />}
        <SubmitButton pending={pending}>{service ? "Save service" : "Create service"}</SubmitButton>
      </div>
    </form>
  );
}

export function PricingForm({ pkg }: { pkg?: PricingPackage }) {
  const { state, onSubmit, pending } = useFormAction(savePricingAction.bind(null, pkg?.id ?? null));
  const err = (n: string) => fieldError(state, n);
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormStatus state={state} />
      <Field id="name" label="Package name" required error={err("name")}>
        {(p) => <Input {...p} name="name" defaultValue={pkg?.name} />}
      </Field>
      <Field id="description" label="Description" required error={err("description")}>
        {(p) => <Textarea {...p} name="description" rows={2} defaultValue={pkg?.description} />}
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="price" label="Price (USD)" optional hint="Leave blank to show “Let's discuss your project”." error={err("price")}>
          {(p) => <Input {...p} name="price" inputMode="decimal" placeholder="e.g. 2500" defaultValue={pkg?.priceCents != null ? String(pkg.priceCents / 100) : ""} />}
        </Field>
        <Field id="pricePrefix" label="Price prefix" optional hint='e.g. "From" or "Starting at"' error={err("pricePrefix")}>
          {(p) => <Input {...p} name="pricePrefix" defaultValue={pkg?.pricePrefix ?? ""} />}
        </Field>
      </div>
      <Field id="features" label="Included features" optional hint="One per line." error={err("features")}>
        {(p) => <Textarea {...p} name="features" rows={5} defaultValue={pkg?.features.join("\n")} />}
      </Field>
      <Field id="sortOrder" label="Order" error={err("sortOrder")}>
        {(p) => <Input {...p} name="sortOrder" type="number" min={0} defaultValue={pkg?.sortOrder ?? 0} className="max-w-32" />}
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle name="highlighted" label="Highlight" description="Given a stronger border and a primary button on the pricing page." defaultChecked={pkg?.highlighted ?? false} />
        <Toggle name="published" label="Published" defaultChecked={pkg?.published ?? true} />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
        {pkg ? <DeleteButton label={pkg.name} onDelete={() => deletePricingAction(pkg.id)} /> : <span />}
        <SubmitButton pending={pending}>{pkg ? "Save package" : "Create package"}</SubmitButton>
      </div>
    </form>
  );
}

export function PortfolioForm({ item }: { item?: PortfolioItem }) {
  const { state, onSubmit, pending } = useFormAction(savePortfolioAction.bind(null, item?.id ?? null));
  const err = (n: string) => fieldError(state, n);
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormStatus state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="title" label="Title" required error={err("title")}>
          {(p) => <Input {...p} name="title" defaultValue={item?.title} />}
        </Field>
        <Field id="industry" label="Industry" required error={err("industry")}>
          {(p) => <Input {...p} name="industry" defaultValue={item?.industry} />}
        </Field>
      </div>
      <Field id="description" label="Description" required error={err("description")}>
        {(p) => <Textarea {...p} name="description" rows={3} defaultValue={item?.description} />}
      </Field>
      <Field id="services" label="Services" optional hint="Comma separated, e.g. Website Design, SEO Foundations" error={err("services")}>
        {(p) => <Input {...p} name="services" defaultValue={item?.services.join(", ")} />}
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="imageUrl" label="Image" optional hint="A /public path (e.g. /portfolio/site.png) or https URL." error={err("imageUrl")}>
          {(p) => <Input {...p} name="imageUrl" defaultValue={item?.imageUrl ?? ""} />}
        </Field>
        <Field id="url" label="Live website URL" optional error={err("url")}>
          {(p) => <Input {...p} name="url" defaultValue={item?.url ?? ""} placeholder="https://" />}
        </Field>
      </div>
      <Field id="sortOrder" label="Order" error={err("sortOrder")}>
        {(p) => <Input {...p} name="sortOrder" type="number" min={0} defaultValue={item?.sortOrder ?? 0} className="max-w-32" />}
      </Field>
      <div className="grid gap-3 sm:grid-cols-3">
        <Toggle name="isDemo" label="Sample / demo project" description="Labelled “Sample project” publicly. Untick only for real client work." defaultChecked={item?.isDemo ?? true} />
        <Toggle name="featured" label="Featured" description="Shown on the homepage." defaultChecked={item?.featured ?? false} />
        <Toggle name="published" label="Published" defaultChecked={item?.published ?? true} />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
        {item ? <DeleteButton label={item.title} onDelete={() => deletePortfolioAction(item.id)} /> : <span />}
        <SubmitButton pending={pending}>{item ? "Save project" : "Create project"}</SubmitButton>
      </div>
    </form>
  );
}

export function SettingsForm({ settings }: { settings: { businessName: string; tagline: string; contactEmail: string; contactPhone: string | null; serviceArea: string | null } }) {
  const { state, onSubmit, pending } = useFormAction(updateSettingsAction);
  const err = (n: string) => fieldError(state, n);
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormStatus state={state} />
      <Field id="businessName" label="Business name" required error={err("businessName")}>
        {(p) => <Input {...p} name="businessName" defaultValue={settings.businessName} />}
      </Field>
      <Field id="tagline" label="Tagline" optional hint="Shown in the website footer." error={err("tagline")}>
        {(p) => <Textarea {...p} name="tagline" rows={2} defaultValue={settings.tagline} />}
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="contactEmail" label="Contact email" required error={err("contactEmail")}>
          {(p) => <Input {...p} name="contactEmail" type="email" defaultValue={settings.contactEmail} />}
        </Field>
        <Field id="contactPhone" label="Contact phone" optional error={err("contactPhone")}>
          {(p) => <Input {...p} name="contactPhone" type="tel" defaultValue={settings.contactPhone ?? ""} />}
        </Field>
      </div>
      <Field id="serviceArea" label="Service area" optional hint='e.g. "the Portland area" — shown on the About page.' error={err("serviceArea")}>
        {(p) => <Input {...p} name="serviceArea" defaultValue={settings.serviceArea ?? ""} />}
      </Field>
      <SubmitButton pending={pending}>Save settings</SubmitButton>
    </form>
  );
}
