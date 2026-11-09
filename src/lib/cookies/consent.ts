export type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  updatedAt: string;
};

export const COOKIE_CONSENT_KEY = "nodoseoff_cookie_consent";
export const COOKIE_CONSENT_EVENT = "nodoseoff:cookie-consent";

export function readCookieConsent(): CookiePreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookiePreferences>;
    if (typeof parsed.analytics !== "boolean") return null;
    return {
      necessary: true,
      analytics: parsed.analytics,
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function writeCookieConsent(
  prefs: Omit<CookiePreferences, "necessary" | "updatedAt"> & {
    analytics: boolean;
  }
): CookiePreferences {
  const next: CookiePreferences = {
    necessary: true,
    analytics: prefs.analytics,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(next));
    window.dispatchEvent(
      new CustomEvent(COOKIE_CONSENT_EVENT, { detail: next })
    );
  } catch {
    /* ignore quota / private mode */
  }
  return next;
}

export function hasAnalyticsConsent(): boolean {
  return readCookieConsent()?.analytics === true;
}
