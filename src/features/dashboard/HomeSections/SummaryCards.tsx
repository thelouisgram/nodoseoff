import { useEffect, useState } from "react";
import { AlarmClock, Pill, HeartPulse, ArrowUpRight } from "lucide-react";
import {
  calculateClosestDoseCountdown,
  formatDoseClock,
  getNextUpcomingDose,
} from "@/utils/dashboard/dashboard";
import { calculateOverallCompliance } from "@/utils/dashboard/drugs";
import { countUniqueDrugNames } from "@/utils/drugs";
import { useDrugs, useSchedule } from "@/hooks/useDashboardData";
import { useAppSelector } from "@/store";
import { motion } from "framer-motion";
import { useDashboardSectionMotion } from "@/components/landing/motion";

const SummaryCards = () => {
  const { userId } = useAppSelector((state) => state.app);
  const { data: drugs = [] } = useDrugs(userId);
  const { data: schedule = [] } = useSchedule(userId);
  const { stagger, rise } = useDashboardSectionMotion();

  const next = getNextUpcomingDose(schedule);
  const [countdown, setCountdown] = useState(() =>
    calculateClosestDoseCountdown(schedule)
  );

  useEffect(() => {
    const tick = () => setCountdown(calculateClosestDoseCountdown(schedule));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [schedule]);

  const ongoingCount = countUniqueDrugNames(drugs);

  const secondary = [
    {
      label: "Ongoing",
      value: String(ongoingCount),
      hint: ongoingCount === 1 ? "active medication" : "active medications",
      icon: Pill,
    },
    {
      label: "Compliance",
      value: `${calculateOverallCompliance(schedule)}%`,
      hint: "overall adherence",
      icon: HeartPulse,
    },
  ];

  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      animate="show"
      className="bar mb-4 grid gap-3 px-4 ss:mb-5 ss:grid-cols-2 ss:px-8 md:mb-6 md:grid-cols-12 md:px-0"
    >
      {/* Featured: label → drug name → time stacked underneath */}
      <motion.div
        variants={rise}
        className="relative overflow-hidden rounded-2xl bg-soft-primary p-5 text-white shadow-soft-sm ss:col-span-2 md:col-span-6"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-white/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-12 right-6 size-32 rounded-full bg-white/5"
        />

        <div className="relative flex items-start justify-between gap-3">
          <p className="text-[13px] font-medium text-white/70">Next dose</p>
          <span className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/10">
            <AlarmClock className="size-4" strokeWidth={1.75} />
          </span>
        </div>

        {next ? (
          <div className="relative mt-4 min-w-0">
            <h4 className="truncate text-[26px] font-bold leading-tight tracking-tight capitalize">
              {next.dose.drug}
            </h4>
            <p className="mt-1.5 text-[14px] font-medium text-white/75">
              {formatDoseClock(next.dose.time)}
              {countdown && countdown !== "00:00:00" ? (
                <span className="text-white/50"> · in {countdown}</span>
              ) : null}
            </p>
          </div>
        ) : (
          <div className="relative mt-4">
            <h4 className="text-[22px] font-bold tracking-tight">None due</h4>
            <p className="mt-1.5 text-[14px] font-medium text-white/70">
              No upcoming doses scheduled
            </p>
          </div>
        )}
      </motion.div>

      {secondary.map((card) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            variants={rise}
            className="relative flex min-h-[148px] flex-col justify-between rounded-2xl border border-black/[0.05] bg-white p-5 shadow-soft-sm md:col-span-3"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[13px] font-medium text-soft-muted">
                {card.label}
              </p>
              <span className="flex size-9 items-center justify-center rounded-full border border-soft-primary/10 bg-soft-primary-soft text-soft-primary">
                <Icon className="size-4" strokeWidth={1.75} />
              </span>
            </div>
            <div className="mt-6">
              <div className="flex items-end gap-2">
                <h4 className="text-[32px] font-bold leading-none tracking-tight text-soft-ink">
                  {card.value}
                </h4>
                <ArrowUpRight
                  className="mb-1 size-4 text-soft-primary/45"
                  strokeWidth={2}
                />
              </div>
              <p className="mt-2 text-[13px] text-soft-muted">{card.hint}</p>
            </div>
          </motion.div>
        );
      })}
    </motion.section>
  );
};

export default SummaryCards;
