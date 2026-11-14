import type { NextApiRequest, NextApiResponse } from "next";
import { randomBytes, randomUUID } from "crypto";
import { getSql } from "@/lib/db";
import { verifyRecaptchaToken } from "@/lib/captcha";
import { sendResendEmail } from "@/lib/email/resend";
import {
  createRateLimitHeaders,
  emailLimiter,
  getRateLimitIdentifier,
} from "@/lib/ratelimit";
import { appTrustedOrigins, isAllowedAppOrigin } from "@/lib/auth/trusted-origins";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour (matches Better Auth default)

function appOriginFromRequest(req: NextApiRequest): string {
  const origin = req.headers.origin?.replace(/\/$/, "") || "";
  if (origin && isAllowedAppOrigin(origin)) return origin;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (appUrl) return appUrl;

  const first = [...appTrustedOrigins()][0];
  return first || "http://localhost:3000";
}

/**
 * Custom forgot-password that works for production Origins.
 * Misty-boat Neon Auth rejects non-localhost redirectTo URLs, so we mint a
 * Better Auth–compatible reset token ourselves and email a first-party link.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const identifier = getRateLimitIdentifier(req);
  const rate = await emailLimiter.limit(`forgot:${identifier}`);
  const headers = createRateLimitHeaders(rate);
  Object.entries(headers).forEach(([k, v]) => {
    if (v !== undefined) res.setHeader(k, v);
  });
  if (!rate.success) {
    return res.status(429).json({ error: "Too many reset requests. Try again later." });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const captchaToken =
    typeof body?.captchaToken === "string" ? body.captchaToken : "";

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const captcha = await verifyRecaptchaToken(captchaToken);
  if (!captcha.ok) {
    return res.status(400).json({ error: captcha.error });
  }

  // Always return the same message to avoid email enumeration.
  const okMessage =
    "If an account exists for that email, you will receive a reset link shortly.";

  try {
    const sql = getSql();
    const users = await sql`
      SELECT id, email, name
      FROM neon_auth."user"
      WHERE lower(email) = ${email}
      LIMIT 1
    `;
    const user = users[0] as
      | { id: string; email: string; name: string | null }
      | undefined;

    if (!user) {
      return res.status(200).json({ ok: true, message: okMessage });
    }

    // Prefer credential accounts — Google-only users can't reset a password.
    const accounts = await sql`
      SELECT id FROM neon_auth.account
      WHERE "userId" = ${user.id} AND "providerId" = 'credential'
      LIMIT 1
    `;
    if (!accounts[0]) {
      return res.status(200).json({ ok: true, message: okMessage });
    }

    const token = randomBytes(24).toString("base64url");
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

    await sql`
      DELETE FROM neon_auth.verification
      WHERE identifier LIKE ${"reset-password:%"}
        AND value = ${user.id}
    `;

    await sql`
      INSERT INTO neon_auth.verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt")
      VALUES (
        ${randomUUID()},
        ${`reset-password:${token}`},
        ${user.id},
        ${expiresAt.toISOString()},
        NOW(),
        NOW()
      )
    `;

    const origin = appOriginFromRequest(req);
    const resetUrl = `${origin}/reset?token=${encodeURIComponent(token)}`;
    const name = user.name?.trim() || "there";

    await sendResendEmail({
      to: user.email,
      subject: "Reset your NoDoseOff password",
      html: `
        <p>Hi ${name},</p>
        <p>We received a request to reset your NoDoseOff password.</p>
        <p><a href="${resetUrl}">Choose a new password</a></p>
        <p>This link expires in one hour. If you did not ask for a reset, you can ignore this email.</p>
        <p style="color:#64748b;font-size:12px;word-break:break-all">${resetUrl}</p>
      `,
    });

    return res.status(200).json({ ok: true, message: okMessage });
  } catch (err) {
    console.error("forgot-password error:", err);
    return res.status(500).json({ error: "Could not send reset email. Please try again." });
  }
}
