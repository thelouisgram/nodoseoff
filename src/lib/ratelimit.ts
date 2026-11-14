import { NextRequest, NextResponse } from "next/server";
import type {
  RateLimitResult,
  RateLimitHeaders,
  RateLimitIdentifier,
} from "@/types/ratelimit.types";

type Bucket = {
  hits: number[];
};

/**
 * In-process sliding-window rate limiter.
 * Suitable for single-instance / serverless warm instances.
 * Limits are per process (not shared across multiple deployments).
 */
class SlidingWindowLimiter {
  private readonly buckets = new Map<string, Bucket>();
  private readonly maxEntries: number;
  private cleanupAt = 0;

  constructor(
    private readonly prefix: string,
    private readonly maxRequests: number,
    private readonly windowMs: number,
    maxEntries = 10_000
  ) {
    this.maxEntries = maxEntries;
  }

  async limit(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    this.maybeCleanup(now);

    const key = `${this.prefix}:${identifier}`;
    const bucket = this.buckets.get(key) ?? { hits: [] };
    const windowStart = now - this.windowMs;

    bucket.hits = bucket.hits.filter((t) => t > windowStart);

    if (bucket.hits.length >= this.maxRequests) {
      const oldest = bucket.hits[0] ?? now;
      const reset = oldest + this.windowMs;
      this.buckets.set(key, bucket);
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset,
        pending: Promise.resolve(),
      };
    }

    bucket.hits.push(now);
    this.buckets.set(key, bucket);

    const oldest = bucket.hits[0] ?? now;
    return {
      success: true,
      limit: this.maxRequests,
      remaining: Math.max(0, this.maxRequests - bucket.hits.length),
      reset: oldest + this.windowMs,
      pending: Promise.resolve(),
    };
  }

  private maybeCleanup(now: number) {
    // Periodic prune so abandoned keys don't grow forever.
    if (now < this.cleanupAt && this.buckets.size < this.maxEntries) return;
    this.cleanupAt = now + Math.min(this.windowMs, 60_000);

    for (const [key, bucket] of this.buckets) {
      const windowStart = now - this.windowMs;
      bucket.hits = bucket.hits.filter((t) => t > windowStart);
      if (bucket.hits.length === 0) this.buckets.delete(key);
    }

    // Hard cap: drop oldest-ish keys if still over limit.
    if (this.buckets.size > this.maxEntries) {
      const excess = this.buckets.size - this.maxEntries;
      const keys = this.buckets.keys();
      for (let i = 0; i < excess; i++) {
        const next = keys.next();
        if (next.done) break;
        this.buckets.delete(next.value);
      }
    }
  }
}

/** Auth: 5 requests / 15 minutes */
export const authLimiter = new SlidingWindowLimiter(
  "auth",
  5,
  15 * 60 * 1000
);

/** Email: 3 requests / hour */
export const emailLimiter = new SlidingWindowLimiter(
  "email",
  3,
  60 * 60 * 1000
);

/** Newsletter signup: 5 requests / hour */
export const newsletterLimiter = new SlidingWindowLimiter(
  "newsletter",
  5,
  60 * 60 * 1000
);

/** General API: 100 requests / minute */
export const apiLimiter = new SlidingWindowLimiter("api", 100, 60 * 1000);

/** Sensitive ops: 2 requests / hour */
export const strictLimiter = new SlidingWindowLimiter(
  "strict",
  2,
  60 * 60 * 1000
);

type NextApiHeaders = Record<string, string | string[] | undefined>;

function headerValue(
  headers: Headers | NextApiHeaders,
  name: string
): string | null {
  if (typeof (headers as Headers).get === "function") {
    return (headers as Headers).get(name);
  }
  const raw =
    (headers as NextApiHeaders)[name] ??
    (headers as NextApiHeaders)[name.toLowerCase()];
  if (Array.isArray(raw)) return raw[0] ?? null;
  return typeof raw === "string" ? raw : null;
}

/** Works with App Router `NextRequest` and Pages API `req.headers`. */
export function getRateLimitIdentifier(
  request: NextRequest | { headers: Headers | NextApiHeaders },
  userId?: string
): RateLimitIdentifier {
  if (userId) return `user:${userId}`;

  const forwarded = headerValue(request.headers, "x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "anonymous";

  const realIp = headerValue(request.headers, "x-real-ip");
  if (realIp) return realIp;

  return "anonymous";
}

export function createRateLimitHeaders(
  result: RateLimitResult
): RateLimitHeaders {
  const headers: RateLimitHeaders = {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.reset.toString(),
  };

  if (!result.success) {
    headers["Retry-After"] = Math.max(
      1,
      Math.ceil((result.reset - Date.now()) / 1000)
    ).toString();
  }

  return headers;
}

export function handleRateLimitResponse(
  result: RateLimitResult
): NextResponse {
  const headers = createRateLimitHeaders(result);

  return NextResponse.json(
    {
      error: "Too many requests",
      message: "You have exceeded the rate limit. Please try again later.",
      retryAfter: headers["Retry-After"],
    },
    {
      status: 429,
      headers: headers as Record<string, string>,
    }
  );
}
