import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuthUser } from "@/lib/server/auth";
import {
  bootstrapUser,
  linkLegacyAccountsByEmail,
} from "@/lib/server/dashboard-data";
import { sendWelcomeIfNeeded } from "@/lib/notifications/welcome";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const authUser = await requireAuthUser(req);
    const jwtEmail = authUser.email?.trim().toLowerCase();
    if (!jwtEmail) {
      return res.status(400).json({
        error: "Authenticated email is required for bootstrap",
      });
    }

    const { name, phone, email, onlyIfMissing, linkLegacy } = req.body as {
      name?: string;
      phone?: string;
      email?: string;
      onlyIfMissing?: boolean;
      linkLegacy?: boolean;
    };

    const bodyEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    // Never trust body email for identity — must match the JWT claim.
    if (bodyEmail && bodyEmail !== jwtEmail) {
      return res.status(403).json({ error: "Email does not match session" });
    }

    const displayName =
      (typeof name === "string" && name.trim()) ||
      authUser.name?.trim() ||
      jwtEmail.split("@")[0] ||
      "User";

    await bootstrapUser(
      authUser.userId,
      {
        name: displayName,
        phone: typeof phone === "string" ? phone : "",
        email: jwtEmail,
      },
      { onlyIfMissing: Boolean(onlyIfMissing) }
    );

    let legacyLinked = 0;
    if (linkLegacy !== false) {
      legacyLinked = await linkLegacyAccountsByEmail(
        authUser.userId,
        jwtEmail
      );
    }

    let welcomeSent = false;
    try {
      const welcome = await sendWelcomeIfNeeded({
        userId: authUser.userId,
        email: jwtEmail,
        name: displayName,
      });
      welcomeSent = welcome.sent;
    } catch (mailErr) {
      console.warn("Welcome email skipped:", mailErr);
    }

    return res.status(200).json({ ok: true, legacyLinked, welcomeSent });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.error(e);
    return res.status(500).json({ error: "Bootstrap failed" });
  }
}
