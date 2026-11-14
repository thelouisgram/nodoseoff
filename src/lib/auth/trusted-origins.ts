/**
 * Origins the browser may use when talking to our /api/auth proxy.
 * Misty-boat Neon Auth only trusts localhost* — production + 127.0.0.1
 * need a local allowlist, then we forward a Neon-trusted Origin upstream.
 */

function parseOriginList(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/\/$/, ""));
}

const DEFAULT_APP_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://nodoseoff.com",
  "https://www.nodoseoff.com",
  "https://nodoseoff.vercel.app",
];

export function appTrustedOrigins(): Set<string> {
  const fromEnv = parseOriginList(process.env.AUTH_TRUSTED_ORIGINS);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  const list = [
    ...DEFAULT_APP_ORIGINS,
    ...fromEnv,
    ...(appUrl ? [appUrl] : []),
  ];
  return new Set(list);
}

/** Private / loopback hosts used during local `next dev` (incl. Network URL). */
export function isLocalDevOrigin(origin: string): boolean {
  try {
    const u = new URL(origin);
    if (u.protocol !== "http:") return false;
    const host = u.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") {
      return true;
    }
    if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
    if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
    if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host)) {
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

export function isAllowedAppOrigin(origin: string | null): boolean {
  if (!origin) return false;
  const normalized = origin.replace(/\/$/, "");
  if (appTrustedOrigins().has(normalized)) return true;
  if (process.env.NODE_ENV !== "production" && isLocalDevOrigin(normalized)) {
    return true;
  }
  // Vercel preview deployments for this project
  try {
    const host = new URL(normalized).hostname;
    if (
      host.endsWith(".vercel.app") &&
      (host.startsWith("nodoseoff-") || host === "nodoseoff.vercel.app")
    ) {
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

/** Origin misty-boat Auth already accepts (any localhost port). */
export function neonUpstreamOrigin(): string {
  return (
    process.env.NEON_AUTH_UPSTREAM_ORIGIN?.trim().replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

/**
 * Neon misty-boat rejects non-localhost Origins (incl. production).
 * After we validate the browser Origin ourselves, rewrite to a Neon-trusted one.
 */
export function shouldRewriteOriginForNeon(origin: string | null): boolean {
  if (!origin) return false;
  if (!isAllowedAppOrigin(origin)) return false;
  try {
    const host = new URL(origin).hostname;
    // Neon "allow localhost" covers hostname localhost only — not 127.0.0.1 / LAN.
    if (host === "localhost") return false;
  } catch {
    return true;
  }
  return true;
}
