import type { NextApiRequest, NextApiResponse } from "next";
import { isAllowedAppOrigin, neonUpstreamOrigin } from "@/lib/auth/trusted-origins";

/**
 * Exchange a Google ID token for a NodoseOff JWT (mobile).
 * Requires Neon Auth / Better Auth social idToken support on the proxy.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const origin =
    typeof req.headers.origin === "string" ? req.headers.origin : null;
  if (origin && isAllowedAppOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Origin"
  );

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const idToken = String((req.body as { idToken?: string })?.idToken || "");
  if (!idToken) {
    return res.status(400).json({ error: "idToken required" });
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://nodoseoff.com";

  try {
    const authRes = await fetch(`${appUrl}/api/auth/sign-in/social`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: neonUpstreamOrigin(),
        Accept: "application/json",
      },
      body: JSON.stringify({
        provider: "google",
        idToken: { token: idToken },
      }),
    });

    const authJson = (await authRes.json().catch(() => ({}))) as {
      user?: { id?: string; email?: string | null; name?: string | null };
      session?: { token?: string };
      message?: string;
      error?: string;
    };

    if (!authRes.ok) {
      return res.status(authRes.status).json({
        error: authJson.message || authJson.error || "Google sign-in failed",
      });
    }

    let token =
      typeof authJson.session?.token === "string" &&
      authJson.session.token.startsWith("eyJ")
        ? authJson.session.token
        : null;

    const setCookie = authRes.headers.get("set-cookie");
    if (!token && setCookie) {
      const cookie = setCookie
        .split(/,(?=\s*[^;=]+=)/)
        .map((part) => part.split(";")[0]?.trim())
        .filter(Boolean)
        .join("; ");
      const tokenRes = await fetch(`${appUrl}/api/auth/token`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Cookie: cookie,
          Origin: neonUpstreamOrigin(),
        },
      });
      if (tokenRes.ok) {
        const body = (await tokenRes.json()) as { token?: string };
        if (body.token?.startsWith("eyJ")) token = body.token;
      }
    }

    if (!token || !authJson.user?.id) {
      return res.status(502).json({
        error: "Google sign-in succeeded but token minting failed",
      });
    }

    return res.status(200).json({
      token,
      user: {
        id: authJson.user.id,
        email: authJson.user.email,
        name: authJson.user.name,
      },
    });
  } catch (e) {
    console.error("mobile google login failed:", e);
    return res.status(500).json({ error: "Google authentication unavailable" });
  }
}
