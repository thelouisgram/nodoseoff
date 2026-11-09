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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader />
      <p className="mt-4 text-sm text-gray-500 font-karla">
        Completing sign-in…
      </p>
    </div>
  );
}
