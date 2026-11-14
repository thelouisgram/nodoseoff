import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/server/admin";
import { getVercelAnalytics } from "@/lib/server/vercel-analytics";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await requireAdmin(req);
    const days = Math.min(
      Math.max(parseInt(String(req.query.days || "14"), 10) || 14, 1),
      90
    );
    const analytics = await getVercelAnalytics(days);
    res.setHeader(
      "Cache-Control",
      "private, max-age=60, stale-while-revalidate=120"
    );
    return res.status(200).json(analytics);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return res.status(403).json({ error: "Forbidden" });
    }
    console.error("admin/analytics error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
