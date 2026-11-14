"use client";

import { BellRing, ClipboardList, Pill } from "lucide-react";
import { m, useLandingVariants, viewOnce } from "@/components/landing/motion";

const steps = [
  {
    step: "01",
    title: "Add your medications",
    desc: "Enter doses, timing, and course length for every prescription you take.",
    icon: Pill,
  },
  {
    step: "02",
    title: "Get timely reminders",
    desc: "Receive prompts when a dose is due, then mark it taken in one tap.",
    icon: BellRing,
  },
  {
    step: "03",
    title: "Review your adherence",
    desc: "Watch consistency improve and export reports when you need them.",
    icon: ClipboardList,
  },
];

export default function HowItWorks() {
  const { fadeUp, stagger } = useLandingVariants();

  return (
    <section
      id="how-it-works"
      className="landing-section relative overflow-hidden bg-soft-primary py-20 text-white ss:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 20%, rgba(255,255,255,0.18), transparent 36%), radial-gradient(circle at 88% 70%, rgba(255,255,255,0.12), transparent 40%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 ss:px-6">
        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="max-w-xl"
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3dcfb6]">
            How it works
          </p>
          <h2 className="mt-3 text-[2.15rem] font-extrabold tracking-tight ss:text-[2.5rem]">
            Three small steps. Big peace of mind.
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/70 ss:text-[16px]">
            Add your meds, catch the reminders, check your streak — then do it
            again tomorrow.
          </p>
        </m.div>

        <m.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5"
        >
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <m.div
                key={item.step}
                variants={fadeUp}
                className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] p-5 ss:p-6"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-1 top-2 select-none text-[4.5rem] font-extrabold leading-none text-white/[0.08]"
                >
                  {item.step}
                </span>
                <div className="relative z-[1]">
                  <span className="flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-[#3dcfb6]">
                    <Icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/45">
                    Step {item.step}
                  </p>
                  <h3 className="mt-2 text-[1.25rem] font-bold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/75">
                    {item.desc}
                  </p>
                </div>
              </m.div>
            );
          })}
        </m.div>
      </div>
    </section>
  );
}
