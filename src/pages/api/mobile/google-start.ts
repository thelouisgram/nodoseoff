import type { NextApiRequest, NextApiResponse } from "next";
import { neonUpstreamOrigin } from "@/lib/auth/trusted-origins";

const RETURN_URL_RE = /^(exp|exps|nodoseoffmobile):\/\//i;

/**
 * Mobile Google entry: set return cookie, mint Neon social URL, 302 to Google.
 * No website login UI — the in-app browser only sees Google / Neon OAuth.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const returnUrl = String(req.query.return || "");
  if (!returnUrl || !RETURN_URL_RE.test(returnUrl)) {
    return res.status(400).send(
      "Invalid return URL. Open Google sign-in from the NodoseOff app."
    );
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://nodoseoff.com";

  try {
    const socialRes = await fetch(`${appUrl}/api/auth/sign-in/social`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: neonUpstreamOrigin(),
      },
      body: JSON.stringify({
        provider: "google",
        callbackURL: "/mobile-auth/complete",
        newUserCallbackURL: "/mobile-auth/complete",
        errorCallbackURL: "/mobile-auth/complete",
        disableRedirect: true,
      }),
    });

    const body = (await socialRes.json().catch(() => ({}))) as {
      url?: string;
      message?: string;
      error?: string;
    };

    if (!socialRes.ok || !body.url) {
      return res.status(socialRes.status || 502).send(
        body.message || body.error || "Could not start Google sign-in"
      );
    }

    const cookies: string[] = [
      `ndo_mobile_return=${encodeURIComponent(returnUrl)}; Path=/; Max-Age=600; SameSite=Lax`,
    ];

    const setCookie = socialRes.headers.getSetCookie?.() ?? [];
    if (setCookie.length) {
      cookies.push(...setCookie);
    } else {
      const raw = socialRes.headers.get("set-cookie");
      if (raw) {
        // Fallback: split combined Set-Cookie carefully
        raw.split(/,(?=\s*[^;=]+=)/).forEach((part) => {
          const trimmed = part.trim();
          if (trimmed) cookies.push(trimmed);
        });
      }
    }

    res.setHeader("Set-Cookie", cookies);
    res.setHeader("Cache-Control", "no-store");
    res.writeHead(302, { Location: body.url });
    res.end();
  } catch (e) {
    console.error("mobile google-start failed:", e);
    return res.status(500).send("Authentication service unavailable");
  }
}
