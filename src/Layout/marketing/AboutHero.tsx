"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { m, useLandingVariants } from "@/components/landing/motion";

const FACTS = [
  { label: "Origin", value: "College of Medicine, Bingham University" },
  { label: "Team", value: "3 doctors · 1 lawyer" },
  { label: "Focus", value: "Long-term regimens" },
];

export default function AboutHero() {
  const { fadeUp, heroStagger, heroItem } = useLandingVariants();

  return (
    <section className="relative overflow-hidden bg-[#f3f7fb] pt-28 pb-12 text-soft-ink ss:pt-32 ss:pb-16">
      <m.div
        variants={heroStagger}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-6xl px-4 ss:px-6"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-14">
          <div>
            <m.p
              variants={heroItem}
              className="text-[12px] font-semibold uppercase tracking-[0.16em] text-soft-primary"
            >
              About NoDoseOff
            </m.p>

            <m.h1
              variants={heroItem}
              className="mt-3 max-w-[15ch] text-[2.5rem] font-extrabold leading-[1.05] tracking-tight ss:text-[3rem] md:text-[3.25rem]"
            >
              Started in med school. Built for the doses that{" "}
              <span className="relative inline-block whitespace-nowrap">
                slip
                <svg
                  aria-hidden
                  className="absolute -bottom-0.5 left-0 h-2.5 w-full text-[#3dcfb6]/65"
                  viewBox="0 0 80 10"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M1 7c12-4 22 3 38-1s26 4 40-1"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </m.h1>

            <m.p
              variants={fadeUp}
              className="mt-5 max-w-lg text-[15px] leading-relaxed text-soft-muted ss:text-[16px]"
            >
              A marathon build that became a product — medication tracking,
              reminders, reports, and AMANDA 6 for people whose treatment
              doesn’t take days off.
            </m.p>

            <m.div
              variants={fadeUp}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/signup"
                className="ndo-press group inline-flex items-center gap-2 rounded-xl bg-soft-primary px-6 py-3 text-[14px] font-bold text-white shadow-soft-sm transition hover:bg-soft-primary/90"
              >
                Get started free
                <ArrowRight className="ndo-arrow size-4" />
              </Link>
              <Link
                href="/who-its-for"
                className="ndo-press text-[14px] font-semibold text-soft-primary"
              >
                Who it’s for
              </Link>
            </m.div>
          </div>

          <m.aside
            variants={fadeUp}
            className="grid gap-3 rounded-2xl border border-black/[0.05] bg-white p-5 shadow-soft-sm ss:p-6"
          >
            {FACTS.map((fact) => (
              <div
                key={fact.label}
                className="flex items-baseline justify-between gap-4 border-b border-black/[0.05] pb-3 last:border-0 last:pb-0"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-soft-muted">
                  {fact.label}
                </p>
                <p className="text-right text-[14px] font-semibold tracking-tight text-soft-ink">
                  {fact.value}
                </p>
              </div>
            ))}
          </m.aside>
        </div>
      </m.div>
    </section>
  );
}
