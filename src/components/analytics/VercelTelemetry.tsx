"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { hasAnalyticsConsent } from "@/lib/cookies/consent";

/**
 * Vercel Web Analytics + Speed Insights, gated by cookie consent.
 */
export default function VercelTelemetry() {
  return (
    <>
      <Analytics
        beforeSend={(event) => {
          if (!hasAnalyticsConsent()) return null;
          return event;
        }}
      />
      <SpeedInsights
        beforeSend={(event) => {
          if (!hasAnalyticsConsent()) return null;
          return event;
        }}
      />
    </>
  );
}
