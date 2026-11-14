"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Pill,
  ShieldCheck,
} from "lucide-react";
import MarketingPage from "@/components/landing/MarketingPage";
import AmandaChatPreview from "@/Layout/marketing/AmandaChatPreview";
import AmandaMark from "@/Layout/marketing/AmandaMark";
import { m, useLandingVariants, viewOnce } from "@/components/landing/motion";

const pillars = [
  {
    n: "01",
    icon: Pill,
    title: "Regimen-aware",
    desc: "Your dashboard meds, timing, and side-effect logs sit behind every answer.",
  },
  {
    n: "02",
    icon: ShieldCheck,
    title: "Medication-only",
    desc: "Pharmacy, dosing, interactions, storage, allergies, adherence. Nothing else.",
  },
  {
    n: "03",
    icon: BookOpen,
    title: "Educational",
    desc: "Clear notes for you and your clinician — never a diagnosis or prescription.",
  },
];

const prompts = [
  "Any interactions among my medications?",
  "What if I miss an evening dose?",
  "How should I store this prescription?",
  "When should I call about a rash from a new drug?",
];

export default function AmandaPage() {
  const { fadeUp, stagger, heroStagger, heroItem } = useLandingVariants();

  return (
    <MarketingPage
      title="AMANDA 6"
      description="AMANDA 6 is NoDoseOff’s Adherence & Medication Assistant — educational answers grounded in your regimen."
      path="/amanda"
    >
      <section className="relative overflow-hidden bg-[#031428] pt-28 pb-16 text-white ss:pt-32 ss:pb-20">
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 ss:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
          <m.div
            variants={heroStagger}
            initial="hidden"
            animate="show"
            className="max-w-xl"
          >
            <m.p
              variants={heroItem}
              className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3dcfb6]"
            >
              Assistant
            </m.p>
            <m.h1
              variants={heroItem}
              className="mt-3 text-[2.15rem] font-extrabold tracking-tight ss:text-[2.5rem] md:text-[2.75rem]"
            >
              AMANDA 6
            </m.h1>
            <m.p
              variants={heroItem}
              className="mt-3 text-[1.05rem] font-semibold leading-snug tracking-tight text-white/90"
            >
              Your medication AI — already on your schedule
            </m.p>
            <m.p
              variants={heroItem}
              className="mt-3 max-w-md text-[15px] leading-relaxed text-white/65 ss:text-[16px]"
            >
              Ask about side effects, timing, missed doses, and interactions.
              Educational only. Live in your dashboard after you sign up.
            </m.p>
            <m.div
              variants={heroItem}
              className="mt-8 flex flex-col gap-3 ss:flex-row ss:items-center"
            >
              <Link
                href="/signup"
                className="ndo-cta ndo-cta-solid group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[15px] font-bold"
              >
                Get started free
                <ArrowRight className="ndo-arrow size-4" />
              </Link>
              <Link
                href="/features"
                className="ndo-cta ndo-cta-ghost group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[14px] font-semibold"
              >
                All features
              </Link>
            </m.div>
          </m.div>

          <div className="w-full max-w-sm justify-self-center lg:max-w-md lg:justify-self-end">
            <AmandaChatPreview featured />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 ss:py-20">
        <div className="mx-auto max-w-6xl px-4 ss:px-6">
          <m.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewOnce}
            className="max-w-xl"
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-soft-primary">
              How she works
            </p>
            <h2 className="mt-3 text-[2.15rem] font-extrabold tracking-tight text-soft-ink ss:text-[2.5rem]">
              Built for meds — nothing else
            </h2>
          </m.div>

          <m.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewOnce}
            className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5"
          >
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <m.div
                  key={item.n}
                  variants={fadeUp}
                  className="relative overflow-hidden rounded-2xl border border-black/[0.05] bg-[#f3f7fb] p-5 ss:p-6"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-1 top-2 select-none text-[4.5rem] font-extrabold leading-none text-soft-primary/[0.08]"
                  >
                    {item.n}
                  </span>
                  <div className="relative z-[1]">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-soft-primary-soft text-soft-primary">
                      <Icon className="size-4" strokeWidth={1.75} />
                    </span>
                    <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-soft-muted">
                      Principle {item.n}
                    </p>
                    <h3 className="mt-2 text-[1.25rem] font-bold tracking-tight text-soft-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-soft-muted">
                      {item.desc}
                    </p>
                  </div>
                </m.div>
              );
            })}
          </m.div>
        </div>
      </section>

      <section className="border-t border-black/[0.05] bg-[#f3f7fb] py-16 ss:py-20">
        <div className="mx-auto max-w-6xl px-4 ss:px-6">
          <m.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewOnce}
            className="max-w-xl"
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-soft-primary">
              Try asking
            </p>
            <h2 className="mt-3 text-[2.15rem] font-extrabold tracking-tight text-soft-ink ss:text-[2.5rem]">
              Questions she’s built for
            </h2>
          </m.div>

          <m.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewOnce}
            className="mt-8 flex flex-wrap gap-2.5"
          >
            {prompts.map((prompt) => (
              <m.span
                key={prompt}
                variants={fadeUp}
                className="rounded-full border border-black/[0.05] bg-white px-4 py-2.5 text-[13px] font-medium text-soft-ink shadow-soft-sm"
              >
                {prompt}
              </m.span>
            ))}
          </m.div>
        </div>
      </section>

      <section className="bg-white py-16 ss:py-20">
        <div className="mx-auto max-w-6xl px-4 ss:px-6">
          <m.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewOnce}
            className="relative overflow-visible rounded-2xl bg-soft-primary px-7 py-10 text-white ss:px-10 ss:py-12"
          >
            <div className="flex flex-col items-center gap-8 ss:flex-row ss:items-center ss:justify-between ss:gap-10">
              <div className="flex w-full flex-col items-center gap-4 text-center ss:flex-row ss:items-center ss:gap-5 ss:text-left">
                <AmandaMark className="size-12 shrink-0" onDark />
                <div className="max-w-md">
                  <h2 className="text-[1.75rem] font-extrabold tracking-tight">
                    Meet her in your account
                  </h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/70">
                    Add your meds once. AMANDA 6 uses that context every time
                    you ask.
                  </p>
                </div>
              </div>
              <Link
                href="/signup"
                className="ndo-cta ndo-cta-solid group inline-flex shrink-0 items-center gap-2 px-7 py-3.5 text-[15px] font-bold"
              >
                Get started free
                <ArrowRight className="ndo-arrow size-4" />
              </Link>
            </div>
          </m.div>
        </div>
      </section>
    </MarketingPage>
  );
}
