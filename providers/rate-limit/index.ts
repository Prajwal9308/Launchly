/**
 * Rate limiting abstraction. The in-memory implementation is suitable for a
 * single server instance; swap in a shared store (e.g. Redis) when running
 * multiple instances. See docs/security.md.
 */
export interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export interface RateLimiter {
  limit(key: string): Promise<RateLimitResult>;
  reset(key: string): Promise<void>;
}

interface Window {
  count: number;
  resetAt: number;
}

export class MemoryRateLimiter implements RateLimiter {
  private windows = new Map<string, Window>();

  constructor(
    private readonly max: number,
    private readonly windowMs: number,
  ) {}

  async limit(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    let window = this.windows.get(key);
    if (!window || window.resetAt <= now) {
      window = { count: 0, resetAt: now + this.windowMs };
      this.windows.set(key, window);
    }
    window.count += 1;
    if (this.windows.size > 10_000) this.prune(now);
    const success = window.count <= this.max;
    return {
      success,
      remaining: Math.max(0, this.max - window.count),
      retryAfterSeconds: success ? 0 : Math.ceil((window.resetAt - now) / 1000),
    };
  }

  async reset(key: string) {
    this.windows.delete(key);
  }

  private prune(now: number) {
    for (const [key, window] of this.windows) {
      if (window.resetAt <= now) this.windows.delete(key);
    }
  }
}

const globalForLimiters = globalThis as unknown as { rateLimiters?: Record<string, RateLimiter> };
const limiters = (globalForLimiters.rateLimiters ??= {});

function limiter(name: string, max: number, windowMs: number): RateLimiter {
  return (limiters[name] ??= new MemoryRateLimiter(max, windowMs));
}

const MINUTE = 60_000;

/** Named limiters used across the app. */
export const rateLimits = {
  login: () => limiter("login", 10, 15 * MINUTE),
  signup: () => limiter("signup", 5, 60 * MINUTE),
  contact: () => limiter("contact", 5, 60 * MINUTE),
  upload: () => limiter("upload", 60, 10 * MINUTE),
  message: () => limiter("message", 30, 10 * MINUTE),
  ai: () => limiter("ai", 10, 60 * MINUTE),
};
