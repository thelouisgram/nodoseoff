import type { NextApiRequest, NextApiResponse } from "next";
import { isAllowedAppOrigin, neonUpstreamOrigin } from "@/lib/auth/trusted-origins";

type Body = {
  email?: string;
  password?: string;
  name?: string;
  mode?: "sign-in" | "sign-up";
};

function parseSetCookie(header: string | null): string {
  if (!header) return "";
  // Node/undici may join multiple Set-Cookie with comma; take name=value pairs.
  return header
    .split(/,(?=\s*[^;=]+=)/)
    .map((part) => part.split(";")[0]?.trim())
    .filter(Boolean)
    .join("; ");
}

function cors(res: NextApiResponse, origin: string | null) {
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
}

/**
 * Mobile-friendly auth: email/password → JWT in JSON body.
 * Avoids cross-origin cookie issues from Expo web / React Native.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const origin =
    typeof req.headers.origin === "string" ? req.headers.origin : null;
  cors(res, origin);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, name, mode = "sign-in" } = (req.body || {}) as Body;
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();
  const pwd = String(password || "");

  if (!normalizedEmail || !pwd) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://nodoseoff.com";
  const authPath =
    mode === "sign-up" ? "/api/auth/sign-up/email" : "/api/auth/sign-in/email";

  try {
    const authBody =
      mode === "sign-up"
        ? {
            email: normalizedEmail,
            password: pwd,
            name:
              String(name || "").trim() ||
              normalizedEmail.split("@")[0] ||
              "User",
          }
        : { email: normalizedEmail, password: pwd };

    const authRes = await fetch(`${appUrl}${authPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: neonUpstreamOrigin(),
        Accept: "application/json",
      },
      body: JSON.stringify(authBody),
    });

    const authJson = (await authRes.json().catch(() => ({}))) as {
      user?: { id?: string; email?: string | null; name?: string | null };
      session?: { token?: string };
      message?: string;
      error?: string;
      code?: string;
    };

    if (!authRes.ok) {
      return res.status(authRes.status).json({
        error:
          authJson.message ||
          authJson.error ||
          (mode === "sign-up" ? "Sign up failed" : "Sign in failed"),
        code: authJson.code,
      });
    }

    const cookie = parseSetCookie(authRes.headers.get("set-cookie"));
    let token: string | null =
      typeof authJson.session?.token === "string" &&
      authJson.session.token.startsWith("eyJ")
        ? authJson.session.token
        : null;

    if (!token && cookie) {
      const tokenRes = await fetch(`${appUrl}/api/auth/token`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Cookie: cookie,
          Origin: neonUpstreamOrigin(),
        },
      });
      if (tokenRes.ok) {
        const tokenBody = (await tokenRes.json()) as { token?: string };
        if (tokenBody.token?.startsWith("eyJ")) {
          token = tokenBody.token;
        }
      }
    }

    if (!token) {
      return res.status(502).json({
        error:
          "Signed in but could not mint an access token. Try again in a moment.",
      });
    }

    return res.status(200).json({
      token,
      user: {
        id: authJson.user?.id,
        email: authJson.user?.email ?? normalizedEmail,
        name: authJson.user?.name ?? null,
      },
    });
  } catch (e) {
    console.error("mobile login failed:", e);
    return res.status(500).json({ error: "Authentication service unavailable" });
  }
}
