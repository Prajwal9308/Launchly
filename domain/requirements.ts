import {
  CONTENT_READINESS,
  FEATURES,
  PAGES,
  PRIMARY_GOALS,
  STYLES,
  optionLabel,
  splitLines,
  type QuestionnaireDraft,
} from "./questionnaire";

export interface RequirementRow {
  section: string;
  label: string;
  value: string;
}

const list = (values: string[] | undefined, options: readonly { value: string; label: string }[]) =>
  (values ?? []).map((v) => optionLabel(options, v)).join(", ");

/**
 * Flattens questionnaire answers into readable requirement rows.
 * Only answered questions produce rows — nothing is inferred.
 */
export function buildRequirementRows(
  draft: QuestionnaireDraft,
  serviceNames: Record<string, string> = {},
): RequirementRow[] {
  const rows: RequirementRow[] = [];
  const add = (section: string, label: string, value: string | undefined | null) => {
    const v = value?.trim();
    if (v) rows.push({ section, label, value: v });
  };

  const b = draft.business;
  add("Business", "Business name", b?.businessName);
  add("Business", "Business type", b?.businessType);
  add("Business", "Industry", b?.industry);
  add("Business", "Description", b?.description);
  add("Business", "Address", b?.address);
  add("Business", "Phone", b?.phone);
  add("Business", "Email", b?.email);
  add("Business", "Existing website", b?.existingWebsite);
  add("Business", "Domain", b?.domain);
  add("Business", "Social media", splitLines(b?.socialLinks).join("\n"));

  const g = draft.goals;
  if (g?.primaryGoal) {
    add(
      "Goals",
      "Primary goal",
      g.primaryGoal === "OTHER" ? `Other: ${g.primaryGoalOther}` : optionLabel(PRIMARY_GOALS, g.primaryGoal),
    );
  }
  add("Goals", "Ideal customers", g?.idealCustomers);
  add("Goals", "What makes the business different", g?.differentiators);
  add("Goals", "Most important services or products", g?.keyOfferings);

  const w = draft.website;
  add("Website", "Pages", list(w?.pages, PAGES));
  add("Website", "Other pages", w?.pagesOther);
  add("Website", "Services requested", (w?.services ?? []).map((s) => serviceNames[s] ?? s).join(", "));

  const br = draft.brand;
  add("Brand", "Brand colors", br?.brandColors);
  add("Brand", "Preferred fonts", br?.preferredFonts);
  if (br?.hasBrandGuidelines) add("Brand", "Brand guidelines", "Client has brand guidelines");
  add("Brand", "Brand description", br?.brandDescription);
  add("Brand", "Style", list(br?.styles, STYLES));

  const c = draft.content;
  if (c?.hasContent) add("Content", "Existing content", optionLabel(CONTENT_READINESS, c.hasContent));
  add("Content", "Content notes", c?.contentNotes);

  const i = draft.inspiration;
  add("Inspiration", "Competitor websites", splitLines(i?.competitorSites).join("\n"));
  add("Inspiration", "Websites they like", splitLines(i?.likedSites).join("\n"));
  add("Inspiration", "What they like", i?.likes);
  add("Inspiration", "What they dislike", i?.dislikes);

  const f = draft.features;
  add("Features", "Features", list(f?.features, FEATURES));
  add("Features", "Other features", f?.featuresOther);

  const fi = draft.final;
  add("Final details", "Budget range", fi?.budgetRange);
  add("Final details", "Launch timeframe", fi?.timeframe);
  add("Final details", "Additional comments", fi?.comments);

  return rows;
}

export interface ProjectSummary {
  businessSummary: string;
  targetAudience: string | null;
  primaryGoal: string | null;
  recommendedPages: string[];
  requestedFeatures: string[];
  brandDirection: string | null;
  contentRequirements: string | null;
  budgetAndTiming: string | null;
}

/**
 * Internal project summary assembled strictly from client answers.
 * This is deterministic (not AI) and never adds facts the client did not give.
 */
export function buildProjectSummary(draft: QuestionnaireDraft): ProjectSummary {
  const b = draft.business;
  const g = draft.goals;
  const businessParts = [
    b?.businessName,
    b?.industry ? `(${b.industry}${b.businessType ? `, ${b.businessType}` : ""})` : null,
  ].filter(Boolean);

  const brandParts = [
    draft.brand?.styles?.length ? `Style: ${list(draft.brand.styles, STYLES)}` : null,
    draft.brand?.brandColors ? `Colors: ${draft.brand.brandColors}` : null,
    draft.brand?.preferredFonts ? `Fonts: ${draft.brand.preferredFonts}` : null,
    draft.brand?.brandDescription || null,
  ].filter(Boolean);

  const contentParts = [
    draft.content?.hasContent ? `Existing content: ${optionLabel(CONTENT_READINESS, draft.content.hasContent)}` : null,
    draft.content?.contentNotes || null,
  ].filter(Boolean);

  const timing = [draft.final?.budgetRange, draft.final?.timeframe].filter(Boolean);

  const features = list(draft.features?.features, FEATURES)
    .split(", ")
    .filter(Boolean);
  if (draft.features?.featuresOther) features.push(draft.features.featuresOther);

  const pages = list(draft.website?.pages, PAGES).split(", ").filter(Boolean);
  if (draft.website?.pagesOther) pages.push(draft.website.pagesOther);

  return {
    businessSummary: [businessParts.join(" "), b?.description].filter(Boolean).join(" — "),
    targetAudience: g?.idealCustomers || null,
    primaryGoal: g?.primaryGoal
      ? g.primaryGoal === "OTHER"
        ? g.primaryGoalOther || "Other"
        : optionLabel(PRIMARY_GOALS, g.primaryGoal)
      : null,
    recommendedPages: pages,
    requestedFeatures: features,
    brandDirection: brandParts.length ? brandParts.join(". ") : null,
    contentRequirements: contentParts.length ? contentParts.join(". ") : null,
    budgetAndTiming: timing.length ? timing.join(" · ") : null,
  };
}

export const SUMMARY_LABELS: Record<keyof ProjectSummary, string> = {
  businessSummary: "Business summary",
  targetAudience: "Target audience",
  primaryGoal: "Primary goal",
  recommendedPages: "Requested pages",
  requestedFeatures: "Requested features",
  brandDirection: "Brand direction",
  contentRequirements: "Content requirements",
  budgetAndTiming: "Budget & timing",
};
