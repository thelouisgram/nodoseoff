import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuthUser } from "@/lib/server/auth";
import { resolveUserEmail } from "@/lib/server/admin";
import { isAdminEmail } from "@/lib/admin-emails";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const user = await requireAuthUser(req);
    const email = await resolveUserEmail(user);
    return res.status(200).json({
      isAdmin: isAdminEmail(email),
      email: email ?? null,
      userId: user.userId,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.error("admin/me error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
