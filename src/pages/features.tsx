"use client";

import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CalendarDays,
  ChartColumnIncreasing,
  FileText,
  History,
  Pill,
  Sparkles,
} from "lucide-react";
import MarketingPage from "@/components/landing/MarketingPage";
import PageHero from "@/Layout/marketing/PageHero";
import { m, useLandingVariants, viewOnce } from "@/components/landing/motion";

const features = [
  {
    icon: BellRing,
    title: "Dose reminders",
    desc: "Clear prompts when each dose is due — morning, midday, or night — with one-tap mark taken.",
    wash: "bg-[#dff5ee]",
    ink: "text-[#0a3d36]",
    well: "bg-[#b7e6d6] text-[#0a3d36]",
  },
  {
    icon: ChartColumnIncreasing,
    title: "Weekly adherence",
    desc: "See taken, missed, and upcoming at a glance so streaks and slip-ups stay honest.",
    wash: "bg-[#e4eef8]",
    ink: "text-[#002860]",
    well: "bg-[#c5d8ec] text-[#002860]",
  },
  {
    icon: FileText,
    title: "Clinician reports",
    desc: "Export a PDF your doctor can read — with settings for past meds range and which sections to include.",
    wash: "bg-[#f3ebe0]",
    ink: "text-[#4a3224]",
    well: "bg-[#e4d4c0] text-[#4a3224]",
  },
  {
    icon: Sparkles,
    title: "AMANDA 6",
    desc: "Ask medication questions in plain language with your regimen already in context.",
    wash: "bg-[#e8f2f6]",
    ink: "text-[#0a3a4a]",
    well: "bg-[#c9dde8] text-[#0a3a4a]",
  },
  {
    icon: Pill,
    title: "Courses & refills",
    desc: "Track course length, ending-soon meds, and completed history without duplicate overlapping courses.",
    wash: "bg-[#eef6f2]",
    ink: "text-[#1f4d3a]",
    well: "bg-[#cfe8db] text-[#1f4d3a]",
  },
  {
    icon: History,
    title: "Side effects & journal",
    desc: "Log symptoms against meds so patterns show up for you — and for AMANDA 6.",
    wash: "bg-[#fff3e8]",
    ink: "text-[#8a5530]",
    well: "bg-[#f0dcc8] text-[#8a5530]",
  },
  {
    icon: CalendarDays,
    title: "Appointments",
    desc: "Keep your next clinic visit handy with date, time, location, and notes for prep.",
    wash: "bg-[#eef1f8]",
    ink: "text-[#002860]",
    well: "bg-[#d5dceb] text-[#002860]",
  },
];

export default function FeaturesPage() {
  const { fadeUp, stagger } = useLandingVariants();

  return (
    <MarketingPage
      title="Features"
      description="Medication reminders and adherence tracking for cancer, autoimmune, ARV, diabetes, contraceptive, and Ozempic regimens — plus clinician reports and AMANDA 6."
      path="/features"
    >
      <PageHero
        eyebrow="Product"
        title="Built for every dose"
        description="From the reminder that finds you to the report you bring to clinic — NoDoseOff keeps the routine calm, visible, and shareable."
      />

      <section className="mx-auto max-w-6xl px-4 pb-20 ss:px-6 ss:pb-24">
        <m.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="grid gap-4 ss:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <m.article
                key={item.title}
                variants={fadeUp}
                className={`ndo-whims-card rounded-2xl p-5 ss:p-6 ${item.wash}`}
              >
                <span
                  className={`ndo-whims-icon flex size-10 items-center justify-center rounded-xl ${item.well}`}
                >
                  <Icon className="size-4" strokeWidth={1.85} />
                </span>
                <h2
                  className={`mt-4 text-[1.2rem] font-bold tracking-tight ${item.ink}`}
                >
                  {item.title}
                </h2>
                <p
                  className={`mt-2 text-[14px] leading-relaxed text-current/75 ${item.ink}`}
                >
                  {item.desc}
                </p>
              </m.article>
            );
          })}
        </m.div>

        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl bg-soft-primary px-6 py-10 text-white ss:flex-row ss:items-center ss:px-10"
        >
          <div className="max-w-lg">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3dcfb6]">
              Next step
            </p>
            <h2 className="mt-2 text-[1.65rem] font-extrabold tracking-tight">
              See it in your own regimen
            </h2>
            <p className="mt-2 text-[14px] text-white/70">
              Create a free account, add your meds, and let reminders + AMANDA 6
              run quietly in the background.
            </p>
          </div>
          <Link
            href="/signup"
            className="ndo-cta ndo-cta-solid group inline-flex shrink-0 items-center gap-2 px-6 py-3.5 text-[14px] font-bold"
          >
            Get started free
            <ArrowRight className="ndo-arrow size-4" />
          </Link>
        </m.div>
      </section>
    </MarketingPage>
  );
}
