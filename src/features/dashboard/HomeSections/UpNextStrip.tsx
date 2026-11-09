"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Clock3, Loader2 } from "lucide-react";
import type { ScheduleItem } from "@/types/dashboard";
import {
  formatRelativeDoseLabel,
  getActionableDose,
  getDueTodayDoses,
} from "@/utils/dashboard/homeInsights";
import { getNextUpcomingDose } from "@/utils/dashboard/dashboard";

type Props = {
  schedule: ScheduleItem[];
  onMarkTaken: (item: ScheduleItem) => Promise<void> | void;
};

const SNOOZE_MS = 15 * 60 * 1000;

function doseKeyOf(dose: ScheduleItem) {
  return `${dose.drugId}-${dose.id}-${dose.date}-${dose.time}`;
}

export default function UpNextStrip({ schedule, onMarkTaken }: Props) {
  const [now, setNow] = useState(() => new Date());
  const [loading, setLoading] = useState(false);
  const [snoozedUntil, setSnoozedUntil] = useState<Record<string, number>>({});

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const actionable = useMemo(() => {
    const isSnoozed = (dose: ScheduleItem) =>
      (snoozedUntil[doseKeyOf(dose)] ?? 0) > now.getTime();

    const primary = getActionableDose(schedule, now);
    if (primary && !isSnoozed(primary.dose)) return primary;

    const next = getNextUpcomingDose(schedule);
    if (next && !isSnoozed(next.dose)) {
      return { ...next, kind: "upcoming" as const };
    }

    const dueToday = getDueTodayDoses(schedule, now).find(
      (item) => !isSnoozed(item.dose)
    );
    if (dueToday) return { ...dueToday, kind: "due" as const };

    return null;
  }, [schedule, now, snoozedUntil]);

  if (!actionable) {
    return (
      <section className="mx-4 mb-4 rounded-2xl border border-black/[0.05] bg-white px-4 py-4 shadow-soft-sm ss:mx-8 md:mx-0">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-soft-muted">
          Up next
        </p>
        <p className="mt-1.5 text-[15px] font-semibold text-soft-ink">
          You’re clear for now
        </p>
        <p className="mt-0.5 text-[13px] text-soft-muted">
          No dose needs action right now.
        </p>
      </section>
    );
  }

  const { dose, at, kind } = actionable;
  const due = kind === "due";

  const mark = async () => {
    setLoading(true);
    try {
      await onMarkTaken(dose);
    } finally {
      setLoading(false);
    }
  };

  const snooze = () => {
    setSnoozedUntil((prev) => ({
      ...prev,
      [doseKeyOf(dose)]: Date.now() + SNOOZE_MS,
    }));
  };

  return (
    <section
      className={`mx-4 mb-4 overflow-hidden rounded-2xl px-4 py-4 shadow-soft-sm ss:mx-8 md:mx-0 ${
        due
          ? "border border-[#f0c9d4] bg-gradient-to-br from-[#fff5f8] to-white"
          : "border border-black/[0.05] bg-white"
      }`}
    >
      <div className="min-w-0">
        <p
          className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${
            due ? "text-[#8a3d5a]" : "text-soft-muted"
          }`}
        >
          {due ? "Due now" : "Up next"}
        </p>
        <h3 className="mt-1 truncate text-[18px] font-bold capitalize tracking-tight text-soft-ink">
          {dose.drug}
        </h3>
        <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-soft-muted">
          <Clock3 className="size-3.5 shrink-0" strokeWidth={1.75} />
          {formatRelativeDoseLabel(at, kind, now)}
        </p>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void mark()}
          disabled={loading}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-soft-primary px-3.5 py-2.5 text-[13px] font-semibold text-white shadow-soft-sm transition hover:bg-soft-primary/90 disabled:opacity-50 ss:flex-none"
        >
          {loading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Check className="size-3.5" strokeWidth={2.5} />
          )}
          Mark taken
        </button>
        <button
          type="button"
          onClick={snooze}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl border border-black/[0.08] bg-soft-canvas px-3.5 py-2.5 text-[13px] font-semibold text-soft-ink transition hover:bg-white disabled:opacity-50"
        >
          Snooze 15m
        </button>
      </div>
    </section>
  );
}
