"use server";

import { auth } from "@/lib/auth/server";

/** Clear Neon Auth session cookies on the server (preferred over client-only sign-out). */
export async function signOutAction(): Promise<{ ok: boolean; error?: string }> {
  try {
    await auth.signOut();
    return { ok: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Sign out failed";
    console.warn("signOutAction failed:", message);
    return { ok: false, error: message };
  }
}
