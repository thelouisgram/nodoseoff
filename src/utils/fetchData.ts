import { createClient } from "../lib/supabase/client";

export const fetchData = async (userId: string) => {
  const supabase = createClient();

  try {
    // 1. Parallel Fetching
    const [
      userData,
      profilePictureData,
      drugsData,
      completedDrugsData,
      allergiesData,
      drugHistory,
      scheduleData,
    ] = await Promise.all([
      supabase.from("users").select("name, phone, email").eq("userId", userId).single(),
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

    // --- SMART DRUG LOGIC ---
    
    const drugs = drugsData.data ?? [];
    const existingCompleted = completedDrugsData.data?.completedDrugs ?? [];

    const today = new Date();
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    // Calculate Active vs Expired in Memory
    const activeDrugs: any[] = [];
    const expiredDrugs: any[] = [];

    for (const drug of drugs) {
      if (new Date(drug.end) > twoDaysAgo) {
        activeDrugs.push(drug);
      } else {
        expiredDrugs.push(drug);
      }
    }
    
    // Merge new expired drugs into completed history locally
    const updatedCompletedList = [...existingCompleted, ...expiredDrugs];

    return {
        userInfo: [userData.data ?? {}],
        profilePicture: profilePictureData.data?.[0]?.name ?? "",
        allergies: allergiesData.data ?? [],
        herbs: drugHistory.data?.herbs ?? [],
        otcDrugs: drugHistory.data?.otcDrugs ?? [],
        schedule: scheduleData.data?.schedule ?? [],
        activeDrugs,
        expiredDrugs,
        updatedCompletedList
    };

  } catch (error) {
    console.error("Fetch Data Error:", error);
    throw error;
  }
};

/**
 * Helper function to handle DB writes in the background.
 * This handles the "Move to History" and "Delete from Active" logic.
 */
export const cleanUpDatabase = async (
    userId: string, 
    updatedCompletedList: any[], 
    expiredDrugs: any[]
) => {
    const supabase = createClient();
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