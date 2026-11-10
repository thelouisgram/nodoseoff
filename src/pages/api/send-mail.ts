import type { NextApiRequest, NextApiResponse } from "next";
import { sendResendEmail } from "@/lib/email/resend";
import { emailLimiter, createRateLimitHeaders } from "@/lib/ratelimit";
import { requireAuthUser } from "@/lib/server/auth";

function isAdminEmail(email: string) {
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  let authUser: Awaited<ReturnType<typeof requireAuthUser>>;
  try {
    authUser = await requireAuthUser(req);
  } catch {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const to = typeof body?.to === "string" ? body.to.trim() : "";
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const html = typeof body?.html === "string" ? body.html : "";

  if (!to || !subject || !html) {
    res.status(400).json({ error: "Missing required fields: to, subject, html" });
    return;
  }

  // Authenticated users may only email themselves unless they are an admin.
  const callerEmail = authUser.email?.trim().toLowerCase();
  if (
    !callerEmail ||
    (to.toLowerCase() !== callerEmail && !isAdminEmail(callerEmail))
  ) {
    res.status(403).json({ error: "Forbidden recipient" });
    return;
  }

  if (subject.length > 200 || html.length > 100_000) {
    res.status(400).json({ error: "Payload too large" });
    return;
  }

  try {
    const rate = await emailLimiter.limit(
      `mail:${authUser.userId}:${to.toLowerCase()}`
    );
    const headers = createRateLimitHeaders(rate);
    Object.entries(headers).forEach(([k, v]) => {
      if (v) res.setHeader(k, v);
    });
    if (!rate.success) {
      res.status(429).json({ error: "Too many emails. Try again later." });
      return;
    }

    const data = await sendResendEmail({ to, subject, html });
    res.status(200).json({ data });
  } catch (err) {
    console.error("send-mail error:", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    const status = /RESEND_API_KEY/i.test(message) ? 503 : 500;
    res.status(status).json({
      error: status === 503 ? message : "Internal server error",
    });
  }
}
