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
 * Custom forgot/set-password email.
 * Works for email/password users (reset) and Google-only users (first-time
 * set — Better Auth createCredential on reset-password when missing).
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
    "If an account exists for that email, you will receive a link shortly.";

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

    const accounts = await sql`
      SELECT "providerId", password
      FROM neon_auth.account
      WHERE "userId" = ${user.id}
    `;
    const hasCredentialPassword = accounts.some(
      (a) =>
        a.providerId === "credential" &&
        typeof a.password === "string" &&
        a.password.length > 0
    );
    const hasGoogle = accounts.some((a) => a.providerId === "google");

    // No auth accounts at all — nothing to recover.
    if (accounts.length === 0) {
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
    const settingFirstPassword = !hasCredentialPassword;

    const subject = settingFirstPassword
      ? "Set a password for NoDoseOff"
      : "Reset your NoDoseOff password";

    const googleNote =
      hasGoogle && settingFirstPassword
        ? `<p>You signed up with Google — you can keep using Google sign-in, or set a password to also sign in with email.</p>`
        : hasGoogle
          ? `<p>You can still sign in with Google anytime.</p>`
          : "";

    await sendResendEmail({
      to: user.email,
      subject,
      html: `
        <p>Hi ${name},</p>
        ${
          settingFirstPassword
            ? `<p>Use the link below to create a password for your NoDoseOff account.</p>`
            : `<p>We received a request to reset your NoDoseOff password.</p>`
        }
        ${googleNote}
        <p><a href="${resetUrl}">${
          settingFirstPassword ? "Set password" : "Choose a new password"
        }</a></p>
        <p>This link expires in one hour. If you did not ask for this, you can ignore this email.</p>
        <p style="color:#64748b;font-size:12px;word-break:break-all">${resetUrl}</p>
      `,
    });

    return res.status(200).json({ ok: true, message: okMessage });
  } catch (err) {
    console.error("forgot-password error:", err);
    return res.status(500).json({ error: "Could not send reset email. Please try again." });
  }
}
