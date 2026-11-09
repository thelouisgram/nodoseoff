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

/** Prefer Better Auth JWT; never send opaque session ids as Bearer tokens. */
export async function getAccessToken(): Promise<string | null> {
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
