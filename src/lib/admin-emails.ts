/** Shared admin allowlist (not a secret). Override via env. */
const DEFAULT_ADMIN_EMAILS = [
  "hadesanoye01@gmail.com",
  "nodoseoff@gmail.com",
];

function parseEmailList(raw?: string | null): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function getAdminEmails(): string[] {
  const fromEnv =
    typeof process !== "undefined"
      ? parseEmailList(
          process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS
        )
      : [];
  return fromEnv.length > 0 ? fromEnv : DEFAULT_ADMIN_EMAILS;
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}
