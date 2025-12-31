import { createClient } from "../lib/supabase/client"; 
import { toast } from "sonner";
import { setDrugs, updateSchedule } from "../store/stateSlice";
import { AppDispatch } from "../store";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useAppStore } from "../store/useAppStore";

interface LogOutProps {
    dispatch: AppDispatch;
    router: AppRouterInstance;
}

export const logOut = async ({dispatch, router}:LogOutProps) => {
  const { setUserId } = useAppStore((state) => state);
  const supabase =createClient()
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error signing out");
      }
      router.push("/login");
      setUserId("");
      dispatch(updateSchedule([]));
      dispatch(setDrugs([]));
    } catch (error) {
      toast.error("Error signing out: " + error);
    }
  };