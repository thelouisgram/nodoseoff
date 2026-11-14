import { useEffect, useRef } from "react";
import {
  authClient,
  fetchLiveSession,
  getAccessToken,
  invalidateClientSessionCache,
} from "@/lib/auth/client";
import { useAppDispatch } from "@/store";
import { setAuthLoading, setAuthUser } from "@/store/authSlice";
import { setIsAuthenticated, setUserId } from "@/store/appSlice";
import { clearDashboardData } from "@/store/dashboardSlice";
import { apiJson } from "@/lib/api-client";

type SessionUser = {
  id: string;
  email?: string | null;
  name?: string | null;
};

const MAX_JWT_RETRIES = 4;
const FOCUS_REFRESH_DEBOUNCE_MS = 2_000;

const GUEST_AUTH_PATHS = [
  "/login",
  "/signup",
  "/forgetpassword",
  "/reset",
  "/sso-callback",
];

function isGuestAuthPath(pathname: string): boolean {
  return GUEST_AUTH_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export default function AuthListener() {
  const dispatch = useAppDispatch();
  const bootstrappedRef = useRef<string | null>(null);
  const lastFocusRefreshAtRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let jwtAttempts = 0;
    dispatch(setAuthLoading(true));

    const clearAuth = () => {
      bootstrappedRef.current = null;
      dispatch(setAuthUser(null));
      dispatch(setUserId(""));
      dispatch(setIsAuthenticated(false));
      dispatch(clearDashboardData());
      try {
        localStorage.removeItem("nodoseoff_ai_chat_id");
      } catch {
        /* ignore */
      }
    };

    const applySession = async () => {
      try {
        // Always use the network — never Neon’s in-memory getSession cache.
        const live = await fetchLiveSession();
        if (cancelled) return;

        const user = live?.user as SessionUser | null | undefined;

        if (!user?.id) {
          // Drop stale client cache so captcha focus can’t revive a past user.
          if (isGuestAuthPath(window.location.pathname)) {
            const cached = await authClient.getSession().catch(() => null);
            const cachedId = (
              cached?.data as { user?: { id?: string } } | null | undefined
            )?.user?.id;
            if (cachedId) {
              void invalidateClientSessionCache();
            }
          }
          clearAuth();
          if (!cancelled) dispatch(setAuthLoading(false));
          return;
        }

        // Keep the session even if JWT minting is briefly unavailable.
        // Clearing auth here caused a login↔dashboard bounce after OAuth.
        const email = user.email || undefined;
        dispatch(setAuthUser({ id: user.id, email }));
        dispatch(setUserId(user.id));
        dispatch(setIsAuthenticated(true));
        if (!cancelled) dispatch(setAuthLoading(false));

        // On guest pages a real session still means leave — but captcha must
        // not invent one. Live cookies are authoritative above.
        const token = await getAccessToken();
        if (cancelled) return;

        if (!token) {
          jwtAttempts += 1;
          if (jwtAttempts <= MAX_JWT_RETRIES) {
            window.setTimeout(() => {
              if (!cancelled) void applySession();
            }, 500 * jwtAttempts);
            return;
          }

          // Cookies claimed a user but JWT never arrived — treat as signed out
          // on guest pages so signup/login stay usable.
          if (isGuestAuthPath(window.location.pathname)) {
            await invalidateClientSessionCache();
            if (!cancelled) clearAuth();
            return;
          }

          console.warn("Session present but JWT unavailable after retries");
          return;
        }

        jwtAttempts = 0;

        if (email && bootstrappedRef.current !== user.id) {
          bootstrappedRef.current = user.id;
          const name = user.name?.trim() || email.split("@")[0] || "User";
          void apiJson("/api/users/bootstrap", {
            method: "POST",
            json: {
              name,
              email,
              phone: "",
              onlyIfMissing: true,
              linkLegacy: true,
            },
          }).catch((err) => {
            console.warn("Bootstrap skipped:", err);
            bootstrappedRef.current = null;
          });
        }
      } catch (err) {
        console.warn("Session check failed:", err);
        if (!cancelled) {
          clearAuth();
          dispatch(setAuthLoading(false));
        }
      }
    };

    void applySession();

    const onFocus = () => {
      // reCAPTCHA / Google iframes blur+focus the window. Refreshing session
      // from cache on that churn was logging people back into a prior account
      // on the signup page.
      if (isGuestAuthPath(window.location.pathname)) return;

      const now = Date.now();
      if (now - lastFocusRefreshAtRef.current < FOCUS_REFRESH_DEBOUNCE_MS) {
        return;
      }
      lastFocusRefreshAtRef.current = now;
      jwtAttempts = 0;
      void applySession();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
    };
  }, [dispatch]);

  return null;
}
