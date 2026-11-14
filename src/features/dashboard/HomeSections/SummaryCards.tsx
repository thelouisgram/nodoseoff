"use client";

import { useEffect, useState } from "react";
import { AlarmClock, Check, HeartPulse, Loader2, Pill } from "lucide-react";
import {
  calculateClosestDoseCountdown,
  formatDoseClock,
  getNextUpcomingDose,
} from "@/utils/dashboard/dashboard";
import { calculateOverallCompliance } from "@/utils/dashboard/drugs";
import { countUniqueDrugNames, drugDisplayName } from "@/utils/drugs";
import { useDrugs, useSchedule } from "@/hooks/useDashboardData";
import { useAppSelector } from "@/store";
import { motion } from "framer-motion";
import { useDashboardSectionMotion } from "@/components/landing/motion";
import type { ScheduleItem } from "@/types/dashboard";

const MARK_WINDOW_MS = 5 * 60 * 1000;

type Props = {
  onMarkTaken?: (item: ScheduleItem) => Promise<void> | void;
};

const SummaryCards = ({ onMarkTaken }: Props) => {
  const { userId } = useAppSelector((state) => state.app);
  const { data: drugs = [] } = useDrugs(userId);
  const { data: schedule = [] } = useSchedule(userId);
  const { stagger, rise } = useDashboardSectionMotion();

  const next = getNextUpcomingDose(schedule);
  const [now, setNow] = useState(() => Date.now());
  const [countdown, setCountdown] = useState(() =>
    calculateClosestDoseCountdown(schedule)
  );
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const tick = () => {
      setNow(Date.now());
      setCountdown(calculateClosestDoseCountdown(schedule));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [schedule]);

  const msUntil = next ? next.at.getTime() - now : Number.POSITIVE_INFINITY;
  const showMarkTaken =
    Boolean(next && onMarkTaken) && msUntil <= MARK_WINDOW_MS;

  const mark = async () => {
    if (!next || !onMarkTaken || marking) return;
    setMarking(true);
    try {
      await onMarkTaken(next.dose);
    } finally {
      setMarking(false);
    }
  };

  const ongoingCount = countUniqueDrugNames(drugs);
  const adherence = calculateOverallCompliance(schedule);

  const cards = [
    {
      key: "next",
      featured: true,
      label: "Next dose",
      icon: AlarmClock,
      title: next ? drugDisplayName(next.dose) : "None due",
      subtitle: next
        ? `${formatDoseClock(next.dose.time)}${
            countdown && countdown !== "00:00:00" ? ` · in ${countdown}` : ""
          }`
        : "No upcoming doses scheduled",
    },
    {
      key: "ongoing",
      featured: false,
      label: "Ongoing",
      icon: Pill,
      title: String(ongoingCount),
      subtitle:
        ongoingCount === 1 ? "active medication" : "active medications",
    },
    {
      key: "adherence",
      featured: false,
      label: "Adherence",
      icon: HeartPulse,
      title: `${adherence}%`,
      subtitle: "overall adherence",
    },
  ] as const;

  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      animate="show"
      className="mb-4 ss:mb-5 md:mb-6"
    >
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] ss:px-8 md:grid md:grid-cols-12 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
        {cards.map((card) => {
          const Icon = card.icon;
          const isNext = card.key === "next";
          return (
            <motion.div
              key={card.key}
              variants={rise}
              className={`relative flex w-[min(78vw,280px)] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-2xl p-5 shadow-soft-sm ss:w-[min(42vw,300px)] md:w-auto md:min-h-[148px] md:shrink md:snap-align-none ${
                card.featured
                  ? "bg-soft-primary text-white md:col-span-6"
                  : "border border-black/[0.05] bg-white text-soft-ink md:col-span-3"
              }`}
            >
              {card.featured ? (
                <>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-white/10"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-12 right-6 size-32 rounded-full bg-white/5"
                  />
                </>
              ) : null}

              <div className="relative flex items-start justify-between gap-2">
                <p
                  className={`text-[13px] font-medium ${
                    card.featured ? "text-white/70" : "text-soft-muted"
                  }`}
                >
                  {card.label}
                </p>
                <span
                  className={`flex size-9 items-center justify-center rounded-full ${
                    card.featured
                      ? "border border-white/15 bg-white/10"
                      : "border border-soft-primary/10 bg-soft-primary-soft text-soft-primary"
                  }`}
                >
                  <Icon className="size-4" strokeWidth={1.75} />
                </span>
              </div>

              <div className="relative mt-5 min-w-0 md:mt-6">
                <h4
                  className={`truncate font-bold leading-tight tracking-tight ${
                    card.featured
                      ? "text-[22px] capitalize ss:text-[24px]"
                      : "text-[28px] leading-none ss:text-[32px]"
                  }`}
                >
                  {card.title}
                </h4>
                <p
                  className={`mt-1.5 text-[13px] ${
                    card.featured
                      ? "font-medium text-white/70"
                      : "text-soft-muted"
                  }`}
                >
                  {card.subtitle}
                </p>

                {isNext && showMarkTaken ? (
                  <button
                    type="button"
                    onClick={() => void mark()}
                    disabled={marking}
                    className="ndo-press mt-3 inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-[13px] font-semibold text-soft-primary shadow-soft-sm hover:bg-white/90 disabled:opacity-60"
                  >
                    {marking ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Check className="size-3.5" strokeWidth={2.5} />
                    )}
                    Mark taken
                  </button>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default SummaryCards;
