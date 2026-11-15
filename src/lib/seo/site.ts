export const SITE_NAME = "NoDoseOff";

/** Brand spellings people actually search */
export const SITE_ALTERNATE_NAMES = [
  "No Dose Off",
  "NoDose Off",
  "no dose off",
  "Nodoseoff",
] as const;

export const DEFAULT_DESCRIPTION =
  "NoDoseOff (No Dose Off) — med reminder app, medication tracker, and AMANDA 6 medication AI: ask about your regimen, dose reminders, and adherence for long-term treatment.";

export const DEFAULT_KEYWORDS = [
  "NoDoseOff",
  "No Dose Off",
  "AMANDA 6",
  "AMANDA 6 AI",
  "medication AI",
  "medication AI search",
  "AI medication assistant",
  "medication chatbot",
  "ask AI about medication",
  "AI med assistant",
  "med reminder app",
  "med reminder",
  "medication reminders",
  "medication reminder",
  "medication tracker",
  "medication app",
  "pill reminder",
  "dose reminders",
  "medication reminder app",
  "adherence tracking",
].join(", ");

export function siteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://nodoseoff.com";
  return raw.replace(/\/$/, "");
}

/** Default Open Graph / Twitter share image (1200×630). Bump `v` when the asset changes so crawlers refetch. */
export const OG_IMAGE_PATH = "/og-image.jpg";
export const OG_IMAGE_VERSION = "20261115";
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export function defaultOgImagePath() {
  return `${OG_IMAGE_PATH}?v=${OG_IMAGE_VERSION}`;
}
