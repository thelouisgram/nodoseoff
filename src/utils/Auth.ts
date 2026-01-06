import { createClient } from "../lib/supabase/client"; 
import { toast } from "sonner";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useAppStore } from "../store/useAppStore";

interface LogOutProps {
    router: AppRouterInstance;
}

export const logOut = async ({router}:LogOutProps) => {
  const { setUserId } = useAppStore.getState();
  const supabase = createClient()
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error signing out");
      }
      router.push("/login");
      setUserId("");
    } catch (error) {
      toast.error("Error signing out: " + error);
    }
  };