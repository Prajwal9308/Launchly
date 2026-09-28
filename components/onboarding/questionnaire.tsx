"use client";

import { ArrowLeft, ArrowRight, Check, CloudCheck, Loader2, TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import type { UploadedFile } from "@/components/project/use-upload";
import {
  STEPS,
  validateForSubmission,
  type DataStepKey,
  type QuestionnaireDraft,
  type StepKey,
} from "@/domain/questionnaire";
import { cn } from "@/lib/utils";
import { deleteFileAction, saveQuestionnaireStepAction, submitProjectAction } from "@/server/actions/client";
import { ReviewStep } from "./review-step";
import {
  BrandStep,
  BusinessStep,
  ContentStep,
  FeaturesStep,
  FinalStep,
  GoalsStep,
  InspirationStep,
  WebsiteStep,
  type Errors,
} from "./steps";

type FullDraft = Required<{ [K in DataStepKey]: NonNullable<QuestionnaireDraft[K]> }>;

const EMPTY: FullDraft = {
  business: { businessName: "", businessType: "", industry: undefined, description: "", address: "", phone: "", email: "", existingWebsite: "", domain: "", socialLinks: "" },
  goals: { primaryGoal: undefined, primaryGoalOther: "", idealCustomers: "", differentiators: "", keyOfferings: "" },
  website: { pages: [], pagesOther: "", services: [] },
  brand: { brandColors: "", preferredFonts: "", hasBrandGuidelines: false, brandDescription: "", styles: [] },
  content: { hasContent: undefined, contentNotes: "" },
  inspiration: { competitorSites: "", likedSites: "", likes: "", dislikes: "" },
  features: { features: [], featuresOther: "" },
  final: { budgetRange: undefined, timeframe: undefined, comments: "" },
};

function hydrate(draft: QuestionnaireDraft): FullDraft {
  const out = { ...EMPTY } as FullDraft;
  for (const key of Object.keys(EMPTY) as DataStepKey[]) {
    (out as Record<DataStepKey, unknown>)[key] = { ...EMPTY[key], ...(draft[key] ?? {}) };
  }
  return out;
}

type SaveState = "idle" | "saving" | "saved" | "error";

interface QuestionnaireProps {
  projectId: string;
  initialDraft: QuestionnaireDraft;
  initialStep: string;
  services: { slug: string; name: string; summary: string }[];
  initialFiles: UploadedFile[];
}

export function Questionnaire({ projectId, initialDraft, initialStep, services, initialFiles }: QuestionnaireProps) {
  const startIndex = Math.max(0, STEPS.findIndex((s) => s.key === initialStep));
  const [index, setIndex] = useState(startIndex);
  const [draft, setDraft] = useState<FullDraft>(() => hydrate(initialDraft));
  const [errors, setErrors] = useState<Errors>({});
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [dirty, setDirty] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>(initialFiles);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, startSubmit] = useTransition();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const draftRef = useRef(draft);
  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  const step = STEPS[index];
  const stepKey = step.key as StepKey;

  const save = useCallback(
    async (key: DataStepKey): Promise<boolean> => {
      setSaveState("saving");
      const result = await saveQuestionnaireStepAction(projectId, key, draftRef.current[key]);
      if (result.ok) {
        setSaveState("saved");
        setDirty(false);
        return true;
      }
      setSaveState("error");
      if (result.fieldErrors) {
        setErrors(Object.fromEntries(Object.entries(result.fieldErrors).map(([k, v]) => [k, v[0]])));
      } else {
        toast.error(result.error);
      }
      return false;
    },
    [projectId],
  );

  // Debounced autosave while typing so partial answers are never lost.
  useEffect(() => {
    if (!dirty || stepKey === "review") return;
    const timer = setTimeout(() => void save(stepKey as DataStepKey), 1500);
    return () => clearTimeout(timer);
  }, [draft, dirty, stepKey, save]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty || saveState === "saving") e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty, saveState]);

  const update = <K extends DataStepKey>(key: K) => (patch: Partial<FullDraft[K]>) => {
    setDraft((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
    setErrors((prev) => {
      const next = { ...prev };
      for (const field of Object.keys(patch)) delete next[field];
      return next;
    });
    setDirty(true);
  };

  const goTo = async (target: number) => {
    if (stepKey !== "review") {
      const ok = await save(stepKey as DataStepKey);
      if (!ok && target > index) return; // stay to fix invalid input
    }
    setErrors({});
    setIndex(target);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      headingRef.current?.focus();
    });
  };

  const onUploaded = (file: UploadedFile) => setFiles((prev) => [file, ...prev]);
  const onRemove = async (id: string) => {
    const result = await deleteFileAction(id);
    if (result.ok) setFiles((prev) => prev.filter((f) => f.id !== id));
    else toast.error(result.error);
  };

  const issues = validateForSubmission(draft);

  const submit = () => {
    setSubmitError(null);
    startSubmit(async () => {
      const result = await submitProjectAction(projectId);
      // On success the action redirects to the confirmation page.
      if (result && !result.ok) {
        setSubmitError(result.error);
        const first = result.fieldErrors ? Object.keys(result.fieldErrors)[0] : undefined;
        if (first) {
          const [stepName, field] = first.split(".");
          const target = STEPS.findIndex((s) => s.key === stepName);
          if (target >= 0) {
            setIndex(target);
            setErrors({ [field]: result.fieldErrors![first][0] });
          }
        }
      }
    });
  };

  const fileProps = { projectId, files, onUploaded, onRemove };

  return (
    <div className="grid gap-8 lg:grid-cols-[14rem_1fr] lg:gap-12">
      {/* Progress: vertical steps on desktop, compact bar on mobile */}
      <nav aria-label="Questionnaire progress" className="lg:sticky lg:top-24 lg:self-start">
        <div className="lg:hidden">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              Step {index + 1} of {STEPS.length}
            </span>
            <span className="text-muted">{step.title}</span>
          </div>
          <div className="mt-2 flex gap-1" aria-hidden>
            {STEPS.map((s, i) => (
              <span key={s.key} className={cn("h-1 flex-1 rounded-full", i <= index ? "bg-accent" : "bg-border")} />
            ))}
          </div>
        </div>
        <ol className="hidden space-y-1 lg:block">
          {STEPS.map((s, i) => {
            const state = i < index ? "complete" : i === index ? "current" : "upcoming";
            return (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() => void goTo(i)}
                  aria-current={state === "current" ? "step" : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                    state === "current" ? "bg-background font-medium text-foreground shadow-xs ring-1 ring-border" : "text-muted hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium",
                      state === "complete" && "border-accent bg-accent text-accent-foreground",
                      state === "current" && "border-accent text-accent",
                      state === "upcoming" && "border-border-strong text-faint",
                    )}
                    aria-hidden
                  >
                    {state === "complete" ? <Check className="size-3" strokeWidth={3} /> : i + 1}
                  </span>
                  {s.title}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="min-w-0">
        <div className="surface-raised rounded-2xl">
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-8">
            <div>
              <h1 ref={headingRef} tabIndex={-1} className="text-lg font-semibold outline-none sm:text-xl">
                {step.title}
              </h1>
              <p className="mt-1 text-sm text-muted">{step.description}</p>
            </div>
            <SaveIndicator state={saveState} />
          </div>

          <div className="px-5 py-6 sm:px-8 sm:py-8">
            {stepKey === "business" && <BusinessStep value={draft.business} onChange={update("business")} errors={errors} />}
            {stepKey === "goals" && <GoalsStep value={draft.goals} onChange={update("goals")} errors={errors} />}
            {stepKey === "website" && <WebsiteStep value={draft.website} onChange={update("website")} errors={errors} services={services} />}
            {stepKey === "brand" && <BrandStep value={draft.brand} onChange={update("brand")} errors={errors} {...fileProps} />}
            {stepKey === "content" && <ContentStep value={draft.content} onChange={update("content")} errors={errors} {...fileProps} />}
            {stepKey === "inspiration" && <InspirationStep value={draft.inspiration} onChange={update("inspiration")} errors={errors} />}
            {stepKey === "features" && <FeaturesStep value={draft.features} onChange={update("features")} errors={errors} />}
            {stepKey === "final" && <FinalStep value={draft.final} onChange={update("final")} errors={errors} />}
            {stepKey === "review" && (
              <ReviewStep draft={draft} services={services} files={files} issues={issues} onEdit={(s) => void goTo(STEPS.findIndex((x) => x.key === s))} />
            )}
            {submitError && <Alert tone="danger" title={submitError} className="mt-6" />}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border bg-canvas px-5 py-4 sm:px-8">
            <Button variant="ghost" onClick={() => void goTo(index - 1)} disabled={index === 0} className={index === 0 ? "invisible" : undefined}>
              <ArrowLeft aria-hidden /> Back
            </Button>
            {stepKey === "review" ? (
              <Button onClick={submit} loading={submitting} disabled={issues.length > 0}>
                Submit Project
              </Button>
            ) : (
              <Button onClick={() => void goTo(index + 1)} disabled={saveState === "saving"}>
                {STEPS[index + 1]?.key === "review" ? "Review Project" : "Continue"} <ArrowRight aria-hidden />
              </Button>
            )}
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-faint">Your answers save automatically. You can leave and come back at any time.</p>
      </div>
    </div>
  );
}

function SaveIndicator({ state }: { state: SaveState }) {
  return (
    <p className="flex shrink-0 items-center gap-1.5 text-xs text-faint" role="status" aria-live="polite">
      {state === "saving" && (
        <>
          <Loader2 className="size-3.5 animate-spin" aria-hidden /> Saving…
        </>
      )}
      {state === "saved" && (
        <>
          <CloudCheck className="size-3.5 text-success" aria-hidden /> Saved
        </>
      )}
      {state === "error" && (
        <>
          <TriangleAlert className="size-3.5 text-danger" aria-hidden /> <span className="text-danger">Not saved</span>
        </>
      )}
    </p>
  );
}
