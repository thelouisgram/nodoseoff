import { createNeonAuth } from "@neondatabase/auth/next/server";

/**
 * Server-side Neon Auth (proxies /api/auth → Neon, mints first-party cookies).
 * Required so browser sessions work — calling the Neon Auth URL directly breaks JWTs.
 */
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
    sameSite: "lax",
  },
});
