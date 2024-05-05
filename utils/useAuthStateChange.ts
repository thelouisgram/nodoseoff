import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { updateUserId } from "../store/stateSlice";
import supabase from "./supabase";import { Subscription, Session, AuthChangeEvent } from "@supabase/supabase-js"; // Import necessary types

const useAuthStateChange = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Handle auth state changes
  useEffect(() => {
    const handleAuthStateChange = (
      event: AuthChangeEvent,
      session: Session | null
    ) => {
      if (event === "SIGNED_OUT") {
        router.push("/login");
      } else if (event === "SIGNED_IN" && session) {
        dispatch(updateUserId(session.user.id));
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, router]);
};

export default useAuthStateChange;
