"use client";

import { ArrowDown, ArrowRight, BellRing, ClipboardList, Pill } from "lucide-react";
import { Fragment } from "react";
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
          <p className="text-[13px] font-semibold text-[#3dcfb6]">
            Easy as 1–2–3
          </p>
          <h2 className="mt-2 text-[2rem] font-bold tracking-tight ss:text-[2.35rem]">
            Three small steps. Big peace of mind.
          </h2>
          <p className="mt-3 max-w-md text-[14px] text-white/60">
            Add your meds, catch the reminders, check your streak — then do it
            again tomorrow.
          </p>
        </m.div>

        <m.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="mt-12 flex flex-col md:flex-row md:items-start"
        >
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <Fragment key={item.step}>
                <m.div
                  variants={fadeUp}
                  className="min-w-0 flex-1 border-t border-white/25 pt-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-[13px] font-semibold tracking-wider text-white/55">
                      {item.step}
                    </p>
                    <span className="flex size-8 items-center justify-center border border-white/20 bg-white/5 text-[#3dcfb6]">
                      <Icon className="size-3.5" strokeWidth={1.75} />
                    </span>
                  </div>
                  <h3 className="mt-3 text-[1.25rem] font-bold">{item.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/75">
                    {item.desc}
                  </p>
                </m.div>

                {index < steps.length - 1 && (
                  <>
                    <div
                      aria-hidden
                      className="flex items-center justify-center py-3 text-[#3dcfb6]/70 md:hidden"
                    >
                      <ArrowDown className="size-4" strokeWidth={2} />
                    </div>
                    <div
                      aria-hidden
                      className="hidden shrink-0 items-center self-center px-3 text-[#3dcfb6]/75 md:flex lg:px-4"
                    >
                      <ArrowRight className="size-4" strokeWidth={2} />
                    </div>
                  </>
                )}
              </Fragment>
            );
          })}
        </m.div>
      </div>
    </section>
  );
}
