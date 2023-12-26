import { toast } from "sonner";
import supabase from "./supabaseClient";
import { Drug } from "../types";

export const uploadScheduleToServer = async ({
  userId,
  schedule,
}: {
  userId: string;
  schedule: any[];
}) => {
  try {
    const { error } = await supabase
      .from("users")
      .update({ schedule: [...schedule] })
      .eq("userId", userId);

    if (error) {
      toast.error("Failed to update schedule on the server");
    }
  } catch (error) {
    console.error("Error updating schedule on the server:", error);
  }
};

export function removeActiveDrugFromSchedule({
  activeDrug,
  schedule,
}: {
  activeDrug: string;
  schedule: any[];
}) {
  return schedule.filter((drug: Drug) => drug.drug !== activeDrug);
}
