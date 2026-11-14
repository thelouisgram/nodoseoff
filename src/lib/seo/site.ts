export const SITE_NAME = "NoDoseOff";

/** Brand spellings people actually search */
export const SITE_ALTERNATE_NAMES = [
  "No Dose Off",
  "NoDose Off",
  "no dose off",
  "Nodoseoff",
] as const;

export const DEFAULT_DESCRIPTION =
  "NoDoseOff (No Dose Off) — medication tracking, common drug tracking, dose reminders, and AMANDA 6 medication AI search for long-term treatment.";

export const DEFAULT_KEYWORDS = [
  "NoDoseOff",
  "No Dose Off",
  "no dose off",
  "medication tracking",
  "drug tracking",
  "common drug tracking",
  "medication tracker",
  "dose reminders",
  "medication AI",
  "medication AI search",
  "AI medication assistant",
  "AMANDA 6",
  "adherence tracking",
  "pill reminder",
  "prescription tracker",
].join(", ");

export function siteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://nodoseoff.com";
  return raw.replace(/\/$/, "");
}
