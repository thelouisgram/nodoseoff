import type { NextApiRequest, NextApiResponse } from "next";
import { verifyRecaptchaToken } from "@/lib/captcha";
import {
  authLimiter,
  createRateLimitHeaders,
  getRateLimitIdentifier,
} from "@/lib/ratelimit";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const identifier = getRateLimitIdentifier(req);
  const rate = await authLimiter.limit(`captcha:${identifier}`);
  const headers = createRateLimitHeaders(rate);
  Object.entries(headers).forEach(([k, v]) => {
    if (v !== undefined) res.setHeader(k, v);
  });
  if (!rate.success) {
    return res.status(429).json({ error: "Too many captcha attempts" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const token = typeof body?.token === "string" ? body.token : "";
  const forwarded = req.headers["x-forwarded-for"];
  const remoteip =
    typeof forwarded === "string"
      ? forwarded.split(",")[0]?.trim()
      : Array.isArray(forwarded)
        ? forwarded[0]
        : req.socket.remoteAddress;

  const result = await verifyRecaptchaToken(token, remoteip);
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }
  return res.status(200).json({ ok: true });
}
