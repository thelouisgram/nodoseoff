import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  useDrugs,
  useSchedule,
  useCompletedDrugs,
  useToggleDoseCompletedMutation,
} from "@/hooks/useDashboardData";
import { DrugDetailsProps } from "@/types/drug";

import DrugDetailsHeader from "../drugDetails/DrugDetailsHeader";
import DrugSummaryCard from "../drugDetails/DrugSummaryCard";
import DrugDetailsGrid from "../drugDetails/DrugDetailsGrid";
import DrugCourses from "../drugDetails/DrugCourses";
import { frequencyToPlaceholder } from "@/utils/dashboard/dashboard";
import { formatDate } from "@/utils/dashboard/dashboard";
import { Detail } from "@/types/drug";
import {
  convertedTimes,
  calculateTimePeriod,
  sameDrugName,
} from "@/utils/drugs";
import { useAppSelector } from "@/store";
import { calculateDrugComplianceByIds } from "@/utils/dashboard/drugs";
import { format } from "date-fns";
import Tracker from "../../dashboard/Tracker";
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
  const { activeDrug, activeDrugId, userId } = useAppSelector(
    (state) => state.app
  );

  const { data: drugs = [] } = useDrugs(userId);
  const { data: schedule = [] } = useSchedule(userId);
  const { data: completedDrugs = [] } = useCompletedDrugs(userId);

  const [tracker, setTracker] = useState("Today");
  const toggleDoseCompleted = useToggleDoseCompletedMutation();

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
      try {
        await toggleDoseCompleted.mutateAsync({
          userId: userId!,
          item,
        });
      } catch {
        toast.error(
          "Failed to update dose. Please check your network connection."
        );
      }
    },
    [userId, toggleDoseCompleted]
  );

  const drugsArray = tab === "ongoing" ? drugs : completedDrugs;

  // All regimens for this drug name in the current tab (ongoing or completed).
  const courses = useMemo(() => {
    const matches = drugsArray.filter((item) =>
      sameDrugName(item.drug, activeDrug)
    );
    return [...matches].sort((a, b) => {
      const aEnd = Date.parse(a.end || "") || 0;
      const bEnd = Date.parse(b.end || "") || 0;
      return bEnd - aEnd;
    });
  }, [drugsArray, activeDrug]);

  // All course IDs in this tab only — never includes the other tab's regimens
  const courseIds = useMemo(
    () =>
      courses.map((c) => String(c.drugId || "").trim()).filter(Boolean),
    [courses]
  );

  const { todaysDose, yesterdaysDose } = useMemo(() => {
    const idSet = new Set(courseIds);
    const filterAndSortByDate = (dateString: string): ScheduleItem[] =>
      schedule
        .filter(
          (dose: ScheduleItem) =>
            dose.date === dateString &&
            idSet.has(String(dose.drugId || "").trim())
        )
        .sort((a, b) => a.time.localeCompare(b.time));
    return {
      todaysDose: filterAndSortByDate(formattedToday),
      yesterdaysDose: filterAndSortByDate(formattedYesterday),
    };
  }, [schedule, formattedToday, formattedYesterday, courseIds]);

  const dosesForTracker = useMemo(() => {
    const doses = tracker === "Today" ? todaysDose : yesterdaysDose;
    return doses
      .slice()
      .sort((a, b) => Number(a.completed) - Number(b.completed));
  }, [tracker, todaysDose, yesterdaysDose]);

  const latestCourse =
    courses.find((c) => c.drugId && c.drugId === activeDrugId) || courses[0];

  const complianceData = useMemo(() => {
    if (courseIds.length === 0) return null;
    return calculateDrugComplianceByIds(schedule, courseIds);
  }, [schedule, courseIds]);

  useEffect(() => {
    if (courses.length === 0) {
      setActiveView("list");
    }
  }, [courses.length, setActiveView]);

  if (!latestCourse || !complianceData) {
    return null;
  }

  const { frequency, time, start, end, reminder, route, drug } = latestCourse;
  const duration =
    courses.length > 1
      ? `${courses.length} courses`
      : calculateTimePeriod(start, end);

  const {
    missedDoses,
    compliance,
    completedDoses,
    totalDoses,
    remainingDoses,
  } = complianceData;

  const details: Detail[] = [
    {
      name: "Frequency",
      details:
        courses.length > 1 &&
        new Set(courses.map((c) => c.frequency)).size > 1
          ? "Varies by course"
          : frequencyToPlaceholder[frequency] || frequency,
    },
    {
      name: "Time",
      details:
        courses.length > 1 &&
        new Set(courses.map((c) => (c.time || []).join(","))).size > 1
          ? "Varies by course"
          : convertedTimes(time).join(", "),
    },
    { name: "Duration", details: duration },
    { name: "Reminder", details: reminder ? "Yes" : "No" },
    {
      name: "Start Date",
      details:
        courses.length > 1
          ? formatDate(
              [...courses].sort(
                (a, b) => Date.parse(a.start || "") - Date.parse(b.start || "")
              )[0]?.start || start
            )
          : formatDate(start),
    },
    {
      name: "End Date",
      details:
        courses.length > 1
          ? formatDate(
              [...courses].sort(
                (a, b) => Date.parse(b.end || "") - Date.parse(a.end || "")
              )[0]?.end || end
            )
          : formatDate(end),
    },
    { name: "Total Doses", details: `${totalDoses}` },
    { name: "Completed Doses", details: `${completedDoses}` },
    { name: "Missed Doses", details: `${missedDoses}` },
    { name: "Remaining Doses", details: `${remainingDoses}` },
  ];

  return (
    <div className="relative h-full w-full font-jakarta text-soft-ink">
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

      <h3 className="mb-3 px-1 text-[11px] font-bold uppercase tracking-widest text-soft-muted">
        Overview
      </h3>
      <DrugSummaryCard
        compliance={compliance}
        drug={drug ?? ""}
        tab={tab}
        courseCount={courses.length}
        route={
          courses.length > 1 &&
          new Set(courses.map((c) => (c.route || "").toLowerCase())).size > 1
            ? "Mixed"
            : route
        }
      />

      {tab === "ongoing" && (
        <div className="mb-2 mt-8 w-full">
          <div className="rounded-2xl border border-black/[0.05] bg-white p-4 shadow-soft-sm ss:p-5 md:p-6">
            <div className="mb-4">
              <h2 className="text-[18px] font-semibold tracking-tight text-soft-ink">
                Doses
              </h2>
              <p className="mt-0.5 text-[13px] text-soft-muted">
                Mark doses as you take them
              </p>
            </div>
            <Tracker
              tracker={tracker}
              doses={dosesForTracker}
              onUpdateCompleted={updateCompleted}
              setTracker={setTracker}
              layoutScope="drugs"
            />
          </div>
        </div>
      )}

      <DrugCourses courses={courses} schedule={schedule} tab={tab} />

      <div className="mt-8">
        <h3 className="mb-3 px-1 text-[11px] font-bold uppercase tracking-widest text-soft-muted">
          {courses.length > 1 ? "Combined details" : "Details"}
        </h3>
        <DrugDetailsGrid details={details} />
      </div>
    </div>
  );
};

export default DrugDetails;
