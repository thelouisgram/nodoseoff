import type { ReactNode } from "react";
import { authClient } from "@/lib/auth/client";
import { useAppDispatch, useAppSelector } from "@/store";
import { setAuthUser } from "@/store/authSlice";
import { setIsAuthenticated, setUserId, resetAppState } from "@/store/appSlice";
import { clearDashboardData } from "@/store/dashboardSlice";

/** Session state for the whole app. */
export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  const signOut = async () => {
    await authClient.signOut();
    dispatch(setAuthUser(null));
    dispatch(resetAppState());
    dispatch(clearDashboardData());
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
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL:
        typeof window !== "undefined"
          ? `${window.location.origin}/dashboard`
          : "/dashboard",
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
