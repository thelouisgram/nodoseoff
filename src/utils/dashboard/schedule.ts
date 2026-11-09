import { ScheduleItem } from "../../types/dashboard";
import { apiJson } from "@/lib/api-client";

export const uploadScheduleToServer = async ({
  userId,
  schedule,
}: {
  userId: string;
  schedule: ScheduleItem[];
}) => {
  try {
    await apiJson("/api/data/mutations", {
      method: "POST",
      json: { action: "updateSchedule", payload: { schedule } },
    });
  } catch (error) {
    console.error("Error updating schedule on the server:", error);
    throw error;
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
  yesterday.setDate(yesterday.getDate() - 1);

  return schedule.filter((item) => {
    const drugDate = new Date(item.date);
    if (item.drugId === activeDrugId) {
      return drugDate <= yesterday;
    }
    return true;
  });
}
