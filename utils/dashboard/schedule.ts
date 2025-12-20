import { toast } from "sonner";
import { createClient } from "../../lib/supabase/client";
import { ScheduleItem } from "../../types/dashboard";



export const uploadScheduleToServer = async ({
  userId,
  schedule,
}: {
  userId: string;
  schedule: ScheduleItem[];
}) => {
   const supabase = createClient()
  try {
    const { error } = await supabase
      .from("schedule")
      .update({ schedule: [...schedule] })
      .eq("userId", userId);

    if (error) {
      toast.error("An error has occurred, try again!");
    }
  } catch (error) {
    console.error("Error updating schedule on the server:", error);
  }
};

export function removePastDoses({
  activeDrugId,
  schedule,
}: {
  activeDrugId: string;
  schedule: ScheduleItem[];
}) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // Set to yesterday's date

  const updatedSchedule = schedule.filter((item) => {
    // Parse drug date to create a new Date object
    const drugDate = new Date(item.date);

    // Compare drug date with yesterday's date
    if (item.drugId === activeDrugId) {
      return drugDate <= yesterday; // Return true if drug date is before or equal to yesterday
    }
    return true; // Keep doses for other drugs
  });

  return updatedSchedule;
}
