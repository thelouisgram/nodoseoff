import type { NextApiRequest, NextApiResponse } from "next";
import { getSql } from "@/lib/db";
import { requireAdmin } from "@/lib/server/admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await requireAdmin(req);
    const sql = getSql();
    const limit = Math.min(
      Math.max(parseInt(String(req.query.limit || "100"), 10) || 100, 1),
      500
    );

    const [recent, byPath, byDay] = await Promise.all([
      sql`
        SELECT id, path, "userId" AS user_id, visitor_id, referrer, created_at
        FROM visits
        ORDER BY created_at DESC
        LIMIT ${limit}
      `,
      sql`
        SELECT path, COUNT(*)::int AS count
        FROM visits
        WHERE created_at >= NOW() - INTERVAL '7 days'
        GROUP BY path
        ORDER BY count DESC
        LIMIT 20
      `,
      sql`
        SELECT date_trunc('day', created_at)::date AS day, COUNT(*)::int AS count
        FROM visits
        WHERE created_at >= NOW() - INTERVAL '14 days'
        GROUP BY 1
        ORDER BY 1 DESC
      `,
    ]);

    return res.status(200).json({ recent, byPath, byDay });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return res.status(403).json({ error: "Forbidden" });
    }
    console.error("admin/visits error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
