import type { NextApiRequest, NextApiResponse } from "next";
import { requireUserId } from "@/lib/server/auth";
import {
  bootstrapUser,
  linkLegacyAccountsByEmail,
} from "@/lib/server/dashboard-data";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const userId = await requireUserId(req);
    const { name, phone, email, onlyIfMissing, linkLegacy } = req.body as {
      name?: string;
      phone?: string;
      email?: string;
      onlyIfMissing?: boolean;
      linkLegacy?: boolean;
    };
    if (!name || !email) {
      return res.status(400).json({ error: "name and email are required" });
    }
    await bootstrapUser(
      userId,
      {
        name,
        phone: phone ?? "",
        email,
      },
      { onlyIfMissing: Boolean(onlyIfMissing) }
    );
    let legacyLinked = 0;
    if (linkLegacy !== false) {
      legacyLinked = await linkLegacyAccountsByEmail(userId, email);
    }
    return res.status(200).json({ ok: true, legacyLinked });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.error(e);
    return res.status(500).json({ error: "Bootstrap failed" });
  }
}
