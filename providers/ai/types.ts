import { z } from "zod";

/**
 * AI is an optional enhancement. The application works without any provider
 * configured. Providers receive ONLY client-supplied information and must not
 * invent facts; every output is stored and labelled as AI-generated.
 */

export const aiBriefSchema = z.object({
  businessSummary: z.string(),
  targetAudience: z.string(),
  primaryGoal: z.string(),
  recommendedPages: z.array(z.string()),
  requestedFeatures: z.array(z.string()),
  brandDirection: z.string(),
  contentRequirements: z.string(),
  openQuestions: z.array(z.string()),
});

export type AIBrief = z.infer<typeof aiBriefSchema>;

/** Input is always the client's own answers, serialized as label/value pairs. */
export interface BriefInput {
  requirements: { section: string; label: string; value: string }[];
}

export interface AIProvider {
  readonly name: string;
  readonly model: string;
  generateProjectBrief(input: BriefInput): Promise<AIBrief>;
  // Future capabilities (not implemented in the MVP — see docs/roadmap.md):
  // summarizeRequirements, suggestSitemap, draftWebsiteCopy, summarizeRevisionRequest
}

export const GROUNDING_RULES = `You are preparing an internal brief for a web design studio.
Use ONLY the client-provided information below. Do not invent or assume testimonials, awards,
certifications, customers, revenue, business history, locations, services, or statistics.
If information for a field was not provided, write "Not provided" (or an empty list) rather than guessing.
Recommended pages must come from pages the client requested. Put anything unclear into openQuestions.`;
