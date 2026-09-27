import "server-only";
import { HTTP_STATUS, isAppError } from "@/lib/errors";

/**
 * CSRF defence for route handlers: state-changing requests must come from our
 * own origin. (Server Actions get equivalent built-in checks from Next.js.)
 */
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function jsonError(status: number, error: string) {
  return Response.json({ error }, { status });
}

/** Converts thrown errors into safe JSON responses. */
export function errorResponse(error: unknown) {
  if (isAppError(error)) return jsonError(HTTP_STATUS[error.code], error.message);
  console.error("[api] unexpected error", error instanceof Error ? error.message : error);
  return jsonError(500, "Something went wrong.");
}
