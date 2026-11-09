"use client";

import {
  BellRing,
  Check,
  Home,
  Pill,
  Smartphone,
  Sparkles,
  User,
} from "lucide-react";
import { m, useLandingVariants, viewOnce } from "@/components/landing/motion";

/** Last four days filled = a true 4-day streak ending today */
const weekDays = [
  { d: "M", filled: false },
  { d: "T", filled: false },
  { d: "W", filled: false },
  { d: "T", filled: true },
  { d: "F", filled: true },
  { d: "S", filled: true },
  { d: "S", filled: true, today: true },
];

export default function MobileAppSoon() {
  const { fadeUp, reduce } = useLandingVariants();

  return (
    <section
      id="mobile-app"
      className="landing-section relative overflow-hidden bg-[#071526] py-20 text-white ss:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 30%, rgba(61,207,182,0.22), transparent 40%), radial-gradient(circle at 85% 70%, rgba(0,40,96,0.55), transparent 45%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 ss:px-6 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-16">
        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
        >
          <div className="mb-5 inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1.5 text-[12px] font-semibold tracking-wide text-white/85">
            <span className="size-1.5 animate-pulse bg-[#3dcfb6]" />
            Mobile app · coming soon
          </div>
          <h2 className="text-[2rem] font-bold tracking-tight ss:text-[2.35rem]">
            Same calm routine — in your pocket
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70 ss:text-[16px]">
            We’re building native iOS and Android apps so dose reminders, Home
            insights, and AMANDA 6 travel with you — lock screen to pharmacy run.
          </p>

          <ul className="mt-7 space-y-3 text-[14px] text-white/75">
            <li className="flex items-start gap-2.5">
              <BellRing
                className="mt-0.5 size-4 shrink-0 text-[#3dcfb6]"
                strokeWidth={1.75}
              />
              Push reminders the moment each dose is due
            </li>
            <li className="flex items-start gap-2.5">
              <Smartphone
                className="mt-0.5 size-4 shrink-0 text-[#3dcfb6]"
                strokeWidth={1.75}
              />
              Mark doses taken from your phone — synced with the web dashboard
            </li>
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 border border-white/25 bg-white/10 px-5 py-3 text-[13px] font-semibold text-white/90">
              <AppleGlyph />
              App Store · Soon
            </span>
            <span className="inline-flex items-center gap-2 border border-white/25 bg-white/10 px-5 py-3 text-[13px] font-semibold text-white/90">
              <PlayGlyph />
              Google Play · Soon
            </span>
          </div>
          <p className="mt-4 text-[13px] text-white/50">
            Use the web app today — mobile lands next.
          </p>
        </m.div>

        {/* Realistic phone frame */}
        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="relative mx-auto w-full max-w-[270px] md:max-w-[290px]"
        >
          <m.div
            initial={reduce ? false : { y: 18, opacity: 0 }}
            whileInView={reduce ? undefined : { y: 0, opacity: 1 }}
            viewport={viewOnce}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Side buttons */}
            <span
              aria-hidden
              className="absolute -left-[3px] top-[96px] h-8 w-[3px] rounded-l-sm bg-[#2a2f38]"
            />
            <span
              aria-hidden
              className="absolute -left-[3px] top-[140px] h-14 w-[3px] rounded-l-sm bg-[#2a2f38]"
            />
            <span
              aria-hidden
              className="absolute -right-[3px] top-[120px] h-16 w-[3px] rounded-r-sm bg-[#2a2f38]"
            />

            {/* Device chassis */}
            <div className="relative overflow-hidden rounded-[2.35rem] bg-[#1a1d24] p-[10px] shadow-[0_25px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/15">
              {/* Inner bezel */}
              <div className="relative overflow-hidden rounded-[1.85rem] bg-black">
                {/* Dynamic Island */}
                <div className="pointer-events-none absolute left-1/2 top-3 z-20 h-[22px] w-[96px] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                  <span className="absolute right-3 top-1/2 size-2 -translate-y-1/2 rounded-full bg-[#1a2330] ring-1 ring-[#2a3545]" />
                </div>

                {/* Screen */}
                <div className="relative aspect-[9/19.5] overflow-hidden bg-[#f3f7fb] text-soft-ink">
                  <div className="flex h-full flex-col">
                    {/* Status bar */}
                    <div className="flex items-center justify-between px-5 pb-1 pt-3.5 text-[10px] font-semibold text-soft-ink">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-3.5 rounded-[2px] border border-soft-ink/40">
                          <span className="m-[1px] block h-full w-2/3 rounded-[1px] bg-soft-ink/70" />
                        </span>
                      </div>
                    </div>

                    <div className="min-h-0 flex-1 space-y-2 overflow-hidden px-3 pb-2 pt-2">
                      <div className="flex items-end justify-between gap-2">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-soft-muted">
                            Home
                          </p>
                          <p className="text-[15px] font-bold tracking-tight">
                            Hi Kemi,
                          </p>
                        </div>
                        <span className="rounded-full bg-soft-mint px-2 py-0.5 text-[9px] font-semibold text-soft-mint-ink">
                          86% week
                        </span>
                      </div>

                      <div className="rounded-xl bg-soft-primary p-2.5 text-white">
                        <div className="flex items-start justify-between">
                          <p className="text-[10px] text-white/70">Next dose</p>
                          <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] font-medium text-white/90">
                            Due soon
                          </span>
                        </div>
                        <p className="mt-1 text-[14px] font-bold capitalize">
                          Losartan
                        </p>
                        <p className="text-[10px] text-white/75">
                          8:00 AM · in 12m
                        </p>
                        <div className="mt-2 flex gap-1.5">
                          <span className="rounded-lg bg-white px-2 py-1 text-[9px] font-semibold text-soft-primary">
                            Mark taken
                          </span>
                          <span className="rounded-lg bg-white/15 px-2 py-1 text-[9px] font-semibold text-white">
                            Snooze
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="rounded-xl border border-black/[0.05] bg-white px-2.5 py-2">
                          <p className="text-[9px] text-soft-muted">Ongoing</p>
                          <p className="mt-0.5 text-[15px] font-bold text-soft-ink">
                            3
                          </p>
                          <p className="text-[9px] text-soft-muted">meds</p>
                        </div>
                        <div className="rounded-xl border border-black/[0.05] bg-white px-2.5 py-2">
                          <p className="text-[9px] text-soft-muted">Compliance</p>
                          <p className="mt-0.5 text-[15px] font-bold text-soft-ink">
                            92%
                          </p>
                          <p className="text-[9px] text-soft-muted">overall</p>
                        </div>
                      </div>

                      <div className="rounded-xl border border-black/[0.05] bg-white px-2.5 py-2">
                        <div className="flex items-center justify-between">
                          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-soft-muted">
                            This week
                          </p>
                          <p className="text-[9px] font-semibold text-soft-peach-ink">
                            4-day streak
                          </p>
                        </div>
                        <div className="mt-1.5 flex gap-1">
                          {weekDays.map((day, i) => (
                            <span
                              key={`${day.d}-${i}`}
                              className={`flex size-5 flex-1 items-center justify-center rounded-full text-[8px] font-semibold ${
                                day.filled
                                  ? "bg-soft-mint text-soft-mint-ink"
                                  : "bg-soft-canvas text-soft-muted"
                              } ${
                                day.today
                                  ? "ring-2 ring-soft-primary/30 ring-offset-1"
                                  : ""
                              }`}
                            >
                              {day.d}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-soft-peach/80 bg-[#fffaf5] px-2.5 py-2">
                        <p className="text-[9px] font-semibold text-soft-peach-ink">
                          Ending soon
                        </p>
                        <p className="mt-0.5 truncate text-[10px] text-soft-ink">
                          Amoxicillin · 2 days left
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <Sparkles
                          className="size-3 shrink-0 text-soft-primary"
                          strokeWidth={2}
                        />
                        <span className="truncate rounded-full border border-soft-primary/15 bg-soft-primary-soft px-2 py-1 text-[9px] font-medium text-soft-primary">
                          Any interactions among my evening doses?
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 rounded-xl border border-black/[0.05] bg-white px-2.5 py-2">
                          <span className="flex size-6 items-center justify-center rounded-full border border-soft-mint-ink/25 bg-soft-mint text-soft-mint-ink">
                            <Check className="size-3" strokeWidth={2.5} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[11px] font-semibold">
                              Losartan
                            </p>
                            <p className="text-[9px] text-soft-muted">8:00 AM</p>
                          </div>
                          <span className="rounded-full bg-soft-mint px-1.5 py-0.5 text-[8px] font-semibold text-soft-mint-ink">
                            Done
                          </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-black/[0.05] bg-white px-2.5 py-2">
                          <span className="flex size-6 items-center justify-center rounded-full border border-black/[0.12] bg-soft-canvas" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[11px] font-semibold">
                              Metformin
                            </p>
                            <p className="text-[9px] text-soft-muted">8:00 PM</p>
                          </div>
                          <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[8px] font-semibold text-amber-700">
                            Pending
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* App tab bar */}
                    <div className="border-t border-black/[0.06] bg-white px-2 pb-3.5 pt-1.5">
                      <div className="grid grid-cols-4 gap-0.5">
                        {[
                          { label: "Home", Icon: Home, active: true },
                          { label: "Drugs", Icon: Pill, active: false },
                          { label: "A6", Icon: Sparkles, active: false },
                          { label: "Account", Icon: User, active: false },
                        ].map(({ label, Icon, active }) => (
                          <div
                            key={label}
                            className={`flex flex-col items-center gap-0.5 py-1 ${
                              active ? "text-soft-primary" : "text-soft-muted"
                            }`}
                          >
                            <span
                              className={`flex size-7 items-center justify-center rounded-full ${
                                active
                                  ? "bg-soft-primary text-white"
                                  : "bg-transparent"
                              }`}
                            >
                              <Icon
                                className="size-3.5"
                                strokeWidth={active ? 2.2 : 1.5}
                              />
                            </span>
                            <span
                              className={`text-[8px] ${
                                active ? "font-semibold" : "font-medium"
                              }`}
                            >
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mx-auto mt-1.5 h-1 w-20 rounded-full bg-soft-ink/15" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </m.div>

          <m.div
            aria-hidden
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
            viewport={viewOnce}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="absolute -right-2 top-20 rounded-full border border-white/20 bg-[#1a7a6d] px-3 py-1.5 text-[11px] font-semibold text-white shadow-soft-sm ss:-right-5"
          >
            Push · Soon
          </m.div>
        </m.div>
      </div>
    </section>
  );
}

function AppleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
      <path d="M3.6 2.7c-.3.2-.5.6-.5 1v16.6c0 .4.2.8.5 1l.1.1L13.2 12v-.1L3.7 2.6l-.1.1zm11.1 6.3L12.2 12l2.5 3 3.4-2c.9-.5.9-1.5 0-2l-3.4-2zM4.3 21.7 14 12.9l-2.5-3L4.3 21.7zM14 11.1 4.3 2.3l7.2 7.8L14 11.1z" />
    </svg>
  );
}
