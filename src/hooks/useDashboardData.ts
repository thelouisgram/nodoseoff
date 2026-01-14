import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchData, cleanUpDatabase } from "../utils/fetchData";
import { DrugProps, ScheduleItem } from "../types/dashboard";
import { Info } from "../utils/store";
import { createClient } from "@/lib/supabase/client";

// Define the shape of the data returned by fetchData
interface DashboardData {
    userInfo: Info[];
    profilePicture: string;
    allergies: DrugProps[];
    herbs: string;
    otcDrugs: string;
    schedule: ScheduleItem[];
    activeDrugs: DrugProps[];
    expiredDrugs: any[]; // or DrugProps[] if they are the same
    updatedCompletedList: DrugProps[];
}

export const useDashboardData = (userId: string | undefined) => {
  const query = useQuery({
    queryKey: ["dashboardData", userId],
    queryFn: () => fetchData(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // DB Cleanup Side Effect
  // We can keep this here, or move it to a separate effect/component. 
  // Keeping it here ensures it runs when data is fetched.
  useEffect(() => {
    if (query.data && userId) {
        if (query.data.expiredDrugs.length > 0) {
             cleanUpDatabase(userId, query.data.updatedCompletedList, query.data.expiredDrugs);
        }
    }
  }, [query.data, userId]);

  return query;
};

// --- Selectors Hooks ---

export const useDrugs = (userId: string | undefined) => {
    return useQuery({
        queryKey: ["dashboardData", userId],
        queryFn: () => fetchData(userId!),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        select: (data: DashboardData) => data.activeDrugs
    });
}

export const useSchedule = (userId: string | undefined) => {
    return useQuery({
        queryKey: ["dashboardData", userId],
        queryFn: () => fetchData(userId!),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        select: (data: DashboardData) => data.schedule
    });
}

export const useUserInfo = (userId: string | undefined) => {
    return useQuery({
        queryKey: ["dashboardData", userId],
        queryFn: () => fetchData(userId!),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        select: (data: DashboardData) => data.userInfo
    });
}

export const useAllergies = (userId: string | undefined) => {
    return useQuery({
        queryKey: ["dashboardData", userId],
        queryFn: () => fetchData(userId!),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        select: (data: DashboardData) => data.allergies
    });
}

export const useHerbs = (userId: string | undefined) => {
    return useQuery({
        queryKey: ["dashboardData", userId],
        queryFn: () => fetchData(userId!),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        select: (data: DashboardData) => data.herbs
    });
}

export const useOtcDrugs = (userId: string | undefined) => {
    return useQuery({
        queryKey: ["dashboardData", userId],
        queryFn: () => fetchData(userId!),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        select: (data: DashboardData) => data.otcDrugs
    });
}

export const useProfilePicture = (userId: string | undefined) => {
    return useQuery({
        queryKey: ["dashboardData", userId],
        queryFn: () => fetchData(userId!),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        select: (data: DashboardData) => data.profilePicture
    });
}

export const useCompletedDrugs = (userId: string | undefined) => {
    return useQuery({
        queryKey: ["dashboardData", userId],
        queryFn: () => fetchData(userId!),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        select: (data: DashboardData) => data.updatedCompletedList
    });
}

// --- Mutation Hooks with Optimistic Updates ---

// Helper to update dashboard cache directly
const useUpdateDashboardCache = () => {
    const queryClient = useQueryClient();
    return (userId: string, updater: (old: DashboardData) => DashboardData) => {
        queryClient.setQueryData(["dashboardData", userId], (old: DashboardData | undefined) => {
            if (!old) return old;
            return updater(old);
        });
    };
};

// Add new drug
interface AddDrugParams {
    userId: string;
    drug: string;
    frequency: string;
    route: string;
    start: string;
    end: string;
    time: string[];
    reminder: boolean;
    drugId: string;
}

export const useAddDrugMutation = () => {
    const updateCache = useUpdateDashboardCache();
    const supabase = createClient();

    return useMutation({
        mutationFn: async (params: AddDrugParams) => {
            const { error } = await supabase.from("drugs").insert({
                userId: params.userId,
                drug: params.drug,
                frequency: params.frequency,
                route: params.route,
                start: params.start,
                end: params.end,
                time: params.time,
                reminder: params.reminder,
                drugId: params.drugId,
            });
            if (error) throw error;
            return params;
        },
        onSuccess: (data) => {
            updateCache(data.userId, (old) => ({
                ...old,
                activeDrugs: [...old.activeDrugs, {
                    drug: data.drug,
                    frequency: data.frequency,
                    route: data.route,
                    start: data.start,
                    end: data.end,
                    time: data.time,
                    reminder: data.reminder,
                    drugId: data.drugId,
                }],
            }));
        },
    });
};

// Update existing drug
interface UpdateDrugParams {
    userId: string;
    activeDrug: string;
    drug: string;
    frequency: string;
    route: string;
    start: string;
    end: string;
    time: string[];
    reminder: boolean;
    drugId?: string;
}

export const useUpdateDrugMutation = () => {
    const updateCache = useUpdateDashboardCache();
    const supabase = createClient();

    return useMutation({
        mutationFn: async (params: UpdateDrugParams) => {
            const { error } = await supabase
                .from("drugs")
                .update({
                    userId: params.userId,
                    drug: params.drug,
                    frequency: params.frequency,
                    route: params.route,
                    start: params.start,
                    end: params.end,
                    time: params.time,
                    reminder: params.reminder,
                })
                .eq("drug", params.activeDrug);
            if (error) throw error;
            return params;
        },
        onSuccess: (data) => {
            updateCache(data.userId, (old) => ({
                ...old,
                activeDrugs: old.activeDrugs.map((drug) =>
                    drug.drug === data.activeDrug
                        ? {
                            ...drug,
                            drug: data.drug,
                            frequency: data.frequency,
                            route: data.route,
                            start: data.start,
                            end: data.end,
                            time: data.time,
                            reminder: data.reminder,
                        }
                        : drug
                ),
            }));
        },
    });
};

// Delete ongoing drug
interface DeleteDrugParams {
    userId: string;
    drug: string;
}

export const useDeleteDrugMutation = () => {
    const updateCache = useUpdateDashboardCache();
    const supabase = createClient();

    return useMutation({
        mutationFn: async (params: DeleteDrugParams) => {
            const { error } = await supabase.from("drugs").delete().eq("drug", params.drug);
            if (error) throw error;
            return params;
        },
        onSuccess: (data) => {
            updateCache(data.userId, (old) => ({
                ...old,
                activeDrugs: old.activeDrugs.filter((drug) => drug.drug !== data.drug),
                schedule: old.schedule.filter((s) => s.drug !== data.drug),
            }));
        },
    });
};

// Delete completed drug
interface DeleteCompletedDrugParams {
    userId: string;
    drug: string;
}

export const useDeleteCompletedDrugMutation = () => {
    const updateCache = useUpdateDashboardCache();
    const supabase = createClient();

    return useMutation({
        mutationFn: async (params: DeleteCompletedDrugParams) => {
            const { error } = await supabase
                .from("completedDrugs")
                .delete()
                .eq("drug", params.drug)
                .eq("userId", params.userId);
            if (error) throw error;
            return params;
        },
        onSuccess: (data) => {
            updateCache(data.userId, (old) => ({
                ...old,
                updatedCompletedList: old.updatedCompletedList.filter((d) => d.drug !== data.drug),
            }));
        },
    });
};

// Add allergy
interface AddAllergyParams {
    userId: string;
    drug: string;
    drugId: string;
}

export const useAddAllergyMutation = () => {
    const updateCache = useUpdateDashboardCache();
    const supabase = createClient();

    return useMutation({
        mutationFn: async (params: AddAllergyParams) => {
            const { error } = await supabase.from("allergies").insert({
                userId: params.userId,
                drug: params.drug,
                frequency: "",
                route: "",
                start: "",
                end: "",
                time: [""],
                reminder: true,
                drugId: params.drugId,
            });
            if (error) throw error;
            return params;
        },
        onSuccess: (data) => {
            updateCache(data.userId, (old) => ({
                ...old,
                allergies: [...old.allergies, {
                    drug: data.drug,
                    frequency: "",
                    route: "",
                    start: "",
                    end: "",
                    time: [""],
                    reminder: true,
                    drugId: data.drugId,
                }],
            }));
        },
    });
};

// Delete allergy
interface DeleteAllergyParams {
    userId: string;
    drug: string;
}

export const useDeleteAllergyMutation = () => {
    const updateCache = useUpdateDashboardCache();
    const supabase = createClient();

    return useMutation({
        mutationFn: async (params: DeleteAllergyParams) => {
            const { error } = await supabase.from("allergies").delete().eq("drug", params.drug);
            if (error) throw error;
            return params;
        },
        onSuccess: (data) => {
            updateCache(data.userId, (old) => ({
                ...old,
                allergies: old.allergies.filter((a) => a.drug !== data.drug),
            }));
        },
    });
};

// Mark drug as allergy (move from drugs to allergies)
interface MarkAsAllergyParams {
    userId: string;
    drug: string;
    tab: string;
    target: DrugProps;
}

export const useMarkAsAllergyMutation = () => {
    const updateCache = useUpdateDashboardCache();
    const supabase = createClient();

    return useMutation({
        mutationFn: async (params: MarkAsAllergyParams) => {
            // Delete from source table
            if (params.tab === "ongoing") {
                await supabase
                    .from("drugs")
                    .delete()
                    .eq("drug", params.drug)
                    .eq("userId", params.userId);
            } else if (params.tab === "completed") {
                await supabase
                    .from("completedDrugs")
                    .delete()
                    .eq("drug", params.drug)
                    .eq("userId", params.userId);
            }
            
            // Insert into allergies
            const { error } = await supabase.from("allergies").insert({
                userId: params.userId,
                drug: params.drug,
                frequency: params.target.frequency || "",
                route: params.target.route || "",
                start: params.target.start || "",
                end: params.target.end || "",
                time: params.target.time || [""],
                reminder: true,
            });
            if (error) throw error;
            return params;
        },
        onSuccess: (data) => {
            updateCache(data.userId, (old) => {
                const newAllergyEntry: DrugProps = {
                    drug: data.drug,
                    frequency: data.target.frequency || "",
                    route: data.target.route || "",
                    start: data.target.start || "",
                    end: data.target.end || "",
                    time: data.target.time || [""],
                    reminder: true,
                    drugId: data.target.drugId,
                };

                if (data.tab === "ongoing") {
                    return {
                        ...old,
                        activeDrugs: old.activeDrugs.filter((d) => d.drug !== data.drug),
                        schedule: old.schedule.filter((s) => s.drug !== data.drug),
                        allergies: [...old.allergies, newAllergyEntry],
                    };
                } else {
                    return {
                        ...old,
                        updatedCompletedList: old.updatedCompletedList.filter((d) => d.drug !== data.drug),
                        allergies: [...old.allergies, newAllergyEntry],
                    };
                }
            });
        },
    });
};

// Update profile
interface UpdateProfileParams {
    userId: string;
    name: string;
    phone: string;
}

export const useUpdateProfileMutation = () => {
    const updateCache = useUpdateDashboardCache();
    const supabase = createClient();

    return useMutation({
        mutationFn: async (params: UpdateProfileParams) => {
            const { error } = await supabase
                .from("users")
                .update({ name: params.name, phone: params.phone })
                .eq("userId", params.userId);
            if (error) throw error;
            return params;
        },
        onSuccess: (data) => {
            updateCache(data.userId, (old) => ({
                ...old,
                userInfo: old.userInfo.map((info, index) =>
                    index === 0 ? { ...info, name: data.name, phone: data.phone } : info
                ),
            }));
        },
    });
};

// Upload profile picture
interface UploadProfilePictureParams {
    userId: string;
    file: File;
    currentPicture: string;
    newFileName: string;
}

export const useUploadProfilePictureMutation = () => {
    const updateCache = useUpdateDashboardCache();
    const supabase = createClient();

    return useMutation({
        mutationFn: async (params: UploadProfilePictureParams) => {
            const bucket = "profile-picture";
            const filePath = `${params.userId}/${params.newFileName}`;

            // Delete old file
            if (params.currentPicture) {
                await supabase.storage
                    .from(bucket)
                    .remove([`${params.userId}/${params.currentPicture}`]);
            }

            // Upload new picture
            const { error } = await supabase.storage
                .from(bucket)
                .upload(filePath, params.file);

            if (error) throw error;
            return params;
        },
        onSuccess: (data) => {
            updateCache(data.userId, (old) => ({
                ...old,
                profilePicture: data.newFileName,
            }));
        },
    });
};

// Update drug history
interface UpdateDrugHistoryParams {
    userId: string;
    otcDrugs: string;
    herbs: string;
}

export const useUpdateDrugHistoryMutation = () => {
    const updateCache = useUpdateDashboardCache();
    const supabase = createClient();

    return useMutation({
        mutationFn: async (params: UpdateDrugHistoryParams) => {
            const { error } = await supabase
                .from("drugHistory")
                .update({
                    otcDrugs: params.otcDrugs,
                    herbs: params.herbs,
                })
                .eq("userId", params.userId);
            if (error) throw error;
            return params;
        },
        onSuccess: (data) => {
            updateCache(data.userId, (old) => ({
                ...old,
                otcDrugs: data.otcDrugs,
                herbs: data.herbs,
            }));
        },
    });
};

// Update schedule (used for toggling completed or adding new schedule items)
interface UpdateScheduleParams {
    userId: string;
    schedule: ScheduleItem[];
}

export const useUpdateScheduleMutation = () => {
    const updateCache = useUpdateDashboardCache();

    return useMutation({
        mutationFn: async (params: UpdateScheduleParams) => {
            // Import dynamically to avoid circular dependency
            const { uploadScheduleToServer } = await import("../utils/dashboard/schedule");
            await uploadScheduleToServer({ userId: params.userId, schedule: params.schedule });
            return params;
        },
        onSuccess: (data) => {
            updateCache(data.userId, (old) => ({
                ...old,
                schedule: data.schedule,
            }));
        },
    });
};

// Update theme preference
interface UpdateThemeParams {
    userId: string;
    theme: "light" | "dark";
}

export const useUpdateThemeMutation = () => {
    const updateCache = useUpdateDashboardCache();
    const supabase = createClient();

    return useMutation({
        mutationFn: async (params: UpdateThemeParams) => {
            const { error } = await supabase
                .from("users")
                .update({ theme: params.theme })
                .eq("userId", params.userId);
            if (error) throw error;
            return params;
        },
        onSuccess: (data) => {
            updateCache(data.userId, (old) => ({
                ...old,
                userInfo: old.userInfo.map((info, index) =>
                    index === 0 ? { ...info, theme: data.theme } : info
                ),
            }));
        },
    });
};

// Hook to get user's theme from dashboard data
export const useUserTheme = (userId: string | undefined) => {
    return useQuery({
        queryKey: ["dashboardData", userId],
        queryFn: () => fetchData(userId!),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        select: (data: DashboardData) => data.userInfo[0]?.theme ?? null
    });
};
