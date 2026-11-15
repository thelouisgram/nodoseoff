"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/client";

/**
 * Bare post-OAuth page — no marketing chrome. Settles session then
 * server-302s into the mobile deep link via /api/mobile/google-handoff.
 */
export default function MobileGoogleCompleteClient() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        for (let i = 0; i < 3; i += 1) {
          try {
            await authClient.getSession();
          } catch {
            /* verifier may still be settling */
          }
          if (cancelled) return;
          if (i < 2) await new Promise((r) => setTimeout(r, 250));
        }
        if (!cancelled) {
          // Full navigation so ASWebAuthenticationSession catches the deep-link 302
          window.location.replace("/api/mobile/google-handoff");
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Could not complete mobile sign-in."
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: 24,
          textAlign: "center",
          background: "#f7f8fa",
          color: "#8b1e3f",
        }}
      >
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        background: "#f7f8fa",
        color: "#5c6b7a",
      }}
    >
      <p>Returning to NodoseOff…</p>
    </main>
  );
}
