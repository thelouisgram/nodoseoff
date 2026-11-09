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
      Math.max(parseInt(String(req.query.limit || "50"), 10) || 50, 1),
      200
    );
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";

    const users = q
      ? await sql`
          SELECT
            u."userId",
            u.name,
            u.email,
            u.phone,
            (SELECT COUNT(*)::int FROM drugs d WHERE d."userId" = u."userId") AS drug_count
          FROM users u
          WHERE
            lower(u.email) LIKE ${`%${q.toLowerCase()}%`}
            OR lower(COALESCE(u.name, '')) LIKE ${`%${q.toLowerCase()}%`}
          ORDER BY u.email ASC
          LIMIT ${limit}
        `
      : await sql`
          SELECT
            u."userId",
            u.name,
            u.email,
            u.phone,
            (SELECT COUNT(*)::int FROM drugs d WHERE d."userId" = u."userId") AS drug_count
          FROM users u
          ORDER BY u.email ASC
          LIMIT ${limit}
        `;

    return res.status(200).json({ users });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return res.status(403).json({ error: "Forbidden" });
    }
    console.error("admin/users error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
