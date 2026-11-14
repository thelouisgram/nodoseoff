"use client";

import { createAuthClient } from "@neondatabase/auth/next";

/** Same-origin client → `/api/auth` (proxied by createNeonAuth handler). */
export const authClient = createAuthClient();

function isJwt(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.split(".").length === 3 &&
    value.startsWith("eyJ")
  );
}

function isExpectedUnauth(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const status = (err as { status?: number; statusCode?: number }).status
    ?? (err as { statusCode?: number }).statusCode;
  if (status === 401 || status === 403) return true;
  const msg = String((err as { message?: string }).message || err);
  return /unauthorized|forbidden/i.test(msg);
}

const JWT_CACHE_FALLBACK_MS = 45_000;
const JWT_EXP_REFRESH_BUFFER_MS = 30_000;

let cachedAccessToken: string | null = null;
let cachedAccessTokenExpiresAt = 0;
let inflightAccessToken: Promise<string | null> | null = null;
let accessTokenCacheGeneration = 0;

function decodeJwtExpMs(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const parsed = JSON.parse(json) as { exp?: unknown };
    if (typeof parsed.exp === "number" && Number.isFinite(parsed.exp)) {
      return parsed.exp * 1000;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function cacheExpiryMsForJwt(token: string, now: number): number {
  const expMs = decodeJwtExpMs(token);
  if (expMs != null) {
    return Math.max(now, expMs - JWT_EXP_REFRESH_BUFFER_MS);
  }
  return now + JWT_CACHE_FALLBACK_MS;
}

function readCachedAccessToken(): string | null {
  if (!cachedAccessToken || !isJwt(cachedAccessToken)) {
    return null;
  }
  if (Date.now() >= cachedAccessTokenExpiresAt) {
    cachedAccessToken = null;
    cachedAccessTokenExpiresAt = 0;
    return null;
  }
  return cachedAccessToken;
}

function storeAccessTokenInCache(token: string | null): string | null {
  if (!token || !isJwt(token)) {
    cachedAccessToken = null;
    cachedAccessTokenExpiresAt = 0;
    return null;
  }
  const now = Date.now();
  cachedAccessToken = token;
  cachedAccessTokenExpiresAt = cacheExpiryMsForJwt(token, now);
  return token;
}

/** Drop in-memory JWT cache (e.g. on sign-out or 401). */
export function clearAccessTokenCache(): void {
  accessTokenCacheGeneration += 1;
  cachedAccessToken = null;
  cachedAccessTokenExpiresAt = 0;
  inflightAccessToken = null;
}

async function fetchAccessTokenFresh(): Promise<string | null> {
  try {
    const result = await authClient.token();
    if (result && typeof result === "object" && "error" in result && result.error) {
      if (!isExpectedUnauth(result.error)) {
        console.warn("authClient.token error:", result.error);
      }
    } else if (result && typeof result === "object") {
      const data =
        "data" in result && result.data && typeof result.data === "object"
          ? (result.data as { token?: unknown })
          : null;
      if (isJwt(data?.token)) return data.token;
      if ("token" in result && isJwt((result as { token?: unknown }).token)) {
        return (result as { token: string }).token;
      }
    }
  } catch (err) {
    if (!isExpectedUnauth(err)) {
      console.warn("authClient.token failed:", err);
    }
  }

  // Direct same-origin fallback (cookies included)
  try {
    const res = await fetch("/api/auth/token", {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const body = (await res.json()) as { token?: string };
      if (isJwt(body.token)) return body.token;
    }
  } catch (err) {
    if (!isExpectedUnauth(err)) {
      console.warn("/api/auth/token fetch failed:", err);
    }
  }

  try {
    const session = await authClient.getSession();
    const sessionToken = (
      session?.data as { session?: { token?: string } } | null | undefined
    )?.session?.token;
    if (isJwt(sessionToken)) return sessionToken;
  } catch {
    /* ignore */
  }

  return null;
}

export type LiveSessionUser = {
  id: string;
  email?: string | null;
  name?: string | null;
};

/**
 * Network session only — bypasses Neon Auth's in-memory getSession cache.
 * Captcha/Google iframes blur the window; AuthListener focus refresh must not
 * resurrect a signed-out user from that client cache.
 */
export async function fetchLiveSession(): Promise<{
  user: LiveSessionUser | null;
  session: unknown;
} | null> {
  try {
    const res = await fetch("/api/auth/get-session?disableCookieCache=true", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const body = (await res.json().catch(() => null)) as
      | { user?: LiveSessionUser | null; session?: unknown }
      | null;
    if (!body || typeof body !== "object") return null;
    const user = body.user?.id ? body.user : null;
    return { user, session: body.session ?? null };
  } catch {
    return null;
  }
}

/** Drop Neon client session cache (sign-out hooks) without navigating away. */
export async function invalidateClientSessionCache(): Promise<void> {
  try {
    await authClient.signOut({ disableRedirect: true });
  } catch {
    /* already signed out / network error */
  }
  clearAccessTokenCache();
}

/** Prefer Better Auth JWT; never send opaque session ids as Bearer tokens. */
export async function getAccessToken(): Promise<string | null> {
  const cached = readCachedAccessToken();
  if (cached) return cached;

  if (inflightAccessToken) {
    return inflightAccessToken;
  }

  const generation = accessTokenCacheGeneration;
  inflightAccessToken = (async () => {
    try {
      const token = await fetchAccessTokenFresh();
      if (generation !== accessTokenCacheGeneration) {
        return null;
      }
      return storeAccessTokenInCache(token);
    } finally {
      inflightAccessToken = null;
    }
  })();

  return inflightAccessToken;
}

/**
 * Session can exist briefly before a JWT is minted (AuthListener retries).
 * Wait a short window so background writes don't hard-fail mid-boot.
 */
export async function waitForAccessToken(
  attempts = 5,
  baseDelayMs = 300
): Promise<string | null> {
  for (let i = 0; i < attempts; i++) {
    const token = await getAccessToken();
    if (token) return token;
    if (i < attempts - 1) {
      await new Promise((r) => setTimeout(r, baseDelayMs * (i + 1)));
    }
  }
  return null;
}
