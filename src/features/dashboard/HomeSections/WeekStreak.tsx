"use client";

import { useMemo } from "react";
import { Flame } from "lucide-react";
import type { ScheduleItem } from "@/types/dashboard";
import {
  getAdherenceStreak,
  getWeeklyAdherence,
  getWeeklyCompliancePercent,
} from "@/utils/dashboard/homeInsights";

type Props = {
  schedule: ScheduleItem[];
};

export default function WeekStreak({ schedule }: Props) {
  const { days, streak, weekPct } = useMemo(() => {
    const days = getWeeklyAdherence(schedule);
    return {
      days,
      streak: getAdherenceStreak(schedule),
      weekPct: getWeeklyCompliancePercent(days),
    };
  }, [schedule]);

  return (
    <section className="mx-4 mb-4 rounded-2xl border border-black/[0.05] bg-white px-4 py-4 shadow-soft-sm ss:mx-8 md:mx-0">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-soft-muted">
            This week
          </p>
          <p className="mt-1 text-[15px] font-semibold text-soft-ink">
            {weekPct}% adherence
            {streak > 0 ? (
              <span className="ml-2 inline-flex items-center gap-1 text-[13px] font-medium text-soft-peach-ink">
                <Flame className="size-3.5" strokeWidth={2} />
                {streak}-day streak
              </span>
            ) : null}
          </p>
        </div>
      </div>

      <div className="mt-3.5 grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const filled = day.rate != null && day.rate >= 1;
          const partial = day.rate != null && day.rate > 0 && day.rate < 1;
          const empty = day.rate === null;
          return (
            <div key={day.key} className="flex flex-col items-center gap-1.5">
              <span
                className={`flex size-8 items-center justify-center rounded-full text-[11px] font-semibold ${
                  filled
                    ? "bg-soft-mint text-soft-mint-ink"
                    : partial
                      ? "bg-soft-peach text-soft-peach-ink"
                      : empty
                        ? "bg-soft-canvas text-soft-muted/70"
                        : "bg-[#ffe4ee] text-[#8a3d5a]"
                } ${day.isToday ? "ring-2 ring-soft-primary/25 ring-offset-1" : ""}`}
                title={
                  empty
                    ? "No doses"
                    : `${day.completed}/${day.total} taken`
                }
              >
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
