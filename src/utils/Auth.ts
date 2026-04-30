import { createClient } from "../lib/supabase/client"; 
import { toast } from "sonner";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { store } from "../store";
import { setUserId } from "../store/appSlice";

interface LogOutProps {
    router: AppRouterInstance;
}

export const logOut = async ({router}:LogOutProps) => {
  const supabase = createClient()
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error signing out");
      }
      router.push("/login");
      store.dispatch(setUserId(""));
    } catch (error) {
      toast.error("Error signing out: " + error);
    }
  };