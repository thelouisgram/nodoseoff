/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../../../store";
import {
  useDrugs,
  useSchedule,
  useCompletedDrugs,
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

  console.log(schedule);

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

      <DrugSummaryCard
        compliance={compliance}
        drug={drug ?? ""}
        tab={tab}
        route={route}
      />

      <DrugDetailsGrid details={details} />
    </div>
  );
};

export default DrugDetails;
