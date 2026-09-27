import "server-only";
import { headers } from "next/headers";

/** Best-effort client IP for rate limiting. Trust depends on your proxy setup (see docs/security.md). */
export async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}
