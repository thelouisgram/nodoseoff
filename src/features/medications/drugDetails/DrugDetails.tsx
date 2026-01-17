import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  useDrugs,
  useSchedule,
  useCompletedDrugs,
  useUpdateScheduleMutation,
} from "@/hooks/useDashboardData";
import { DrugDetailsProps } from "@/types/drug";

import DrugDetailsHeader from "../drugDetails/DrugDetailsHeader";
import DrugSummaryCard from "../drugDetails/DrugSummaryCard";
import DrugDetailsGrid from "../drugDetails/DrugDetailsGrid";
import { frequencyToPlaceholder } from "@/utils/dashboard/dashboard";
import { formatDate } from "@/utils/dashboard/dashboard";
import { Detail } from "@/types/drug";
import { convertedTimes, calculateTimePeriod } from "@/utils/drugs";
import { useAppStore } from "@/store/useAppStore";
import { calculateDrugCompliance } from "@/utils/dashboard/drugs";
import { format } from "date-fns";
import Tracker from "../../dashboard/Tracker";
import DoseCard from "../../dashboard/DoseCard";
import { ScheduleItem } from "@/types/dashboard";
import { toast } from "sonner";

const DrugDetails: React.FC<DrugDetailsProps> = ({
  activeView,
  setActiveView,
  tab,
  activeAction,
  setActiveAction,
  options,
  setOptions,
}) => {
  const { activeDrug, activeDrugId, userId } = useAppStore((state) => state);

  const { data: drugs = [] } = useDrugs(userId);
  const { data: schedule = [] } = useSchedule(userId);
  const { data: completedDrugs = [] } = useCompletedDrugs(userId);

  const [tracker, setTracker] = useState("Today");
  const updateScheduleMutation = useUpdateScheduleMutation();

  const { formattedToday, formattedYesterday } = useMemo(() => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 86400000);
    return {
      formattedToday: format(today, "yyyy-MM-dd"),
      formattedYesterday: format(yesterday, "yyyy-MM-dd"),
    };
  }, []);

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

  const { todaysDose, yesterdaysDose } = useMemo(() => {
    const filterAndSortByDate = (dateString: string): ScheduleItem[] =>
      schedule
        .filter(
          (dose: ScheduleItem) =>
            dose.date === dateString && dose.drug === activeDrug
        )
        .sort((a, b) => a.time.localeCompare(b.time));
    return {
      todaysDose: filterAndSortByDate(formattedToday),
      yesterdaysDose: filterAndSortByDate(formattedYesterday),
    };
  }, [schedule, formattedToday, formattedYesterday, activeDrug]);

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

  const drugsArray = tab === "ongoing" ? drugs : completedDrugs;

  const drugDetailsData = drugsArray?.find((item) => item.drug === activeDrug);
  const drug = drugDetailsData?.drug;

  const complianceData = useMemo(() => {
    if (!drug) return null;

    return calculateDrugCompliance(schedule, activeDrugId);
  }, [schedule, drug]);

  if (!drugDetailsData) {
    setActiveView("list");
    return null;
  }

  const { frequency, time, start, end, reminder, route, drugId } =
    drugDetailsData;
  const duration = calculateTimePeriod(start, end);
  console.log(drugId);
  console.log("active drug", activeDrugId);

  if (!complianceData) return null;

  const {
    missedDoses,
    compliance,
    completedDoses,
    totalDoses,
    remainingDoses,
  } = complianceData;

  const details: Detail[] = [
    { name: "Frequency", details: frequencyToPlaceholder[frequency] },
    { name: "Time", details: convertedTimes(time).join(", ") },
    { name: "Duration", details: duration },
    { name: "Reminder", details: reminder ? "Yes" : "No" },
    { name: "Start Date", details: formatDate(start) },
    { name: "End Date", details: formatDate(end) },
    { name: "Total Doses", details: `${totalDoses}` },
    { name: "Completed Doses", details: `${completedDoses}` },
    { name: "Missed Doses", details: `${missedDoses}` },
    { name: "Remaining Doses", details: `${remainingDoses}` },
  ];

  return (
    <div className="h-full w-full  text-gray-800 relative">
      <DrugDetailsHeader
        options={options}
        setOptions={setOptions}
        tab={tab}
        drug={drug ?? ""}
        activeView={activeView}
        setActiveView={setActiveView}
        activeAction={activeAction}
        setActiveAction={setActiveAction}
      />

      <h3 className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-1">
        Overview
      </h3>
      <DrugSummaryCard
        compliance={compliance}
        drug={drug ?? ""}
        tab={tab}
        route={route}
      />

      {tab === "ongoing" && (
        <div className="mt-8 mb-2 w-full">
          <h3 className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-1">
            Dose Tracker
          </h3>
          <Tracker
            tracker={tracker}
            dosesToDisplay={allDosesToRender}
            totalDoses={allDosesToRender.length}
            setTracker={setTracker}
          />
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-1">
          Details
        </h3>
        <DrugDetailsGrid details={details} />
      </div>
    </div>
  );
};

export default DrugDetails;
