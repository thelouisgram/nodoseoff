/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { useDrugs, useSchedule, useUserInfo } from "@/hooks/useDashboardData";

import DailyReports from "./DailyReports";
import Tracker from "../Tracker";
import DoseCard from "../DoseCard";
import { uploadScheduleToServer } from "@/utils/dashboard/schedule";
import { calculateClosestDoseCountdown } from "@/utils/dashboard/dashboard";

import { ScheduleItem } from "@/types/dashboard";
import SummaryCards from "./SummaryCards";
import Header from "./Header";
import { useAppStore } from "@/store/useAppStore";

interface HomeProps {
  isLoading: boolean;
  setActiveModal: (string: string) => void;
  setTracker: (value: string) => void;
  tracker: string;
}

const Home: React.FC<HomeProps> = ({
  isLoading,
  setActiveModal,
  setTracker,
  tracker,
}) => {
  /* Redux Replacement with React Query Hooks */
  const { userId } = useAppStore((state) => state);

  const { data: drugs = [] } = useDrugs(userId);
  const { data: schedule = [] } = useSchedule(userId);

  const queryClient = useQueryClient();
  // Removed
  const [countDown, setCountDown] = useState("");

  /** Countdown for next dose */
  useEffect(() => {
    const calculateAndSetCountdown = () => {
      const newCountdown = calculateClosestDoseCountdown(schedule);
      setCountDown(newCountdown);
    };
    calculateAndSetCountdown();
    const intervalId = setInterval(calculateAndSetCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [drugs, isLoading]);

  /** Dates */
  const { formattedToday, formattedYesterday } = useMemo(() => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 86400000);
    return {
      formattedToday: format(today, "yyyy-MM-dd"),
      formattedYesterday: format(yesterday, "yyyy-MM-dd"),
    };
  }, []);

  /** Percentage completed */
  const percentageCompleted = useMemo(() => {
    const currentTime = new Date();
    const completedBeforeCurrentTime = schedule.filter((dose: ScheduleItem) => {
      const doseDateTime = new Date(`${dose.date}T${dose.time}`);
      return doseDateTime <= currentTime && dose.completed;
    });
    const totalBeforeCurrentTime = schedule.filter((dose: ScheduleItem) => {
      const doseDateTime = new Date(`${dose.date}T${dose.time}`);
      return doseDateTime <= currentTime;
    });
    return totalBeforeCurrentTime.length > 0
      ? Math.round(
          (completedBeforeCurrentTime.length / totalBeforeCurrentTime.length) *
            100
        )
      : 0;
  }, [schedule]);

  /** Filter doses by date */
  const { todaysDose, yesterdaysDose } = useMemo(() => {
    const filterAndSortByDate = (dateString: string): ScheduleItem[] =>
      schedule
        .filter((dose: ScheduleItem) => dose.date === dateString)
        .sort((a, b) => a.time.localeCompare(b.time));
    return {
      todaysDose: filterAndSortByDate(formattedToday),
      yesterdaysDose: filterAndSortByDate(formattedYesterday),
    };
  }, [schedule, formattedToday, formattedYesterday]);

  /** Update completed status */
  const updateCompleted = useCallback(
    async (item: ScheduleItem) => {
      const updatedSchedule = schedule.map((dose: ScheduleItem) =>
        dose.id === item.id && dose.drug === item.drug
          ? { ...dose, completed: !dose.completed }
          : dose
      );
      try {
        await uploadScheduleToServer({ userId, schedule: updatedSchedule });

        // Invalidate query to refetch data
        queryClient.invalidateQueries({ queryKey: ["dashboardData", userId] });
      } catch (error) {
        toast.error(
          "Failed to update dose. Please check your network connection."
        );
      }
    },
    [schedule, userId, queryClient]
  );

  /** Doses to render */
  const allDosesToRender = useMemo(() => {
    const doses = tracker === "Today" ? todaysDose : yesterdaysDose;
    return doses
      .slice()
      .sort((a, b) => Number(a.completed) - Number(b.completed))
      .map((item: ScheduleItem) => (
        <DoseCard
          key={`${item.id}-${item.drug}`}
          item={item}
          onUpdateCompleted={updateCompleted}
        />
      ));
  }, [tracker, todaysDose, yesterdaysDose, updateCompleted]);

  return (
    <div className="w-full h-[100dvh] overflow-y-scroll md:py-16 md:px-12 pt-10 pb-24 md:pb-20 text-navyBlue dark:text-slate-100 font-karla relative">
      {/* Header */}
      <Header />
      {/* Summary Cards */}
      <SummaryCards />
      {/* Tracker  */}
      <Tracker
        tracker={tracker}
        dosesToDisplay={allDosesToRender}
        totalDoses={allDosesToRender.length}
        setTracker={setTracker}
      />
      {/* Daily Reports */}
      <DailyReports />
    </div>
  );
};

export default Home;
