// utils/fetchData.ts
import { createClient } from "../lib/supabase/client";
import {
  setDrugs,
  updateAllergies,
  updateCompletedDrugs,
  updateHerbs,
  updateInfo,
  updateOtcDrugs,
  updateProfilePicture,
  updateSchedule,
} from "../store/stateSlice";
import { toast } from "sonner";
import type { AppDispatch } from "./../store";
import { useAppStore } from "../store/useAppStore";

export const fetchData = async (
  dispatch: AppDispatch,
  userId: string,
  setIsLoading: (value: boolean) => void
) => {
  const supabase = createClient();

  try {
    // 1. Parallel Fetching (Keep this, it is good)
    const [
      userData,
      profilePictureData,
      drugsData,
      completedDrugsData,
      allergiesData,
      drugHistory,
      scheduleData,
    ] = await Promise.all([
      supabase.from("users").select("name, phone, email").eq("userId", userId).single(), // Use .single() for 1 row
      supabase.storage.from("profile-picture").list(`${userId}/`, { limit: 1, offset: 0 }),
      supabase.from("drugs").select("*").eq("userId", userId),
      supabase.from("completedDrugs").select("completedDrugs").eq("userId", userId).single(),
      supabase.from("allergies").select("*").eq("userId", userId),
      supabase.from("drugHistory").select("otcDrugs, herbs").eq("userId", userId).single(),
      supabase.from("schedule").select("schedule").eq("userId", userId).single(),
    ]);

    // 2. Immediate Error Check
    if (userData.error || drugsData.error) {
       throw new Error("Critical data failed to load");
    }

    // User Info
    dispatch(updateInfo([userData.data ?? {}]));

    // Profile Picture
    dispatch(updateProfilePicture(profilePictureData.data?.[0]?.name ?? ""));

    // Allergies
    dispatch(updateAllergies(allergiesData.data ?? []));

    // History & Schedule
    dispatch(updateHerbs(drugHistory.data?.herbs ?? []));
    dispatch(updateOtcDrugs(drugHistory.data?.otcDrugs ?? []));
    dispatch(updateSchedule(scheduleData.data?.schedule ?? []));

    // --- SMART DRUG LOGIC ---
    
    const drugs = drugsData.data ?? [];
    const existingCompleted = completedDrugsData.data?.completedDrugs ?? [];

    const today = new Date();
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    // Calculate Active vs Expired in Memory
    const activeDrugs = [];
    const expiredDrugs = [];

    for (const drug of drugs) {
      if (new Date(drug.end) > twoDaysAgo) {
        activeDrugs.push(drug);
      } else {
        expiredDrugs.push(drug);
      }
    }

    // 3. Update Redux Immediately (Optimistic UI)
    dispatch(setDrugs(activeDrugs));
    
    // Merge new expired drugs into completed history locally
    const updatedCompletedList = [...existingCompleted, ...expiredDrugs];
    dispatch(updateCompletedDrugs(updatedCompletedList));

    setIsLoading(false);


    if (expiredDrugs.length > 0) {
       cleanUpDatabase(supabase, userId, updatedCompletedList, expiredDrugs);
    }

    return true;

  } catch (error) {
    console.error("Fetch Data Error:", error);
    toast.error("Error loading dashboard data");
    setIsLoading(false);
    return false;
  }
};

/**x
 * Helper function to handle DB writes in the background.
 * This handles the "Move to History" and "Delete from Active" logic.
 */
const cleanUpDatabase = async (
    supabase: any, 
    userId: string, 
    updatedCompletedList: any[], 
    expiredDrugs: any[]
) => {
    try {
        // 1. Update the Completed Drugs Table
        const updatePromise = supabase
            .from("completedDrugs")
            .update({ completedDrugs: updatedCompletedList })
            .eq("userId", userId);

        // 2. Batch Delete Expired Drugs
        // Instead of a loop, we extract all IDs and delete them in one call
        const expiredIds = expiredDrugs.map(d => d.id);
        const deletePromise = supabase
            .from("drugs")
            .delete()
            .in('id', expiredIds); // <--- MUCH FASTER

        // Run both DB operations in parallel
        await Promise.all([updatePromise, deletePromise]);
        
        
    } catch (error) {
        console.error("Background DB Cleanup failed", error);
    }
}