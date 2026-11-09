import type { NextApiRequest, NextApiResponse } from "next";
import { requireUserId } from "@/lib/server/auth";
import { loadDashboardForUser } from "@/lib/server/dashboard-data";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const userId = await requireUserId(req);
    const data = await loadDashboardForUser(userId);
    return res.status(200).json(data);
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (e instanceof Error && e.message === "USER_NOT_FOUND") {
      return res.status(404).json({ error: "User profile not found. Complete signup setup." });
    }
    console.error(e);
    return res.status(500).json({ error: "Failed to load dashboard" });
  }
}
