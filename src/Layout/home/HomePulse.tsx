"use client";

import {
  AlertTriangle,
  Check,
  Clock3,
  Flame,
  Package,
  Sparkles,
} from "lucide-react";
import { m, useLandingVariants, viewOnce } from "@/components/landing/motion";

const week = [
  { d: "M", filled: false },
  { d: "T", filled: false },
  { d: "W", filled: false },
  { d: "T", filled: true },
  { d: "F", filled: true },
  { d: "S", filled: true },
  { d: "S", today: true, filled: true },
];

const moments = [
  {
    label: "Next dose",
    title: "Kemi’s losartan at 8:00",
    body: "She’s packing school lunches. Overview shows “in 14m” — the pill stays in the plan.",
  },
  {
    label: "This week",
    title: "Four green days after travel",
    body: "Airport chaos knocked Wednesday. The week chips still tell the true story.",
  },
  {
    label: "Catch-up",
    title: "Yesterday’s evening metformin",
    body: "One quiet “missed yesterday,” a Catch up tap, then back to today’s list.",
  },
  {
    label: "Ask AMANDA 6",
    title: "“Can I take these with dinner?”",
    body: "A chip from Overview opens AMANDA 6 with the evening stack already loaded.",
  },
];

export default function HomePulse() {
  const { fadeUp, stagger, scaleIn, reduce } = useLandingVariants();

  return (
    <section
      id="overview"
      className="landing-section relative overflow-hidden bg-[#f3f7fb] py-20 text-soft-ink ss:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-16 size-72 rounded-full bg-[#dff5ee]/70 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-10 size-80 rounded-full bg-[#e4eef8]/80 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 ss:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <m.div
            variants={scaleIn}
            initial="hidden"
            whileInView="show"
            viewport={viewOnce}
            className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none"
          >
            <div className="relative overflow-hidden rounded-[28px] border border-black/[0.06] bg-soft-canvas p-4 shadow-soft-md ss:p-5">
              <div className="mb-4 flex items-end justify-between gap-3 px-1">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-soft-muted">
                    Overview
                  </p>
                  <p className="mt-1 text-[20px] font-bold tracking-tight text-soft-ink">
                    Hi Kemi,
                  </p>
                </div>
                <span className="rounded-full bg-soft-mint px-2.5 py-1 text-[11px] font-semibold text-soft-mint-ink">
                  86% this week
                </span>
              </div>

              <m.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={viewOnce}
                transition={{ delay: 0.08, duration: 0.4 }}
                className="relative overflow-hidden rounded-2xl bg-soft-primary p-4 text-white shadow-soft-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[12px] font-medium text-white/70">
                    Next dose
                  </p>
                  <span className="flex size-8 items-center justify-center rounded-full border border-white/15 bg-white/10">
                    <Clock3 className="size-3.5" strokeWidth={1.75} />
                  </span>
                </div>
                <p className="mt-3 text-[22px] font-bold capitalize tracking-tight">
                  Losartan
                </p>
                <p className="mt-1 text-[13px] text-white/75">
                  8:00 AM · in 14:22
                </p>
              </m.div>

              <m.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={viewOnce}
                transition={{ delay: 0.16, duration: 0.4 }}
                className="mt-3 rounded-2xl border border-black/[0.05] bg-white p-4 shadow-soft-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-soft-muted">
                    This week
                  </p>
                  <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-soft-peach-ink">
                    <Flame className="size-3.5" strokeWidth={2} />
                    4-day streak
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-7 gap-1.5">
                  {week.map((day, i) => (
                    <span
                      key={`${day.d}-${i}`}
                      className={`flex size-8 items-center justify-center rounded-full text-[11px] font-semibold ${
                        day.filled
                          ? "bg-soft-mint text-soft-mint-ink"
                          : "bg-soft-canvas text-soft-muted/70"
                      } ${day.today ? "ring-2 ring-soft-primary/25 ring-offset-1" : ""}`}
                    >
                      {day.d}
                    </span>
                  ))}
                </div>
              </m.div>

              <m.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={viewOnce}
                transition={{ delay: 0.24, duration: 0.4 }}
                className="mt-3 space-y-2"
              >
                <div className="rounded-2xl border border-[#f0c9d4] bg-[#fff7fa] px-3.5 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#ffe4ee] text-[#8a3d5a]">
                      <AlertTriangle className="size-3.5" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-semibold text-[#8a3d5a]">
                        1 missed dose yesterday
                      </p>
                      <p className="truncate text-[12px] text-soft-ink">
                        Metformin · 8:00 PM
                      </p>
                    </div>
                    <span className="shrink-0 rounded-lg bg-white px-2 py-1 text-[10px] font-semibold text-soft-primary shadow-soft-sm">
                      Catch up
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-soft-peach/80 bg-[#fffaf5] px-3.5 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-soft-peach text-soft-peach-ink">
                      <Package className="size-3.5" strokeWidth={1.75} />
                    </span>
                    <p className="min-w-0 flex-1 text-[12px] text-soft-ink">
                      <span className="font-semibold text-soft-peach-ink">
                        Ending soon
                      </span>
                      {" — "}
                      Amoxicillin · 2 days left
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-hidden pt-1">
                  <Sparkles
                    className="size-3.5 shrink-0 text-soft-primary"
                    strokeWidth={2}
                  />
                  <span className="shrink-0 rounded-full border border-soft-primary/15 bg-soft-primary-soft px-3 py-1.5 text-[11px] font-medium text-soft-primary">
                    Any interactions among my evening doses?
                  </span>
                </div>

                <div className="rounded-2xl border border-black/[0.05] bg-white px-3.5 py-3 shadow-soft-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="flex size-8 items-center justify-center rounded-full border border-soft-mint-ink/25 bg-soft-mint text-soft-mint-ink">
                        <Check className="size-3.5" strokeWidth={2.5} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold capitalize text-soft-ink">
                          Losartan
                        </p>
                        <p className="text-[11px] text-soft-muted">
                          Time: 8:00 AM
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-soft-mint px-2 py-0.5 text-[10px] font-semibold text-soft-mint-ink">
                      Completed
                    </span>
                  </div>
                </div>
              </m.div>
            </div>

            <m.p
              initial={reduce ? false : { opacity: 0 }}
              whileInView={reduce ? undefined : { opacity: 1 }}
              viewport={viewOnce}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="mt-4 text-center text-[12px] text-soft-muted lg:text-left"
            >
              A Tuesday morning, mid-routine.
            </m.p>
          </m.div>

          <div>
            <m.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewOnce}
            >
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-soft-primary">
                Overview
              </p>
              <h2 className="mt-3 text-[2rem] font-bold tracking-tight text-soft-ink ss:text-[2.35rem]">
                Insights shaped like real days
              </h2>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-soft-muted ss:text-[16px]">
                Your next dose, this week’s streak, a catch-up when yesterday
                slipped, and AMANDA 6 when a question shows up mid-routine.
              </p>
            </m.div>

            <m.ul
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={viewOnce}
              className="mt-9 space-y-6"
            >
              {moments.map((moment) => (
                <m.li key={moment.title} variants={fadeUp} className="max-w-md">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-soft-primary/80">
                    {moment.label}
                  </p>
                  <h3 className="mt-1.5 text-[16px] font-bold tracking-tight text-soft-ink">
                    {moment.title}
                  </h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-soft-muted">
                    {moment.body}
                  </p>
                </m.li>
              ))}
            </m.ul>
          </div>
        </div>
      </div>
    </section>
  );
}
