import type { NextApiRequest, NextApiResponse } from "next";
import { neonUpstreamOrigin } from "@/lib/auth/trusted-origins";

const RETURN_URL_RE = /^(exp|exps|nodoseoffmobile):\/\//i;

function readCookie(req: NextApiRequest, name: string): string | null {
  const raw = req.headers.cookie;
  if (!raw) return null;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = raw.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`));
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

function clearReturnCookie(res: NextApiResponse) {
  res.setHeader(
    "Set-Cookie",
    "ndo_mobile_return=; Path=/; Max-Age=0; SameSite=Lax"
  );
}

function decodeJwtSub(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(base64, "base64").toString("utf8");
    const parsed = JSON.parse(json) as { sub?: unknown };
    return typeof parsed.sub === "string" ? parsed.sub : null;
  } catch {
    return null;
  }
}

function appendQuery(
  base: string,
  params: Record<string, string | null | undefined>
): string {
  const sep = base.includes("?") ? "&" : "?";
  const parts: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== "") {
      parts.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      );
    }
  }
  return `${base}${sep}${parts.join("&")}`;
}

function redirectError(res: NextApiResponse, ret: string, message: string) {
  clearReturnCookie(res);
  const location = appendQuery(ret, { error: message });
  res.writeHead(302, { Location: location });
  res.end();
}

/**
 * After browser Google OAuth, mint JWT and redirect to the mobile deep link.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ret = readCookie(req, "ndo_mobile_return");
  if (!ret || !RETURN_URL_RE.test(ret)) {
    clearReturnCookie(res);
    return res.status(400).json({ error: "Invalid or missing mobile return URL" });
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://nodoseoff.com";
  const cookieHeader =
    typeof req.headers.cookie === "string" ? req.headers.cookie : "";

  if (!cookieHeader) {
    redirectError(res, ret, "No session cookie after sign-in");
    return;
  }

  const upstream = {
    Accept: "application/json",
    Cookie: cookieHeader,
    Origin: neonUpstreamOrigin(),
  };

  try {
    const [tokenRes, sessionRes] = await Promise.all([
      fetch(`${appUrl}/api/auth/token`, {
        method: "GET",
        headers: upstream,
      }),
      fetch(`${appUrl}/api/auth/get-session`, {
        method: "GET",
        headers: upstream,
      }),
    ]);

    const tokenBody = (await tokenRes.json().catch(() => ({}))) as {
      token?: string;
    };
    const sessionBody = (await sessionRes.json().catch(() => ({}))) as {
      user?: { id?: string; email?: string | null; name?: string | null };
    };

    const token =
      typeof tokenBody.token === "string" && tokenBody.token.startsWith("eyJ")
        ? tokenBody.token
        : null;

    if (!token) {
      redirectError(res, ret, "Could not mint access token");
      return;
    }

    const uid =
      sessionBody.user?.id || decodeJwtSub(token) || null;
    if (!uid) {
      redirectError(res, ret, "Could not resolve user id");
      return;
    }

    clearReturnCookie(res);
    const email = sessionBody.user?.email ?? "";
    const name = sessionBody.user?.name ?? "";
    const q = ret.includes("?") ? "&" : "?";
    const location = `${ret}${q}token=${encodeURIComponent(token)}&uid=${encodeURIComponent(uid)}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;
    res.writeHead(302, { Location: location });
    res.end();
  } catch (e) {
    console.error("mobile google handoff failed:", e);
    redirectError(res, ret, "Authentication service unavailable");
  }
}