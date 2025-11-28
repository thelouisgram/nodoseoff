import { createClient } from "../lib/supabase/client"; 
import { toast } from "sonner";
import { updateUserId,setDrugs, updateSchedule } from "../store/stateSlice";
import { AppDispatch } from "../store";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface LogOutProps {
    dispatch: AppDispatch;
    router: AppRouterInstance;
}

export const logOut = async ({dispatch, router}:LogOutProps) => {
  const supabase =createClient()
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error signing out");
      }
      router.push("/login");
      dispatch(updateUserId(""));
      dispatch(updateSchedule([]));
      dispatch(setDrugs([]));
    } catch (error) {
      toast.error("Error signing out: " + error);
    }
  };