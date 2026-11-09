import type { NextApiRequest, NextApiResponse } from "next";
import { requireUserId } from "@/lib/server/auth";
import { cleanupExpiredDrugs } from "@/lib/server/dashboard-data";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const userId = await requireUserId(req);
    const { updatedCompletedList, expiredDrugs } = req.body as {
      updatedCompletedList: unknown[];
      expiredDrugs: Array<{ id?: number }>;
    };
    await cleanupExpiredDrugs(userId, updatedCompletedList ?? [], expiredDrugs ?? []);
    return res.status(200).json({ ok: true });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.error(e);
    return res.status(500).json({ error: "Cleanup failed" });
  }
}
