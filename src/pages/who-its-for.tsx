"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MarketingPage from "@/components/landing/MarketingPage";
import PageHero from "@/Layout/marketing/PageHero";
import { WHO_ITS_FOR } from "@/utils/who-its-for";
import { m, useLandingVariants, viewOnce } from "@/components/landing/motion";

export default function WhoItsForPage() {
  const { fadeUp, stagger } = useLandingVariants();

  return (
    <MarketingPage
      title="Who it’s for"
      description="NoDoseOff is for cancer patients, autoimmune patients, people on ARVs, diabetes medication, contraceptives, Ozempic, and anyone on long-term treatment who needs calm medication tracking and dose reminders."
      path="/who-its-for"
    >
      <PageHero
        eyebrow="Who it’s for"
        title="Built for people whose meds don’t take a day off"
        description="A medication tracker and reminder app for long-term treatment — oncology, autoimmune disease, HIV ARVs, diabetes, contraceptives, Ozempic, and more."
      />

      <section className="mx-auto max-w-6xl px-4 pb-16 ss:px-6 ss:pb-20">
        <m.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="grid gap-4 ss:grid-cols-2 lg:grid-cols-3"
        >
          {WHO_ITS_FOR.map((item) => (
            <m.li
              key={item.title}
              variants={fadeUp}
              className="ndo-whims-card rounded-2xl border border-black/[0.05] bg-white px-5 py-5 shadow-soft-sm"
            >
              <h2 className="text-[1.15rem] font-bold tracking-tight text-soft-ink">
                {item.title}
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-soft-muted">
                {item.desc}
              </p>
            </m.li>
          ))}
        </m.ul>

        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="mx-auto mt-14 max-w-2xl text-center"
        >
          <p className="text-[15px] leading-relaxed text-soft-muted ss:text-[16px]">
            If your health depends on showing up for the next dose — whether
            that’s chemotherapy support, an autoimmune biologic, antiretroviral
            therapy, diabetes meds, a contraceptive pill, or Ozempic — NoDoseOff
            keeps
            the routine visible: reminders, adherence history, clinician
            reports, and{" "}
            <Link
              href="/amanda"
              className="font-semibold text-soft-primary underline-offset-2 hover:underline"
            >
              AMANDA 6
            </Link>{" "}
            for educational medication questions.
          </p>
        </m.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 ss:px-6 ss:pb-20">
        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-soft-primary px-6 py-10 text-white ss:flex-row ss:items-center ss:px-10"
        >
          <div className="max-w-lg">
            <h2 className="text-[1.65rem] font-extrabold tracking-tight">
              Ready to keep the next dose obvious?
            </h2>
            <p className="mt-2 text-[14px] text-white/70">
              Create a free account, add your meds, and turn on reminders.
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
