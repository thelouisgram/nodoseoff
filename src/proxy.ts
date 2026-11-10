import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import {
  emailLimiter,
  strictLimiter,
  apiLimiter,
  getRateLimitIdentifier,
  createRateLimitHeaders,
  handleRateLimitResponse,
} from "@/lib/ratelimit";

const publicPaths = [
  "/",
  "/login",
  "/signup",
  "/forgetpassword",
  "/reset",
  "/sso-callback",
];

const neonAuthMiddleware = auth.middleware({ loginUrl: "/login" });

function isPublicPath(pathname: string) {
  return publicPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

/** Next.js 16 Proxy (formerly Middleware) — file must remain `src/proxy.ts`. */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Complete Google/OAuth return: exchange verifier + challenge cookie for
  // session cookies. Without this, get-session works once via the verifier
  // query param but /api/auth/token stays 401 and the app bounces to /login.
  if (request.nextUrl.searchParams.has("neon_auth_session_verifier")) {
    return neonAuthMiddleware(request);
  }

  // Neon Auth proxy — do not rate-limit (OAuth/session/token chatter).
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    let rateLimitResult;
    const identifier = getRateLimitIdentifier(request);

    if (pathname === "/api/send-mail") {
      rateLimitResult = await emailLimiter.limit(identifier);
    } else if (pathname === "/api/deleteUser") {
      rateLimitResult = await strictLimiter.limit(identifier);
    } else {
      rateLimitResult = await apiLimiter.limit(identifier);
    }

    if (!rateLimitResult.success) {
      return handleRateLimitResponse(rateLimitResult);
    }

    const response = NextResponse.next();
    const headers = createRateLimitHeaders(rateLimitResult);
    Object.entries(headers).forEach(([key, value]) => {
      if (value !== undefined) response.headers.set(key, value);
    });
    return response;
  }

  // Page protection: dashboard requires client session; API routes verify JWT.
  // Guest-only: if Authorization cookie marker exists we still allow login pages
  // (AuthListener redirects). Keep login/signup public so OAuth can land.
  if (!isPublicPath(pathname) && pathname.startsWith("/dashboard")) {
    // Soft gate only — hard auth is Bearer JWT on APIs + client redirect.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
