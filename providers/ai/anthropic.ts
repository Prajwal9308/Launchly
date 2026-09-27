import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { GROUNDING_RULES, aiBriefSchema, type AIBrief, type AIProvider, type BriefInput } from "./types";

export const DEFAULT_ANTHROPIC_MODEL = "claude-opus-5";

export class AnthropicProvider implements AIProvider {
  readonly name = "anthropic";
  private readonly client: Anthropic;

  constructor(
    apiKey: string,
    readonly model: string = DEFAULT_ANTHROPIC_MODEL,
  ) {
    this.client = new Anthropic({ apiKey });
  }

  async generateProjectBrief(input: BriefInput): Promise<AIBrief> {
    const answers = input.requirements.map((r) => `[${r.section}] ${r.label}: ${r.value}`).join("\n");

    const response = await this.client.beta.messages.parse({
      model: this.model,
      max_tokens: 16000,
      // Server-side fallback reruns the request on another model if this one declines.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium", format: betaZodOutputFormat(aiBriefSchema) },
      system: GROUNDING_RULES,
      messages: [{ role: "user", content: `Client-provided information:\n\n${answers}` }],
    });

    if (response.stop_reason === "refusal") {
      throw new Error("The AI provider declined to generate this brief.");
    }
    if (!response.parsed_output) {
      throw new Error("The AI provider returned an unexpected response.");
    }
    return response.parsed_output;
  }
}
