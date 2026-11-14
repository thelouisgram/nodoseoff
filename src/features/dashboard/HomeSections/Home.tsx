/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useMemo, useCallback } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  useDrugs,
  useSchedule,
  useToggleDoseCompletedMutation,
} from "@/hooks/useDashboardData";

import DailyReports from "./DailyReports";
import Tracker from "../Tracker";
import SummaryCards from "./SummaryCards";
import WeekStreak from "./WeekStreak";
import HomeAlerts from "./HomeAlerts";
import HomeCta from "./HomeCta";
import AmandaShortcuts from "./AmandaShortcuts";

import { ScheduleItem } from "@/types/dashboard";
import Header from "./Header";
import { useAppSelector } from "@/store";
import FloatingAddActions from "../../medications/drugs/FloatingAddActions";
import { countUniqueDrugNames } from "@/utils/drugs";

interface HomeProps {
  isLoading?: boolean;
  setActiveModal: (string: string) => void;
  setTracker: (value: string) => void;
  tracker: string;
  add: boolean;
  setAdd: React.Dispatch<React.SetStateAction<boolean>>;
  activeModal: string;
}

const Home: React.FC<HomeProps> = ({
  setActiveModal,
  setTracker,
  tracker,
  add,
  setAdd,
  activeModal,
}) => {
  const { userId } = useAppSelector((state) => state.app);
  const { data: schedule = [] } = useSchedule(userId);
  const { data: drugs = [] } = useDrugs(userId);

  const toggleDoseCompleted = useToggleDoseCompletedMutation();

  const { formattedToday, formattedYesterday } = useMemo(() => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 86400000);
    return {
      formattedToday: format(today, "yyyy-MM-dd"),
      formattedYesterday: format(yesterday, "yyyy-MM-dd"),
    };
  }, []);

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

  const dosesForTracker = useMemo(() => {
    const doses = tracker === "Today" ? todaysDose : yesterdaysDose;
    return doses
      .slice()
      .sort((a, b) => Number(a.completed) - Number(b.completed));
  }, [tracker, todaysDose, yesterdaysDose]);

  const ongoingCount = countUniqueDrugNames(drugs);

  return (
    <div className="relative h-[100dvh] w-full overflow-y-scroll bg-soft-canvas px-0 pb-24 pt-10 font-jakarta text-soft-ink md:px-12 md:py-16 md:pb-20">
      {/* Primary: who + what matters now */}
      <Header />
      <SummaryCards
        onMarkTaken={async (item) => {
          if (item.completed) return;
          await updateCompleted(item);
        }}
      />

      <div className="mx-4 mb-3 ss:mx-8 md:mx-0">
        <div className="rounded-2xl border border-black/[0.05] bg-white p-4 shadow-soft-sm ss:p-5 md:p-6">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-soft-muted">
                Today
              </p>
              <h2 className="mt-1 text-[20px] font-bold tracking-tight text-soft-ink">
                Doses
              </h2>
            </div>
            {ongoingCount > 0 ? (
              <p className="pb-0.5 text-[12px] font-medium text-soft-muted">
                {ongoingCount} active med{ongoingCount === 1 ? "" : "s"}
              </p>
            ) : null}
          </div>
          <Tracker
            tracker={tracker}
            doses={dosesForTracker}
            onUpdateCompleted={updateCompleted}
            setTracker={setTracker}
            layoutScope="home"
          />
        </div>
      </div>

      <HomeAlerts
        schedule={schedule}
        drugs={drugs}
        onCatchUp={async (item) => {
          if (item.completed) return;
          await updateCompleted(item);
        }}
      />

      <HomeCta
        drugs={drugs}
        setAdd={setAdd}
        setActiveModal={setActiveModal}
      />

      {/* Secondary: patterns & tools */}
      <div className="mx-4 mb-2 mt-8 ss:mx-8 md:mx-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-soft-muted">
          Insights
        </p>
        <h2 className="mt-1 text-[18px] font-bold tracking-tight text-soft-ink">
          Patterns &amp; help
        </h2>
      </div>

      <WeekStreak schedule={schedule} />
      <AmandaShortcuts drugs={drugs} />
      <DailyReports />

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
