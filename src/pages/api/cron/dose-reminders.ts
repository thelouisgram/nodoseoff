import type { NextApiRequest, NextApiResponse } from "next";
import { processDueDoseReminders } from "@/lib/notifications/dose-reminders";

function authorizeCron(req: NextApiRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const auth = req.headers.authorization || "";
  if (auth === `Bearer ${secret}`) return true;
  const header = req.headers["x-cron-secret"];
  if (typeof header === "string" && header === secret) return true;
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET> when configured
  return false;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!authorizeCron(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await processDueDoseReminders();
    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    console.error("dose-reminders cron failed:", err);
    return res.status(500).json({ error: "Cron failed" });
  }
}
