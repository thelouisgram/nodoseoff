import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchData, cleanUpDatabase } from "../utils/fetchData";
import { DrugProps, ScheduleItem } from "../types/dashboard";
import { Info } from "../utils/store";

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
