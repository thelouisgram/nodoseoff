import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  COOKIE_CONSENT_EVENT,
  hasAnalyticsConsent,
  readCookieConsent,
} from "@/lib/cookies/consent";

const VISITOR_KEY = "nodoseoff_vid";

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}

function clearVisitorId() {
  try {
    localStorage.removeItem(VISITOR_KEY);
  } catch {
    /* ignore */
  }
}

export default function VisitBeacon() {
  const router = useRouter();
  const lastPath = useRef<string>("");

  useEffect(() => {
    const track = async (path: string) => {
      if (!hasAnalyticsConsent()) return;
      if (!path || path === lastPath.current) return;
      if (path.startsWith("/api")) return;
      if (
        path === "/login" ||
        path === "/signup" ||
        path.startsWith("/login/") ||
        path.startsWith("/signup/") ||
        path.startsWith("/forgetpassword") ||
        path.startsWith("/reset") ||
        path.startsWith("/sso-callback")
      ) {
        return;
      }
      lastPath.current = path;
      try {
        await fetch("/api/visits/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            path,
            visitorId: getVisitorId(),
            referrer: document.referrer || null,
          }),
          keepalive: true,
        });
      } catch {
        /* non-blocking */
      }
    };

    const syncConsent = () => {
      const consent = readCookieConsent();
      if (!consent?.analytics) {
        clearVisitorId();
        lastPath.current = "";
        return;
      }
      track(router.asPath.split("?")[0] || "/");
    };

    syncConsent();

    const onRoute = (url: string) => {
      track(url.split("?")[0] || "/");
    };
    const onConsent = () => syncConsent();

    router.events.on("routeChangeComplete", onRoute);
    window.addEventListener(COOKIE_CONSENT_EVENT, onConsent);
    return () => {
      router.events.off("routeChangeComplete", onRoute);
      window.removeEventListener(COOKIE_CONSENT_EVENT, onConsent);
    };
  }, [router]);

  return null;
}
