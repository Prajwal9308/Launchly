import "server-only";
import { AnthropicProvider } from "./anthropic";
import type { AIProvider } from "./types";

export type { AIProvider, AIBrief, BriefInput } from "./types";

/**
 * Returns the configured AI provider, or null when AI is disabled.
 * Callers must handle null — AI is never required.
 */
export function getAIProvider(): AIProvider | null {
  const kind = (process.env.AI_PROVIDER ?? "none").toLowerCase();
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || undefined;
  switch (kind) {
    case "anthropic":
      return apiKey ? new AnthropicProvider(apiKey, model) : null;
    // Add other providers (OpenAI, local models) by implementing AIProvider.
    default:
      return null;
  }
}

export function isAIEnabled() {
  return getAIProvider() !== null;
}
