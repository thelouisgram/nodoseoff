import { auth } from "@/lib/auth/server";
import {
  isAllowedAppOrigin,
  neonUpstreamOrigin,
  shouldRewriteOriginForNeon,
} from "@/lib/auth/trusted-origins";

const neonHandlers = auth.handler();

type RouteCtx = { params: Promise<{ path: string[] }> };

/**
 * Misty-boat Neon Auth only trusts `localhost` Origins. Production
 * (`nodoseoff.vercel.app`), `127.0.0.1`, and LAN `next dev` URLs fail with
 * INVALID_ORIGIN on email sign-up. Google OAuth often still works because
 * redirects use a different path.
 *
 * We allowlist the browser Origin here, then forward a Neon-trusted Origin.
 */
function withTrustedOrigin(request: Request): Request | Response {
  const browserOrigin =
    request.headers.get("origin") ||
    request.headers.get("referer")?.split("/").slice(0, 3).join("/") ||
    null;

  // GETs (session, etc.) often omit Origin — leave alone.
  if (request.method === "GET" || request.method === "HEAD") {
    return request;
  }

  if (!browserOrigin) {
    // Neon requires Origin on sign-up POSTs; let upstream return its error.
    return request;
  }

  if (!isAllowedAppOrigin(browserOrigin)) {
    return Response.json(
      { message: "Invalid origin", code: "INVALID_ORIGIN" },
      { status: 403 }
    );
  }

  if (!shouldRewriteOriginForNeon(browserOrigin)) {
    return request;
  }

  // Only rewrite for email auth mutations — rewriting Origin on sign-out /
  // token chatter is unnecessary and can confuse session cookie clearing.
  let path = "";
  try {
    path = new URL(request.url).pathname.replace(/^\/api\/auth\/?/, "");
  } catch {
    path = "";
  }
  const rewritePaths = [
    "sign-up/email",
    "sign-in/email",
    "forget-password",
    "request-password-reset",
    "reset-password",
    "send-verification-email",
  ];
  if (!rewritePaths.some((p) => path === p || path.startsWith(`${p}/`))) {
    return request;
  }

  const headers = new Headers(request.headers);
  headers.set("origin", neonUpstreamOrigin());
  return new Request(request.url, {
    method: request.method,
    headers,
    body: request.body,
    // @ts-expect-error duplex required for streaming body in undici
    duplex: "half",
    cache: request.cache,
    credentials: request.credentials,
    integrity: request.integrity,
    keepalive: request.keepalive,
    mode: request.mode,
    redirect: request.redirect,
    referrer: request.referrer,
    referrerPolicy: request.referrerPolicy,
    signal: request.signal,
  });
}

async function proxy(
  request: Request,
  ctx: RouteCtx,
  method: keyof typeof neonHandlers
) {
  const prepared = withTrustedOrigin(request);
  if (prepared instanceof Response) return prepared;
  return neonHandlers[method](prepared as never, ctx);
}

export const GET = (req: Request, ctx: RouteCtx) => proxy(req, ctx, "GET");
export const POST = (req: Request, ctx: RouteCtx) => proxy(req, ctx, "POST");
export const PUT = (req: Request, ctx: RouteCtx) => proxy(req, ctx, "PUT");
export const PATCH = (req: Request, ctx: RouteCtx) => proxy(req, ctx, "PATCH");
export const DELETE = (req: Request, ctx: RouteCtx) =>
  proxy(req, ctx, "DELETE");
