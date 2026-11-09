import type { NextApiRequest, NextApiResponse } from "next";
import { getSql } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/server/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const path =
      typeof body?.path === "string" && body.path.startsWith("/")
        ? body.path.slice(0, 500)
        : null;
    if (!path) {
      res.status(400).json({ error: "Invalid path" });
      return;
    }

    const visitorId =
      typeof body?.visitorId === "string"
        ? body.visitorId.slice(0, 128)
        : null;
    const referrer =
      typeof body?.referrer === "string" ? body.referrer.slice(0, 500) : null;
    const userAgent = (req.headers["user-agent"] || "").slice(0, 500) || null;
    const userId = await getUserIdFromRequest(req);

    const sql = getSql();
    // Schema: path, "userId", visitor_id, referrer, ua, created_at
    await sql`
      INSERT INTO visits (path, "userId", visitor_id, referrer, ua)
      VALUES (${path}, ${userId}, ${visitorId}, ${referrer}, ${userAgent})
    `;

    res.status(204).end();
  } catch (error) {
    // Tracking must never break the app
    console.error("visits/track error:", error);
    res.status(204).end();
  }
}
