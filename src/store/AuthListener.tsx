import { useEffect, useRef } from "react";
import { authClient, getAccessToken } from "@/lib/auth/client";
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
    };

    const applySession = async () => {
      try {
        const result = await authClient.getSession();
        if (cancelled) return;
        const sessionData = result?.data as
          | { session?: unknown; user?: SessionUser }
          | null
          | undefined;
        const user = sessionData?.user;

        if (!user?.id) {
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

        const token = await getAccessToken();
        if (cancelled) return;

        if (!token) {
          jwtAttempts += 1;
          if (jwtAttempts <= MAX_JWT_RETRIES) {
            window.setTimeout(() => {
              if (!cancelled) void applySession();
            }, 500 * jwtAttempts);
          } else {
            console.warn("Session present but JWT unavailable after retries");
          }
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
