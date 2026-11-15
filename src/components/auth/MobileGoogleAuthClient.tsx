"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authClient } from "@/lib/auth/client";
import Loader from "@/components/dashboard/Loader";

/** Stores mobile return URL then starts Neon Auth Google OAuth. */
export default function MobileGoogleAuthClient() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const returnUrl = router.query.return;
    if (typeof returnUrl !== "string" || !returnUrl.trim()) {
      setError("Missing return URL. Open this page from the NodoseOff app.");
      return;
    }

    document.cookie = `ndo_mobile_return=${encodeURIComponent(
      returnUrl
    )}; Path=/; Max-Age=300; SameSite=Lax`;

    let cancelled = false;
    (async () => {
      try {
        const { error: signInError } = await authClient.signIn.social({
          provider: "google",
          callbackURL: "/mobile-auth/complete",
        });
        if (signInError && !cancelled) {
          setError(signInError.message || "Google sign-in could not be started.");
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Google sign-in could not be started."
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router.isReady, router.query.return]);

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-lg font-medium text-red-600">Sign-in failed</p>
        <p className="max-w-md text-sm text-gray-600">{error}</p>
      </div>
    );
  }

  return <Loader label="Redirecting to Google…" />;
}