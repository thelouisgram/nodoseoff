import type { NextApiRequest, NextApiResponse } from "next";
import { getSql } from "@/lib/db";
import { requireAuthUser } from "@/lib/server/auth";

/** Whether the signed-in user already has an email/password credential. */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authUser = await requireAuthUser(req);
    const sql = getSql();
    const rows = await sql`
      SELECT password
      FROM neon_auth.account
      WHERE "userId" = ${authUser.userId} AND "providerId" = 'credential'
      LIMIT 1
    `;
    const password = rows[0]?.password;
    const hasPassword =
      typeof password === "string" && password.length > 0;

    const providers = await sql`
      SELECT "providerId"
      FROM neon_auth.account
      WHERE "userId" = ${authUser.userId}
    `;
    const providerIds = providers.map((p) => String(p.providerId));

    return res.status(200).json({
      hasPassword,
      providers: providerIds,
    });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.error("password-status error:", e);
    return res.status(500).json({ error: "Could not load password status" });
  }
}
