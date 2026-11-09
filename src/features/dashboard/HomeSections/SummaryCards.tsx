import { useEffect, useState } from "react";
import { AlarmClock, Pill, HeartPulse, ArrowUpRight } from "lucide-react";
import {
  calculateClosestDoseCountdown,
  formatDoseClock,
  getNextUpcomingDose,
} from "@/utils/dashboard/dashboard";
import { calculateOverallCompliance } from "@/utils/dashboard/drugs";
import { useDrugs, useSchedule } from "@/hooks/useDashboardData";
import { useAppSelector } from "@/store";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 140, damping: 18 },
  },
};

const SummaryCards = () => {
  const { userId } = useAppSelector((state) => state.app);
  const { data: drugs = [] } = useDrugs(userId);
  const { data: schedule = [] } = useSchedule(userId);

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

  const secondary = [
    {
      label: "Ongoing",
      value: String(drugs.length),
      hint: drugs.length === 1 ? "active medication" : "active medications",
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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bar mb-6 grid gap-3 px-4 ss:mb-7 ss:grid-cols-2 ss:px-8 md:mb-8 md:grid-cols-12 md:px-0"
    >
      {/* Featured: label → drug name → time stacked underneath */}
      <motion.div
        variants={cardVariants}
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
            variants={cardVariants}
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
