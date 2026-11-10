"use client";

import type { ReactNode } from "react";
import { authClient } from "@/lib/auth/client";
import { useAppDispatch, useAppSelector } from "@/store";
import { setAuthUser } from "@/store/authSlice";
import { setIsAuthenticated, setUserId, resetAppState } from "@/store/appSlice";
import { clearDashboardData } from "@/store/dashboardSlice";

/**
 * Clear Neon Auth cookies without importing server-only createNeonAuth.
 * (Pages Router + server actions was bundling cookie secrets into the client.)
 */
async function clearRemoteSession() {
  const res = await fetch("/api/auth/sign-out", {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ disableRedirect: true }),
  }).catch((err) => {
    console.warn("sign-out fetch failed:", err);
    return null;
  });

  if (res?.ok) return;

  try {
    await authClient.signOut({ disableRedirect: true });
  } catch (err) {
    console.warn("authClient.signOut failed:", err);
  }
}

/** Session state for the whole app. */
export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  const signOut = async () => {
    try {
      await clearRemoteSession();
    } finally {
      // Always clear local state so a remote failure cannot leave the UI stuck.
      dispatch(setAuthUser(null));
      dispatch(resetAppState());
      dispatch(clearDashboardData());
    }
  };

  return {
    user,
    session: user ? { user } : null,
    loading,
    signOut,
  };
}

/** Email/password + Google sign-in — use on login (and signup Google). */
export function useAuthSignIn() {
  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({ email, password });
    if (error) {
      throw new Error(error.message || "Sign in failed");
    }
  };

  const signInWithGoogle = async () => {
    // Relative path — absolute production URLs can 403 as INVALID_CALLBACKURL
    // when Neon Auth trusted origins lag deploy aliases.
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
    if (error) {
      throw new Error(error.message || "Google sign-in failed");
    }
  };

  return {
    ready: true,
    signIn: signInWithPassword,
    signInWithGoogle,
  };
}

/** Email sign-up — use only on signup page. */
export function useAuthSignUp() {
  const dispatch = useAppDispatch();
  const { signInWithGoogle } = useAuthSignIn();

  const signUpWithPassword = async (email: string, password: string, name?: string) => {
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name: name || email.split("@")[0] || "User",
    });
    if (error) {
      return { user: null, session: null, error: new Error(error.message || "Sign up failed") };
    }
    const id = (data as { user?: { id?: string } } | null)?.user?.id;
    if (id) {
      dispatch(setAuthUser({ id, email }));
      dispatch(setUserId(id));
      dispatch(setIsAuthenticated(true));
      return { user: { id }, session: null, error: null };
    }
    return {
      user: null,
      session: null,
      error: new Error("Sign up incomplete. Check your email if verification is required."),
    };
  };

  return {
    ready: true,
    signUp: signUpWithPassword,
    signUpWithGoogle: signInWithGoogle,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return children;
}
