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

    const [users, drugs, visits24h, visits7d] = await Promise.all([
      sql`SELECT COUNT(*)::int AS count FROM users`,
      sql`SELECT COUNT(*)::int AS count FROM drugs`,
      sql`SELECT COUNT(*)::int AS count FROM visits WHERE created_at >= NOW() - INTERVAL '24 hours'`,
      sql`SELECT COUNT(*)::int AS count FROM visits WHERE created_at >= NOW() - INTERVAL '7 days'`,
    ]);

    return res.status(200).json({
      users: users[0]?.count ?? 0,
      drugs: drugs[0]?.count ?? 0,
      visits24h: visits24h[0]?.count ?? 0,
      visits7d: visits7d[0]?.count ?? 0,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return res.status(403).json({ error: "Forbidden" });
    }
    console.error("admin/overview error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
