"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { authClient } from "@/lib/auth/client";
import Loader from "@/components/dashboard/Loader";

/** Completes OAuth / social redirect and sends the user to the dashboard. */
export default function SsoCallbackClient() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await authClient.getSession();
      } catch {
        /* session may already be set by Neon Auth redirect */
      }
      if (!cancelled) {
        await router.replace("/dashboard");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return <Loader label="Completing sign-in…" />;
}
