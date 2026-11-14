"use client";

import type { ReactNode } from "react";
import {
  authClient,
  clearAccessTokenCache,
  invalidateClientSessionCache,
} from "@/lib/auth/client";
import { useAppDispatch, useAppSelector } from "@/store";
import { setAuthUser } from "@/store/authSlice";
import { setIsAuthenticated, setUserId, resetAppState } from "@/store/appSlice";
import { clearDashboardData } from "@/store/dashboardSlice";

function clearLocalAuthArtifacts() {
  clearAccessTokenCache();
  try {
    localStorage.removeItem("nodoseoff_ai_chat_id");
  } catch {
    /* ignore */
  }
}

/** Session state for the whole app. */
export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  const signOut = async () => {
    try {
      await invalidateClientSessionCache();
    } finally {
      clearLocalAuthArtifacts();
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
  const dispatch = useAppDispatch();

  const signInWithPassword = async (email: string, password: string) => {
    clearLocalAuthArtifacts();
    const { data, error } = await authClient.signIn.email({ email, password });
    if (error) {
      throw new Error(error.message || "Sign in failed");
    }
    const user = (data as { user?: { id?: string; email?: string | null } } | null)
      ?.user;
    const id = user?.id;
    if (id) {
      dispatch(setAuthUser({ id, email: user?.email || email }));
      dispatch(setUserId(id));
      dispatch(setIsAuthenticated(true));
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
    // Drop any prior account’s client cache / chat id before creating a new one.
    clearLocalAuthArtifacts();
    try {
      await invalidateClientSessionCache();
    } catch {
      /* ignore */
    }
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
