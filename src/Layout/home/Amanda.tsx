"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Pill,
  ShieldCheck,
} from "lucide-react";
import { m, useLandingVariants, viewOnce } from "@/components/landing/motion";
import AmandaChatPreview from "@/Layout/marketing/AmandaChatPreview";

const claims = [
  {
    icon: Pill,
    title: "Already has your list",
    desc: "Your dashboard meds are her cheat sheet — no re-explaining every chat.",
  },
  {
    icon: ShieldCheck,
    title: "Pharmacy lane only",
    desc: "Dosing, timing, interactions, storage. She stays out of diagnosis theater.",
  },
  {
    icon: BookOpen,
    title: "Clarify, don’t prescribe",
    desc: "Clear notes you can take to a pharmacist or clinician — never a substitute.",
  },
];

export default function Amanda() {
  const { fadeUp, stagger } = useLandingVariants();

  return (
    <section
      id="amanda"
      className="landing-section relative overflow-hidden bg-[#031428] py-20 text-white ss:py-24"
    >
      <div className="relative mx-auto max-w-6xl px-4 ss:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
          <m.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewOnce}
            className="max-w-xl"
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3dcfb6]">
              On call
            </p>

            <h2 className="mt-3 text-[2.15rem] font-extrabold tracking-tight ss:text-[2.5rem]">
              AMANDA 6
            </h2>
            <p className="mt-4 text-[1.2rem] font-semibold leading-snug tracking-tight text-white ss:text-[1.35rem]">
              She knows your pillbox{" "}
              <span className="text-[#3dcfb6]">before you ask.</span>
            </p>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/65 ss:text-[16px]">
              Missed a dose? Food with that BP med? A weird side effect at
              11pm? Ask — calm answers from{" "}
              <span className="font-semibold text-white/85">your</span> regimen,
              not a generic web dump.
            </p>

            <m.ul
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={viewOnce}
              className="mt-9 space-y-5"
            >
              {claims.map((item) => {
                const Icon = item.icon;
                return (
                  <m.li
                    key={item.title}
                    variants={fadeUp}
                    className="flex gap-3.5"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/10 text-[#3dcfb6]">
                      <Icon className="size-4" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-[15px] font-bold tracking-tight text-white">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-white/60">
                        {item.desc}
                      </p>
                    </div>
                  </m.li>
                );
              })}
            </m.ul>

            <div className="mt-9 flex flex-col gap-3 ss:flex-row ss:items-center">
              <Link
                href="/signup"
                className="ndo-cta ndo-cta-solid group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[14px] font-bold"
              >
                Start free
                <ArrowRight className="ndo-arrow size-4" />
              </Link>
              <Link
                href="/amanda"
                className="ndo-cta ndo-cta-ghost group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[14px] font-semibold"
              >
                Meet AMANDA 6
              </Link>
            </div>
          </m.div>

          <div className="w-full max-w-sm justify-self-center lg:max-w-md lg:justify-self-end">
            <AmandaChatPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
