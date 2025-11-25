import supabase from "../utils/supabase";
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


export const fetchData = async (
    dispatch: AppDispatch,
  userId: string,
  setIsLoading: (value: boolean) => void
) => {
  try {
    const [
      userData,
      profilePictureData,
      drugsData,
      completedDrugsData,
      allergiesData,
      drugHistory,
      scheduleData,
    ] = await Promise.all([
      supabase.from("users").select("name, phone, email").eq("userId", userId),
      supabase.storage
        .from("profile-picture")
        .list(`${userId}/`, { limit: 1, offset: 0 }),
      supabase.from("drugs").select("*").eq("userId", userId),
      supabase
        .from("completedDrugs")
        .select("completedDrugs")
        .eq("userId", userId),
      supabase.from("allergies").select("*").eq("userId", userId),
      supabase
        .from("drugHistory")
        .select("otcDrugs, herbs")
        .eq("userId", userId),
      supabase.from("schedule").select("schedule").eq("userId", userId),
    ]);

    // error handling
    if (
      userData.error ||
      profilePictureData.error ||
      drugsData.error ||
      completedDrugsData.error ||
      allergiesData.error ||
      scheduleData.error
    ) {
      throw new Error("Error fetching data");
    }

    // user info
    dispatch(updateInfo([userData.data?.[0] ?? {}]));

    // profile picture
    dispatch(updateProfilePicture(profilePictureData.data?.[0]?.name ?? ""));

    // completed drugs
    const completedDrugs = completedDrugsData.data?.[0]?.completedDrugs ?? [];
    dispatch(updateCompletedDrugs(completedDrugs));

    // drugs
    if (!drugsData.data) {
      setIsLoading(false);
      return false;
    }

    const drugs = drugsData.data;
    const today = new Date();
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    const activeDrugs = drugs.filter(
      (d) => new Date(d.end) > twoDaysAgo
    );
    const expiredDrugs = drugs.filter(
      (d) => new Date(d.end) <= twoDaysAgo
    );

    dispatch(setDrugs(activeDrugs));

    const updatedCompleted = [...completedDrugs, ...expiredDrugs];
    dispatch(updateCompletedDrugs(updatedCompleted));

    // update DB
    await supabase
      .from("completedDrugs")
      .update({ completedDrugs: updatedCompleted })
      .eq("userId", userId);

    await Promise.all(
      expiredDrugs.map((drug) =>
        supabase.from("drugs").delete().eq("id", drug.id)
      )
    );

    // allergies
    dispatch(updateAllergies(allergiesData.data ?? []));

    // history
    dispatch(updateHerbs(drugHistory.data?.[0]?.herbs ?? []));
    dispatch(updateOtcDrugs(drugHistory.data?.[0]?.otcDrugs ?? []));

    // schedule
    const schedule = scheduleData.data?.[0]?.schedule ?? [];
    dispatch(updateSchedule(schedule));

    setIsLoading(false);
    return true;

  } catch (error) {
    console.error(error);
    toast.error("Error fetching data");
    setIsLoading(false);
    return false;
  }
};