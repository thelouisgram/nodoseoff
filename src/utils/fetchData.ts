import { apiJson } from "@/lib/api-client";

export const fetchData = async (_userId: string) => {
  return apiJson<Awaited<ReturnType<typeof import("@/lib/server/dashboard-data").loadDashboardForUser>>>(
    "/api/dashboard"
  );
};

export const cleanUpDatabase = async (
  userId: string,
  updatedCompletedList: unknown[],
  expiredDrugs: unknown[]
) => {
  try {
    await apiJson("/api/dashboard/cleanup", {
      method: "POST",
      json: { updatedCompletedList, expiredDrugs },
    });
  } catch (error) {
    console.error("Background DB Cleanup failed", error);
  }
};
