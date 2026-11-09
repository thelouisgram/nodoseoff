import { toast } from "sonner";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { store } from "../store";
import { setUserId } from "../store/appSlice";

interface LogOutProps {
  router: AppRouterInstance;
  signOut: () => Promise<void>;
}

/** @deprecated Prefer useAuth().signOut() from AuthContext */
export const logOut = async ({ router, signOut }: LogOutProps) => {
  try {
    await signOut();
    router.push("/login");
    store.dispatch(setUserId(""));
  } catch (error) {
    toast.error("Error signing out: " + error);
  }
};
