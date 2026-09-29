"use client";

import { useFormAction } from "@/components/forms/use-form-action";
import { IconTile, Icons } from "@/components/ui/icons";
import { contentIcon } from "@/components/marketing/icons";
import { FormStatus, fieldError } from "@/components/forms/form-status";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioItem, PricingPackage, Service, SiteSettings } from "@/db/types";
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
    <Button type="button" variant="ghost" className="text-danger hover:bg-danger-subtle hover:text-danger" loading={pending} onClick={() => { if (confirm(`Delete ${label}? This cannot be undone.`)) run(onDelete); }}>
      {!pending && <Icons.delete />} Delete
    </Button>
  );
}

/** Visual icon picker: a radio group, so it works with the keyboard and submits `icon` like any field. */
function IconPicker({ defaultValue, error }: { defaultValue: string; error?: string | string[] }) {
  const message = Array.isArray(error) ? error[0] : error;
  return (
    <fieldset aria-describedby={message ? "icon-error" : undefined}>
      <legend className="text-sm font-medium text-foreground">Icon</legend>
      <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {SERVICE_ICONS.map((key) => (
          <label
            key={key}
            className="group flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-border bg-background p-2.5 text-center transition-colors hover:border-border-strong has-[:checked]:border-accent has-[:checked]:bg-accent-subtle has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent"
          >
            <input type="radio" name="icon" value={key} defaultChecked={key === defaultValue} className="sr-only" />
            <IconTile icon={contentIcon(key)} size="sm" tone="neutral" className="group-has-[:checked]:bg-accent group-has-[:checked]:text-accent-foreground" />
            <span className="w-full truncate text-[11px] text-muted">{key}</span>
          </label>
        ))}
      </div>
      {message && (
        <p id="icon-error" className="mt-1.5 text-xs text-danger">
          {message}
        </p>
      )}
    </fieldset>
  );
}

export function ServiceForm({ service }: { service?: Service }) {
  const { state, onSubmit, pending } = useFormAction(saveServiceAction.bind(null, service?.id ?? null));
  const err = (n: string) => fieldError(state, n);
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormStatus state={state} />
      <Field id="name" label="Name" required error={err("name")}>
        {(p) => <Input {...p} name="name" defaultValue={service?.name} />}
      </Field>
      <Field id="summary" label="Short description" required hint="Shown on service cards on the home page." error={err("summary")}>
        {(p) => <Textarea {...p} name="summary" rows={2} defaultValue={service?.summary} />}
      </Field>
      <Field id="description" label="Full description" optional hint="Shown on the Services page, below the short description." error={err("description")}>
        {(p) => <Textarea {...p} name="description" rows={3} defaultValue={service?.description ?? ""} />}
      </Field>
      <Field id="features" label="Features" optional hint="One per line." error={err("features")}>
        {(p) => <Textarea {...p} name="features" rows={4} defaultValue={service?.features.join("\n")} />}
      </Field>
      <IconPicker defaultValue={service?.icon ?? "layout"} error={err("icon")} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="pricingText" label="Pricing note" optional hint='Short note shown on the Services page, e.g. "Quoted per project". Do not include prices here; prices are set per country in Pricing packages.' error={err("pricingText")}>
          {(p) => <Input {...p} name="pricingText" defaultValue={service?.pricingText ?? ""} />}
        </Field>
        <Field id="sortOrder" label="Order" error={err("sortOrder")}>
          {(p) => <Input {...p} name="sortOrder" type="number" min={0} defaultValue={service?.sortOrder ?? 0} />}
        </Field>
      </div>
      <Toggle name="published" label="Published" description="Shown on the public website and offered in the project questionnaire." defaultChecked={service?.published ?? true} />
      <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
        {service ? <DeleteButton label={service.name} onDelete={() => deleteServiceAction(service.id)} /> : <span />}
        <SubmitButton pending={pending}>{service ? "Save Service" : "Create Service"}</SubmitButton>
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
      <Field id="pricePrefix" label="Price prefix" optional hint='Shown before both prices, e.g. "Starting at".' error={err("pricePrefix")}>
        {(p) => <Input {...p} name="pricePrefix" defaultValue={pkg?.pricePrefix ?? ""} className="max-w-72" />}
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <fieldset className="space-y-3 rounded-lg border border-border p-4">
          <legend className="px-1 text-sm font-semibold">Canada pricing</legend>
          <p className="text-xs text-faint">Currency: CAD · shown as CA$</p>
          <Field id="priceCad" label="Price (CAD)" optional hint="Whole dollars. Leave blank to show “Quoted per project”." error={err("priceCad")}>
            {(p) => <Input {...p} name="priceCad" inputMode="numeric" placeholder="e.g. 1500" defaultValue={pkg?.priceCad ?? ""} />}
          </Field>
        </fieldset>
        <fieldset className="space-y-3 rounded-lg border border-border p-4">
          <legend className="px-1 text-sm font-semibold">India pricing</legend>
          <p className="text-xs text-faint">Currency: INR · shown as ₹</p>
          <Field id="priceInr" label="Price (INR)" optional hint="Whole rupees. Leave blank to show “Quoted per project”." error={err("priceInr")}>
            {(p) => <Input {...p} name="priceInr" inputMode="numeric" placeholder="e.g. 75000" defaultValue={pkg?.priceInr ?? ""} />}
          </Field>
        </fieldset>
      </div>
      <p className="text-xs text-faint">Tax wording shown under prices is set per country in Settings.</p>
      <Field id="features" label="Included features" optional hint="One per line." error={err("features")}>
        {(p) => <Textarea {...p} name="features" rows={5} defaultValue={pkg?.features.join("\n")} />}
      </Field>
      <Field id="sortOrder" label="Display order" error={err("sortOrder")}>
        {(p) => <Input {...p} name="sortOrder" type="number" min={0} defaultValue={pkg?.sortOrder ?? 0} className="max-w-32" />}
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle name="highlighted" label="Highlight" description="Adds a “Recommended” label on the Pricing page. Use only when there is a clear reason to recommend this package." defaultChecked={pkg?.highlighted ?? false} />
        <Toggle name="published" label="Published" defaultChecked={pkg?.published ?? true} />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
        {pkg ? <DeleteButton label={pkg.name} onDelete={() => deletePricingAction(pkg.id)} /> : <span />}
        <SubmitButton pending={pending}>{pkg ? "Save Package" : "Create Package"}</SubmitButton>
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
      <Field id="services" label="Services" optional hint="Comma separated, e.g. Website Development, UI/UX Design" error={err("services")}>
        {(p) => <Input {...p} name="services" defaultValue={item?.services.join(", ")} />}
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="imageUrl" label="Image" optional hint="A /public path (e.g. /portfolio/site.png) or an https:// address." error={err("imageUrl")}>
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
        <Toggle name="isDemo" label="Sample project" description="Sample projects are never shown on the public Portfolio page. Untick only for real, delivered client work you have permission to show." defaultChecked={item?.isDemo ?? true} />
        <Toggle name="featured" label="Featured" description="Listed first on the Portfolio page." defaultChecked={item?.featured ?? false} />
        <Toggle name="published" label="Published" defaultChecked={item?.published ?? true} />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
        {item ? <DeleteButton label={item.title} onDelete={() => deletePortfolioAction(item.id)} /> : <span />}
        <SubmitButton pending={pending}>{item ? "Save Portfolio Item" : "Create Portfolio Item"}</SubmitButton>
      </div>
    </form>
  );
}

type SettingsValues = Pick<
  SiteSettings,
  | "businessName"
  | "tagline"
  | "contactEmail"
  | "contactPhone"
  | "serviceArea"
  | "budgetRangesCa"
  | "budgetRangesIn"
  | "taxNoteCa"
  | "taxNoteIn"
  | "legalName"
  | "businessAddress"
  | "governingJurisdiction"
  | "privacyContactEmail"
  | "legalEffectiveDate"
>;

function SettingsGroup({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-5 border-t border-border pt-6 first-of-type:border-t-0 first-of-type:pt-0">
      <legend className="sr-only">{title}</legend>
      <div aria-hidden>
        <p className="text-sm font-semibold">{title}</p>
        {description && <p className="mt-1 text-xs text-faint">{description}</p>}
      </div>
      {children}
    </fieldset>
  );
}

export function SettingsForm({ settings }: { settings: SettingsValues }) {
  const { state, onSubmit, pending } = useFormAction(updateSettingsAction);
  const err = (n: string) => fieldError(state, n);
  const effectiveDate = settings.legalEffectiveDate ? new Date(settings.legalEffectiveDate).toISOString().slice(0, 10) : "";
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormStatus state={state} />
      <SettingsGroup title="Business details" description="Shown across the public website and in emails.">
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
        <Field id="serviceArea" label="Service areas" optional hint='e.g. "Ontario and Maharashtra". Shown on the About page. Leave blank to avoid location claims.' error={err("serviceArea")}>
          {(p) => <Input {...p} name="serviceArea" defaultValue={settings.serviceArea ?? ""} />}
        </Field>
      </SettingsGroup>

      <SettingsGroup title="Countries, budgets and tax wording" description="CoreGravity serves Canada (CAD, shown as CA$) and India (INR, shown as ₹) only.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="budgetRangesCa" label="Canada budget ranges" required hint="One per line. Offered on the contact form and questionnaire." error={err("budgetRangesCa")}>
            {(p) => <Textarea {...p} name="budgetRangesCa" rows={6} defaultValue={settings.budgetRangesCa.join("\n")} />}
          </Field>
          <Field id="budgetRangesIn" label="India budget ranges" required hint="One per line. Offered on the contact form and questionnaire." error={err("budgetRangesIn")}>
            {(p) => <Textarea {...p} name="budgetRangesIn" rows={6} defaultValue={settings.budgetRangesIn.join("\n")} />}
          </Field>
          <Field id="taxNoteCa" label="Canada tax wording" optional hint="Shown under published prices. Do not state a rate unless you are registered to charge it." error={err("taxNoteCa")}>
            {(p) => <Input {...p} name="taxNoteCa" defaultValue={settings.taxNoteCa} />}
          </Field>
          <Field id="taxNoteIn" label="India tax wording" optional hint="Shown under published prices. Do not state a GST rate or number unless it applies." error={err("taxNoteIn")}>
            {(p) => <Input {...p} name="taxNoteIn" defaultValue={settings.taxNoteIn} />}
          </Field>
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Legal details"
        description="Used by the Privacy Policy and Terms of Use. Fill these in before launch; the pages leave out anything that is blank."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="legalName" label="Legal business name" optional hint="As registered, if different from the business name." error={err("legalName")}>
            {(p) => <Input {...p} name="legalName" defaultValue={settings.legalName ?? ""} />}
          </Field>
          <Field id="governingJurisdiction" label="Governing jurisdiction" optional hint='e.g. "the Province of Ontario, Canada".' error={err("governingJurisdiction")}>
            {(p) => <Input {...p} name="governingJurisdiction" defaultValue={settings.governingJurisdiction ?? ""} />}
          </Field>
        </div>
        <Field id="businessAddress" label="Business address" optional error={err("businessAddress")}>
          {(p) => <Textarea {...p} name="businessAddress" rows={2} defaultValue={settings.businessAddress ?? ""} />}
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="privacyContactEmail" label="Privacy contact email" optional hint="Leave blank to use the contact email." error={err("privacyContactEmail")}>
            {(p) => <Input {...p} name="privacyContactEmail" type="email" defaultValue={settings.privacyContactEmail ?? ""} />}
          </Field>
          <Field id="legalEffectiveDate" label="Legal pages effective date" optional error={err("legalEffectiveDate")}>
            {(p) => <Input {...p} name="legalEffectiveDate" type="date" defaultValue={effectiveDate} />}
          </Field>
        </div>
      </SettingsGroup>

      <SubmitButton pending={pending}>Save Settings</SubmitButton>
    </form>
  );
}
