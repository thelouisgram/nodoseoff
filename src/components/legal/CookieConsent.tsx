"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  readCookieConsent,
  writeCookieConsent,
  type CookiePreferences,
} from "@/lib/cookies/consent";

type View = "hidden" | "banner" | "prefs";

export default function CookieConsent() {
  const [view, setView] = useState<View>("hidden");
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    const existing = readCookieConsent();
    if (!existing) {
      setView("banner");
      return;
    }
    setAnalytics(existing.analytics);

    const openPrefs = () => {
      const current = readCookieConsent();
      setAnalytics(current?.analytics ?? false);
      setView("prefs");
    };
    window.addEventListener("nodoseoff:open-cookie-settings", openPrefs);
    return () => {
      window.removeEventListener("nodoseoff:open-cookie-settings", openPrefs);
    };
  }, []);

  const save = (prefs: { analytics: boolean }) => {
    const next = writeCookieConsent(prefs);
    setAnalytics(next.analytics);
    setView("hidden");
  };

  if (view === "hidden") return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[80] p-3 ss:p-4"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-black/[0.08] bg-white p-4 shadow-soft-lg ss:p-5">
        {view === "banner" ? (
          <>
            <h2
              id="cookie-consent-title"
              className="text-[16px] font-bold tracking-tight text-soft-ink"
            >
              Cookies &amp; privacy
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-soft-muted ss:text-[14px]">
              We use necessary cookies to keep you signed in, and optional
              analytics to improve NoDoseOff. See our{" "}
              <Link href="/cookies" className="font-semibold text-soft-primary underline">
                Cookie Policy
              </Link>
              ,{" "}
              <Link href="/privacy" className="font-semibold text-soft-primary underline">
                Privacy
              </Link>
              , and{" "}
              <Link href="/terms" className="font-semibold text-soft-primary underline">
                Terms
              </Link>
              .
            </p>
            <div className="mt-4 flex flex-col gap-2 ss:flex-row ss:flex-wrap">
              <button
                type="button"
                onClick={() => save({ analytics: true })}
                className="rounded-xl bg-soft-primary px-4 py-2.5 text-[13px] font-semibold text-white transition hover:opacity-95"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={() => save({ analytics: false })}
                className="rounded-xl border border-black/[0.08] bg-soft-canvas px-4 py-2.5 text-[13px] font-semibold text-soft-ink transition hover:bg-white"
              >
                Necessary only
              </button>
              <button
                type="button"
                onClick={() => setView("prefs")}
                className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-soft-primary transition hover:underline"
              >
                Preferences
              </button>
            </div>
          </>
        ) : (
          <>
            <h2
              id="cookie-consent-title"
              className="text-[16px] font-bold tracking-tight text-soft-ink"
            >
              Cookie preferences
            </h2>
            <div className="mt-4 space-y-3">
              <label className="flex items-start gap-3 rounded-xl bg-soft-canvas/80 px-3.5 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="mt-1"
                  aria-label="Necessary cookies always on"
                />
                <span>
                  <span className="block text-[14px] font-semibold text-soft-ink">
                    Necessary
                  </span>
                  <span className="mt-0.5 block text-[12px] text-soft-muted">
                    Auth, security, and remembering this choice. Always on.
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-soft-canvas/80 px-3.5 py-3">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  <span className="block text-[14px] font-semibold text-soft-ink">
                    Analytics
                  </span>
                  <span className="mt-0.5 block text-[12px] text-soft-muted">
                    Anonymous page visits so we can improve the product.
                  </span>
                </span>
              </label>
            </div>
            <div className="mt-4 flex flex-col gap-2 ss:flex-row">
              <button
                type="button"
                onClick={() => save({ analytics })}
                className="rounded-xl bg-soft-primary px-4 py-2.5 text-[13px] font-semibold text-white transition hover:opacity-95"
              >
                Save preferences
              </button>
              <button
                type="button"
                onClick={() => setView("banner")}
                className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-soft-muted transition hover:text-soft-ink"
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Open the preferences panel from footer / settings links. */
export function openCookieSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("nodoseoff:open-cookie-settings"));
}

export type { CookiePreferences };
