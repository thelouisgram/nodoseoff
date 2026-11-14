import type { NextApiRequest, NextApiResponse } from "next";
import { randomBytes, randomUUID } from "crypto";
import { getSql } from "@/lib/db";
import { requireAuthUser } from "@/lib/server/auth";
import { neonUpstreamOrigin } from "@/lib/auth/trusted-origins";
import {
  createRateLimitHeaders,
  getRateLimitIdentifier,
  strictLimiter,
} from "@/lib/ratelimit";

const TOKEN_TTL_MS = 10 * 60 * 1000; // short-lived — used immediately

/**
 * Let Google-only (or password-less) users set an email password while signed in.
 * Mints a Better Auth reset token and consumes it via Neon Auth reset-password
 * so hashing + credential account creation stay in Neon Auth.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let authUser: Awaited<ReturnType<typeof requireAuthUser>>;
  try {
    authUser = await requireAuthUser(req);
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const identifier = getRateLimitIdentifier(req, authUser.userId);
  const rate = await strictLimiter.limit(`set-password:${identifier}`);
  const headers = createRateLimitHeaders(rate);
  Object.entries(headers).forEach(([k, v]) => {
    if (v !== undefined) res.setHeader(k, v);
  });
  if (!rate.success) {
    return res.status(429).json({ error: "Too many attempts. Try again later." });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const newPassword =
    typeof body?.newPassword === "string" ? body.newPassword : "";

  if (newPassword.length < 8) {
    return res.status(400).json({
      error: "Please enter a password that is at least 8 characters long.",
    });
  }
  if (newPassword.length > 128) {
    return res.status(400).json({ error: "Password is too long." });
  }

  const baseUrl = process.env.NEON_AUTH_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    return res.status(500).json({ error: "Auth is not configured." });
  }

  try {
    const sql = getSql();
    const existing = await sql`
      SELECT id, password
      FROM neon_auth.account
      WHERE "userId" = ${authUser.userId} AND "providerId" = 'credential'
      LIMIT 1
    `;
    if (
      existing[0] &&
      typeof existing[0].password === "string" &&
      existing[0].password.length > 0
    ) {
      return res.status(400).json({
        error:
          "You already have a password. Use Change password instead.",
      });
    }

    const token = randomBytes(24).toString("base64url");
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

    await sql`
      DELETE FROM neon_auth.verification
      WHERE identifier LIKE ${"reset-password:%"}
        AND value = ${authUser.userId}
    `;

    await sql`
      INSERT INTO neon_auth.verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt")
      VALUES (
        ${randomUUID()},
        ${`reset-password:${token}`},
        ${authUser.userId},
        ${expiresAt.toISOString()},
        NOW(),
        NOW()
      )
    `;

    const upstream = await fetch(`${baseUrl}/reset-password`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Origin: neonUpstreamOrigin(),
      },
      body: JSON.stringify({ newPassword, token }),
    });

    const text = await upstream.text();
    if (!upstream.ok) {
      console.error("set-password upstream failed:", upstream.status, text);
      return res.status(502).json({
        error: "Could not set password. Please try again.",
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("set-password error:", err);
    return res.status(500).json({ error: "Could not set password." });
  }
}
