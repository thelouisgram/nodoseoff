/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import { DrugDetailsProps } from "../../../../../types/drug";

import DrugDetailsHeader from "../drugDetails/DrugDetailsHeader";
import DrugSummaryCard from "../drugDetails/DrugSummaryCard";
import DrugDetailsGrid from "../drugDetails/DrugDetailsGrid";
import { calculateCompliance } from "../../../../../utils/dashboard/drugs";
import { frequencyToPlaceholder } from "../../../../../utils/dashboard/dashboard";
import { formatDate } from "../../../../../utils/dashboard/dashboard";
import { Detail } from "../../../../../types/drug";
import {
  convertedTimes,
  calculateTimePeriod,
} from "../../../../../utils/drugs";
import { useAppStore } from "../../../../../store/useAppStore";


const DrugDetails: React.FC<DrugDetailsProps> = ({
  activeView,
  setActiveView,
  tab,
  activeAction,
  setActiveAction,
  options,
  setOptions,
}) => {
  const { schedule, drugs, completedDrugs } =
    useSelector((state: RootState) => state.app);

    const { activeDrug } = useAppStore((state) => state);

  const drugsArray = tab === "ongoing" ? drugs : completedDrugs;

  const drugDetailsData = drugsArray?.find((item) => item.drug === activeDrug);
  const drug = drugDetailsData?.drug;

  const complianceData = useMemo(() => {
    if (!drug) return null;

    const allDrugsComplianceData = calculateCompliance(schedule);
    return allDrugsComplianceData[drug];
  }, [schedule, drug]);

  if (!drugDetailsData) {
    setActiveView("list");
    return null;
  }

  const { frequency, time, start, end, reminder, route} = drugDetailsData;
  const duration = calculateTimePeriod(start, end);

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

      <DrugSummaryCard compliance={compliance} drug={drug ?? ''} tab={tab} route={route}/>

      <DrugDetailsGrid details={details} />
    </div>
  );
};

export default DrugDetails;
