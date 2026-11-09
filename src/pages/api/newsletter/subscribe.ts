import type { NextApiRequest, NextApiResponse } from "next";
import { getSql } from "@/lib/db";
import {
  newsletterLimiter,
  createRateLimitHeaders,
} from "@/lib/ratelimit";
import { getResend } from "@/lib/email/resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clientIp(req: NextApiRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]?.trim() || "anonymous";
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].split(",")[0]?.trim() || "anonymous";
  }
  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp) return realIp;
  return "anonymous";
}

async function syncResendContact(email: string) {
  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();
  if (!audienceId || !process.env.RESEND_API_KEY?.trim()) return;

  try {
    const resend = getResend();
    const { error } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });
    if (error) {
      // Already subscribed is fine; other errors are logged only
      console.warn("Resend newsletter sync:", error);
    }
  } catch (err) {
    console.warn("Resend newsletter sync failed:", err);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const source =
    typeof body?.source === "string" ? body.source.trim().slice(0, 64) : "footer";

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    res.status(400).json({ error: "Enter a valid email address." });
    return;
  }

  const rate = await newsletterLimiter.limit(`nl:${clientIp(req)}`);
  const headers = createRateLimitHeaders(rate);
  Object.entries(headers).forEach(([k, v]) => {
    if (v) res.setHeader(k, v);
  });
  if (!rate.success) {
    res.status(429).json({ error: "Too many attempts. Try again later." });
    return;
  }

  try {
    const sql = getSql();
    const rows = await sql`
      INSERT INTO newsletter_subscribers (email, source, unsubscribed_at)
      VALUES (${email}, ${source}, NULL)
      ON CONFLICT (email) DO UPDATE SET
        unsubscribed_at = NULL,
        source = EXCLUDED.source
      RETURNING id, email, created_at
    `;

    void syncResendContact(email);

    res.status(200).json({
      ok: true,
      email: rows[0]?.email ?? email,
    });
  } catch (err) {
    console.error("newsletter/subscribe error:", err);
    res.status(500).json({ error: "Could not subscribe. Try again." });
  }
}
