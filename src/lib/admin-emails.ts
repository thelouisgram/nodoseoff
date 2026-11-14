/**
 * Server admin allowlist. Prefer `ADMIN_EMAILS` only (never ship in the client bundle).
 * Falls back to NEXT_PUBLIC_ADMIN_EMAILS for local/dev if still present.
 */
function parseEmailList(raw?: string | null): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function getAdminEmails(): string[] {
  if (typeof process === "undefined") return [];
  // Server: ADMIN_EMAILS is authoritative (fail closed if unset).
  // Client: NEXT_PUBLIC_ADMIN_EMAILS is UI-only; /api/admin/me is the real gate.
  const raw =
    typeof window === "undefined"
      ? process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS
      : process.env.NEXT_PUBLIC_ADMIN_EMAILS;
  return parseEmailList(raw);
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}
