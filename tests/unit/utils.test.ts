import { describe, expect, it } from "vitest";
import { MemoryRateLimiter } from "@/providers/rate-limit";
import { fieldErrorsOf } from "@/lib/validation";
import { formatProjectNumber, safeRedirectPath, slugify } from "@/lib/utils";
import { z } from "zod";

describe("safeRedirectPath (open redirect protection)", () => {
  it("allows relative paths", () => expect(safeRedirectPath("/dashboard/project/1")).toBe("/dashboard/project/1"));
  it("rejects absolute and protocol-relative URLs", () => {
    expect(safeRedirectPath("https://evil.example")).toBe("/dashboard");
    expect(safeRedirectPath("//evil.example")).toBe("/dashboard");
    expect(safeRedirectPath("/\\evil.example")).toBe("/dashboard");
    expect(safeRedirectPath(undefined, "/x")).toBe("/x");
  });
});

describe("rate limiter", () => {
  it("blocks after the limit and resets", async () => {
    const limiter = new MemoryRateLimiter(2, 60_000);
    expect((await limiter.limit("k")).success).toBe(true);
    expect((await limiter.limit("k")).success).toBe(true);
    const blocked = await limiter.limit("k");
    expect(blocked.success).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    await limiter.reset("k");
    expect((await limiter.limit("k")).success).toBe(true);
  });
});

describe("helpers", () => {
  it("formats project numbers", () => expect(formatProjectNumber(7)).toBe("P-0007"));
  it("slugifies", () => expect(slugify("Maple & Olive Landscaping!")).toBe("maple-olive-landscaping"));
  it("maps zod issues to dotted field paths", () => {
    const result = z.object({ a: z.object({ b: z.string() }) }).safeParse({ a: { b: 1 } });
    expect(Object.keys(fieldErrorsOf(result.error!))).toEqual(["a.b"]);
  });
});
