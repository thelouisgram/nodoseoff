/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { format } from "date-fns";
import dayjs from "dayjs";
import { toast } from "sonner";
import {
  useDrugs,
  useSchedule,
  useUpdateScheduleMutation,
} from "@/hooks/useDashboardData";

import DailyReports from "./DailyReports";
import Tracker from "../Tracker";
import DoseCard from "../DoseCard";
import { calculateClosestDoseCountdown } from "@/utils/dashboard/dashboard";

import { ScheduleItem } from "@/types/dashboard";
import SummaryCards from "./SummaryCards";
import Header from "./Header";
import { useAppStore } from "@/store/useAppStore";
import FloatingAddActions from "../../medications/drugs/FloatingAddActions";

interface HomeProps {
  isLoading: boolean;
  setActiveModal: (string: string) => void;
  setTracker: (value: string) => void;
  tracker: string;
  add: boolean;
  setAdd: React.Dispatch<React.SetStateAction<boolean>>;
  activeModal: string;
}

const Home: React.FC<HomeProps> = ({
  isLoading,
  setActiveModal,
  setTracker,
  tracker,
  add,
  setAdd,
  activeModal,
}) => {
  /* Redux Replacement with React Query Hooks */
  const { userId } = useAppStore((state) => state);

  const { data: drugs = [] } = useDrugs(userId);
  const { data: schedule = [] } = useSchedule(userId);

  const updateScheduleMutation = useUpdateScheduleMutation();
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
    const now = dayjs();
    const drugItems = schedule.filter((dose: ScheduleItem) => {
      const doseTime = dayjs(`${dose.date}T${dose.time}`);
      // Count doses that were either completed or were scheduled in the past
      return dose.completed || doseTime.isBefore(now);
    });

    if (drugItems.length === 0) return 0;

    const completedDoses = drugItems.filter((dose) => dose.completed).length;
    return Math.round((completedDoses / drugItems.length) * 100);
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
        dose.id === item.id && dose.drugId === item.drugId
          ? { ...dose, completed: !dose.completed }
          : dose
      );
      try {
        await updateScheduleMutation.mutateAsync({
          userId: userId!,
          schedule: updatedSchedule,
        });
      } catch (error) {
        toast.error(
          "Failed to update dose. Please check your network connection."
        );
      }
    },
    [schedule, userId, updateScheduleMutation]
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
      <div className="px-4 ss:px-8 md:px-0">
        <Tracker
          tracker={tracker}
          dosesToDisplay={allDosesToRender}
          totalDoses={allDosesToRender.length}
          setTracker={setTracker}
        />
      </div>
      {/* Daily Reports */}
      <DailyReports />

      {/* Floating Add Actions */}
      <FloatingAddActions
        add={add}
        setAdd={setAdd}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
      />
    </div>
  );
};

export default Home;
