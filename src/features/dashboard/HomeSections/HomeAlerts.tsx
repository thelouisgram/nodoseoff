"use client";

import { useMemo } from "react";
import { AlertTriangle, Package } from "lucide-react";
import type { DrugProps, ScheduleItem } from "@/types/dashboard";
import { getEndingSoonDrugs, getMissedDoses } from "@/utils/dashboard/homeInsights";
import { formatDoseClock } from "@/utils/dashboard/dashboard";
import { useAppDispatch } from "@/store";
import { setActiveTab } from "@/store/appSlice";

type Props = {
  schedule: ScheduleItem[];
  drugs: DrugProps[];
  onCatchUp: (item: ScheduleItem) => Promise<void> | void;
};

export default function HomeAlerts({ schedule, drugs, onCatchUp }: Props) {
  const dispatch = useAppDispatch();
  const missed = useMemo(() => getMissedDoses(schedule).slice(0, 3), [schedule]);
  const ending = useMemo(() => getEndingSoonDrugs(drugs, 7).slice(0, 2), [drugs]);

  if (missed.length === 0 && ending.length === 0) return null;

  return (
    <section className="mx-4 mb-4 space-y-2 ss:mx-8 md:mx-0">
      {missed.length > 0 ? (
        <div className="rounded-2xl border border-[#f0c9d4] bg-[#fff7fa] px-4 py-3.5">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#ffe4ee] text-[#8a3d5a]">
              <AlertTriangle className="size-4" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-[#8a3d5a]">
                {missed.length === 1
                  ? "1 missed dose yesterday"
                  : `${missed.length} missed doses yesterday`}
              </p>
              <ul className="mt-2 space-y-1.5">
                {missed.map(({ dose }) => (
                  <li
                    key={`${dose.drugId}-${dose.id}-${dose.date}-${dose.time}`}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="min-w-0 truncate text-[13px] text-soft-ink">
                      <span className="font-medium capitalize">{dose.drug}</span>
                      <span className="text-soft-muted">
                        {" "}
                        · {formatDoseClock(dose.time)}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => void onCatchUp(dose)}
                      className="shrink-0 rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-soft-primary shadow-soft-sm"
                    >
                      Catch up
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      {ending.length > 0 ? (
        <div className="rounded-2xl border border-soft-peach/80 bg-[#fffaf5] px-4 py-3.5">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-soft-peach text-soft-peach-ink">
              <Package className="size-4" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-soft-peach-ink">
                Ending soon
              </p>
              <ul className="mt-1.5 space-y-1">
                {ending.map(({ drug, daysLeft, endLabel }) => (
                  <li
                    key={drug.drugId}
                    className="flex items-center justify-between gap-2 text-[13px]"
                  >
                    <span className="min-w-0 truncate capitalize text-soft-ink">
                      {drug.drug}
                      <span className="text-soft-muted">
                        {" "}
                        ·{" "}
                        {daysLeft === 0
                          ? "ends today"
                          : daysLeft === 1
                            ? "1 day left"
                            : `${daysLeft} days left`}{" "}
                        ({endLabel})
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => dispatch(setActiveTab("Drugs"))}
                className="mt-2.5 text-[12px] font-semibold text-soft-primary"
              >
                Review in Drugs →
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
