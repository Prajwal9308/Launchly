"use client";

import { FileText, Trash2 } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { OptionCard } from "@/components/ui/option-card";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "@/components/project/file-uploader";
import type { UploadedFile } from "@/components/project/use-upload";
import {
  BUDGET_RANGES,
  CONTENT_READINESS,
  FEATURES,
  INDUSTRIES,
  PAGES,
  PRIMARY_GOALS,
  STYLES,
  TIMEFRAMES,
  type BrandAnswers,
  type BusinessAnswers,
  type ContentAnswers,
  type FeaturesAnswers,
  type FinalAnswers,
  type GoalsAnswers,
  type InspirationAnswers,
  type WebsiteAnswers,
} from "@/domain/questionnaire";
import { formatFileSize } from "@/lib/utils";

export type Errors = Record<string, string | undefined>;

interface StepProps<T> {
  value: T;
  onChange: (patch: Partial<T>) => void;
  errors: Errors;
}

function toggle<T extends string>(list: T[] | undefined, value: T) {
  const current = list ?? [];
  return current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
}

function Fieldset({ legend, hint, error, children }: { legend: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-2.5" aria-invalid={error ? true : undefined}>
      <legend className="text-sm font-medium">{legend}</legend>
      {hint && <p className="-mt-1 text-xs text-faint">{hint}</p>}
      {children}
      {error && (
        <p className="text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

// ---------------------------------------------------------------------------

export function BusinessStep({ value, onChange, errors }: StepProps<BusinessAnswers>) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="businessName" label="Business name" required error={errors.businessName}>
          {(p) => <Input {...p} value={value.businessName} onChange={(e) => onChange({ businessName: e.target.value })} autoComplete="organization" />}
        </Field>
        <Field id="industry" label="Industry" required error={errors.industry}>
          {(p) => (
            <Select {...p} value={value.industry ?? ""} onChange={(e) => onChange({ industry: (e.target.value || undefined) as BusinessAnswers["industry"] })}>
              <option value="">Choose an industry</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>
      <Field id="businessType" label="Business type" optional hint="For example: family-owned restaurant, solo electrician, multi-location salon." error={errors.businessType}>
        {(p) => <Input {...p} value={value.businessType} onChange={(e) => onChange({ businessType: e.target.value })} />}
      </Field>
      <Field id="description" label="Business description" required hint="What does your business do, and for whom? A few sentences is perfect." error={errors.description}>
        {(p) => <Textarea {...p} rows={4} value={value.description} onChange={(e) => onChange({ description: e.target.value })} />}
      </Field>
      <Field id="address" label="Address" optional hint="Leave blank if you don't want an address on your website." error={errors.address}>
        {(p) => <Input {...p} value={value.address} onChange={(e) => onChange({ address: e.target.value })} autoComplete="street-address" />}
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="phone" label="Business phone" optional error={errors.phone}>
          {(p) => <Input {...p} type="tel" value={value.phone} onChange={(e) => onChange({ phone: e.target.value })} autoComplete="tel" />}
        </Field>
        <Field id="email" label="Business email" optional error={errors.email}>
          {(p) => <Input {...p} type="email" value={value.email} onChange={(e) => onChange({ email: e.target.value })} autoComplete="email" />}
        </Field>
        <Field id="existingWebsite" label="Existing website" optional error={errors.existingWebsite}>
          {(p) => <Input {...p} inputMode="url" placeholder="example.com" value={value.existingWebsite} onChange={(e) => onChange({ existingWebsite: e.target.value })} />}
        </Field>
        <Field id="domain" label="Domain" optional hint="If you already own one." error={errors.domain}>
          {(p) => <Input {...p} placeholder="yourbusiness.com" value={value.domain} onChange={(e) => onChange({ domain: e.target.value })} />}
        </Field>
      </div>
      <Field id="socialLinks" label="Social media links" optional hint="One link per line." error={errors.socialLinks}>
        {(p) => <Textarea {...p} rows={3} placeholder={"instagram.com/yourbusiness\nfacebook.com/yourbusiness"} value={value.socialLinks} onChange={(e) => onChange({ socialLinks: e.target.value })} />}
      </Field>
    </div>
  );
}

export function GoalsStep({ value, onChange, errors }: StepProps<GoalsAnswers>) {
  return (
    <div className="space-y-6">
      <Fieldset legend="What is the primary goal of your new website?" error={errors.primaryGoal}>
        <div className="grid gap-2 sm:grid-cols-2">
          {PRIMARY_GOALS.map((g) => (
            <OptionCard
              key={g.value}
              type="radio"
              name="primaryGoal"
              label={g.label}
              checked={value.primaryGoal === g.value}
              onChange={() => onChange({ primaryGoal: g.value })}
            />
          ))}
        </div>
      </Fieldset>
      {value.primaryGoal === "OTHER" && (
        <Field id="primaryGoalOther" label="Describe your goal" required error={errors.primaryGoalOther}>
          {(p) => <Input {...p} value={value.primaryGoalOther} onChange={(e) => onChange({ primaryGoalOther: e.target.value })} />}
        </Field>
      )}
      <Field id="idealCustomers" label="Who are your ideal customers?" optional error={errors.idealCustomers}>
        {(p) => <Textarea {...p} rows={3} value={value.idealCustomers} onChange={(e) => onChange({ idealCustomers: e.target.value })} />}
      </Field>
      <Field id="differentiators" label="What makes your business different?" optional error={errors.differentiators}>
        {(p) => <Textarea {...p} rows={3} value={value.differentiators} onChange={(e) => onChange({ differentiators: e.target.value })} />}
      </Field>
      <Field id="keyOfferings" label="What services or products are most important?" optional error={errors.keyOfferings}>
        {(p) => <Textarea {...p} rows={3} value={value.keyOfferings} onChange={(e) => onChange({ keyOfferings: e.target.value })} />}
      </Field>
    </div>
  );
}

export function WebsiteStep({
  value,
  onChange,
  errors,
  services,
}: StepProps<WebsiteAnswers> & { services: { slug: string; name: string; summary: string }[] }) {
  return (
    <div className="space-y-6">
      <Fieldset legend="Which pages do you need?" hint="Choose all that apply. We'll refine the list together." error={errors.pages}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PAGES.map((page) => (
            <OptionCard
              key={page.value}
              type="checkbox"
              label={page.label}
              checked={value.pages.includes(page.value)}
              onChange={() => onChange({ pages: toggle(value.pages, page.value) })}
            />
          ))}
        </div>
      </Fieldset>
      {value.pages.includes("OTHER") && (
        <Field id="pagesOther" label="Other pages" error={errors.pagesOther}>
          {(p) => <Input {...p} placeholder="e.g. Menu, Service areas, Careers" value={value.pagesOther} onChange={(e) => onChange({ pagesOther: e.target.value })} />}
        </Field>
      )}
      {services.length > 0 && (
        <Fieldset legend="What would you like help with?" hint="Optional. This helps us plan the right tasks.">
          <div className="grid gap-2 sm:grid-cols-2">
            {services.map((s) => (
              <OptionCard
                key={s.slug}
                type="checkbox"
                label={s.name}
                description={s.summary}
                checked={value.services.includes(s.slug)}
                onChange={() => onChange({ services: toggle(value.services, s.slug) })}
              />
            ))}
          </div>
        </Fieldset>
      )}
    </div>
  );
}

function UploadedList({ files, onRemove }: { files: UploadedFile[]; onRemove?: (id: string) => void }) {
  if (!files.length) return null;
  return (
    <ul className="space-y-1.5">
      {files.map((f) => (
        <li key={f.id} className="flex items-center gap-2.5 rounded-md border border-border bg-background px-3 py-2 text-sm">
          <FileText className="size-4 shrink-0 text-faint" aria-hidden />
          <span className="min-w-0 flex-1 truncate">{f.originalName}</span>
          <span className="text-xs text-faint">{formatFileSize(f.size)}</span>
          {onRemove && (
            <button type="button" onClick={() => onRemove(f.id)} className="rounded p-1 text-faint hover:bg-subtle hover:text-foreground" aria-label={`Remove ${f.originalName}`}>
              <Trash2 className="size-3.5" />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

interface FileStepProps {
  projectId: string;
  files: UploadedFile[];
  onUploaded: (file: UploadedFile) => void;
  onRemove: (id: string) => void;
}

export function BrandStep({ value, onChange, errors, projectId, files, onUploaded, onRemove }: StepProps<BrandAnswers> & FileStepProps) {
  const logos = files.filter((f) => f.category === "LOGO");
  const guidelines = files.filter((f) => f.category === "BRAND");
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">Logo</p>
        <p className="-mt-1 text-xs text-faint">Upload the highest quality version you have (SVG, PNG or PDF are ideal).</p>
        <FileUploader projectId={projectId} category="LOGO" label="Upload logo" onUploaded={onUploaded} refresh={false} compact />
        <UploadedList files={logos} onRemove={onRemove} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="brandColors" label="Brand colors" optional hint="Names or hex codes, e.g. navy #1D3B5C." error={errors.brandColors}>
          {(p) => <Input {...p} value={value.brandColors} onChange={(e) => onChange({ brandColors: e.target.value })} />}
        </Field>
        <Field id="preferredFonts" label="Preferred fonts" optional error={errors.preferredFonts}>
          {(p) => <Input {...p} value={value.preferredFonts} onChange={(e) => onChange({ preferredFonts: e.target.value })} />}
        </Field>
      </div>
      <div className="space-y-2">
        <OptionCard
          type="checkbox"
          label="I have brand guidelines"
          description="A document describing your logo usage, colors and fonts."
          checked={value.hasBrandGuidelines}
          onChange={() => onChange({ hasBrandGuidelines: !value.hasBrandGuidelines })}
        />
        {value.hasBrandGuidelines && (
          <>
            <FileUploader projectId={projectId} category="BRAND" label="Upload brand guidelines" onUploaded={onUploaded} refresh={false} compact />
            <UploadedList files={guidelines} onRemove={onRemove} />
          </>
        )}
      </div>
      <Fieldset legend="Which styles fit your brand?" hint="Choose up to a few.">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {STYLES.map((s) => (
            <OptionCard key={s.value} type="checkbox" label={s.label} checked={value.styles.includes(s.value)} onChange={() => onChange({ styles: toggle(value.styles, s.value) })} />
          ))}
        </div>
      </Fieldset>
      <Field id="brandDescription" label="Describe your brand" optional hint="How should your business come across to customers?" error={errors.brandDescription}>
        {(p) => <Textarea {...p} rows={3} value={value.brandDescription} onChange={(e) => onChange({ brandDescription: e.target.value })} />}
      </Field>
    </div>
  );
}

export function ContentStep({ value, onChange, errors, projectId, files, onUploaded, onRemove }: StepProps<ContentAnswers> & FileStepProps) {
  const contentFiles = files.filter((f) => ["CONTENT", "PHOTO", "DOCUMENT"].includes(f.category));
  return (
    <div className="space-y-6">
      <Fieldset legend="Do you already have website content?" error={errors.hasContent}>
        <div className="grid gap-2 sm:grid-cols-3">
          {CONTENT_READINESS.map((c) => (
            <OptionCard
              key={c.value}
              type="radio"
              name="hasContent"
              label={c.label}
              description={c.description}
              checked={value.hasContent === c.value}
              onChange={() => onChange({ hasContent: c.value })}
            />
          ))}
        </div>
      </Fieldset>
      <div className="space-y-2">
        <p className="text-sm font-medium">Upload content</p>
        <p className="-mt-1 text-xs text-faint">Photos, existing text, brochures, menus, product information — anything useful.</p>
        <FileUploader projectId={projectId} category="CONTENT" onUploaded={onUploaded} refresh={false} />
        <UploadedList files={contentFiles} onRemove={onRemove} />
      </div>
      <Field id="contentNotes" label="Notes about your content" optional error={errors.contentNotes}>
        {(p) => <Textarea {...p} rows={3} placeholder="e.g. We have photos of our work but need help writing service descriptions." value={value.contentNotes} onChange={(e) => onChange({ contentNotes: e.target.value })} />}
      </Field>
    </div>
  );
}

export function InspirationStep({ value, onChange, errors }: StepProps<InspirationAnswers>) {
  return (
    <div className="space-y-5">
      <Field id="competitorSites" label="Competitor websites" optional hint="One link per line." error={errors.competitorSites}>
        {(p) => <Textarea {...p} rows={3} value={value.competitorSites} onChange={(e) => onChange({ competitorSites: e.target.value })} />}
      </Field>
      <Field id="likedSites" label="Websites you like" optional hint="Any industry. One link per line." error={errors.likedSites}>
        {(p) => <Textarea {...p} rows={3} value={value.likedSites} onChange={(e) => onChange({ likedSites: e.target.value })} />}
      </Field>
      <Field id="likes" label="What do you like about them?" optional error={errors.likes}>
        {(p) => <Textarea {...p} rows={3} value={value.likes} onChange={(e) => onChange({ likes: e.target.value })} />}
      </Field>
      <Field id="dislikes" label="Anything you dislike or want to avoid?" optional error={errors.dislikes}>
        {(p) => <Textarea {...p} rows={3} value={value.dislikes} onChange={(e) => onChange({ dislikes: e.target.value })} />}
      </Field>
    </div>
  );
}

export function FeaturesStep({ value, onChange, errors }: StepProps<FeaturesAnswers>) {
  return (
    <div className="space-y-6">
      <Fieldset legend="Which features does your website need?" hint="Choose all that apply.">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <OptionCard key={f.value} type="checkbox" label={f.label} checked={value.features.includes(f.value)} onChange={() => onChange({ features: toggle(value.features, f.value) })} />
          ))}
        </div>
      </Fieldset>
      {value.features.includes("OTHER") && (
        <Field id="featuresOther" label="Other features" error={errors.featuresOther}>
          {(p) => <Input {...p} value={value.featuresOther} onChange={(e) => onChange({ featuresOther: e.target.value })} />}
        </Field>
      )}
    </div>
  );
}

export function FinalStep({ value, onChange, errors }: StepProps<FinalAnswers>) {
  return (
    <div className="space-y-6">
      <Fieldset legend="Budget range" error={errors.budgetRange}>
        <div className="grid gap-2 sm:grid-cols-3">
          {BUDGET_RANGES.map((b) => (
            <OptionCard key={b} type="radio" name="budgetRange" label={b} checked={value.budgetRange === b} onChange={() => onChange({ budgetRange: b })} />
          ))}
        </div>
      </Fieldset>
      <Fieldset legend="Desired launch timeframe" error={errors.timeframe}>
        <div className="grid gap-2 sm:grid-cols-3">
          {TIMEFRAMES.map((t) => (
            <OptionCard key={t} type="radio" name="timeframe" label={t} checked={value.timeframe === t} onChange={() => onChange({ timeframe: t })} />
          ))}
        </div>
      </Fieldset>
      <Field id="comments" label="Additional comments" optional error={errors.comments}>
        {(p) => <Textarea {...p} rows={4} value={value.comments} onChange={(e) => onChange({ comments: e.target.value })} />}
      </Field>
    </div>
  );
}
