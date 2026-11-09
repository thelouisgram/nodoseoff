import type { NextApiRequest } from "next";
import { getSql } from "@/lib/db";
import { isAdminEmail } from "@/lib/admin-emails";
import { requireAuthUser, type AuthUser } from "@/lib/server/auth";

export async function resolveUserEmail(
  user: AuthUser
): Promise<string | undefined> {
  if (user.email) return user.email;
  const sql = getSql();
  const rows = await sql`
    SELECT email FROM users WHERE "userId" = ${user.userId} LIMIT 1
  `;
  const email = rows[0]?.email;
  return typeof email === "string" ? email : undefined;
}

export async function requireAdmin(req: NextApiRequest): Promise<AuthUser> {
  const user = await requireAuthUser(req);
  const email = await resolveUserEmail(user);
  if (!isAdminEmail(email)) {
    throw new Error("FORBIDDEN");
  }
  return { ...user, email };
}
