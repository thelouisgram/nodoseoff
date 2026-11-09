import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

/** For login/signup: send signed-in users to the dashboard. */
export function useGuestOnlyRedirect(redirectTo = "/dashboard") {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      void router.replace(redirectTo);
    }
  }, [loading, user, router, redirectTo]);

  return { loading, isGuest: !loading && !user, isRedirecting: !loading && !!user };
}
