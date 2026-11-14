"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { m, useLandingVariants, viewOnce } from "@/components/landing/motion";

const keywords = [
  "Cancer",
  "Autoimmune",
  "ARVs",
  "Diabetes",
  "Contraceptives",
  "Ozempic",
];

export default function WhoItsFor() {
  const { fadeUp, scaleIn } = useLandingVariants();

  return (
    <section
      id="who-its-for"
      className="landing-section relative overflow-hidden bg-[#f3f7fb] text-soft-ink"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-10 size-64 rounded-full bg-[#dff5ee]/60 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl md:grid-cols-2 md:items-stretch">
        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="flex flex-col justify-center px-4 py-16 ss:px-6 ss:py-20 md:py-24 lg:px-10"
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-soft-primary">
            Who it’s for
          </p>
          <h2 className="mt-3 max-w-[16ch] text-[2.15rem] font-extrabold leading-[1.05] tracking-tight text-soft-ink ss:text-[2.5rem]">
            Built for regimens that don’t take a day off
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-soft-muted ss:text-[16px]">
            Long-term treatment that has to survive real life — oncology,
            autoimmune care, HIV therapy, daily diabetes meds, birth control,
            weekly GLP-1s, and more.
          </p>

          <p className="mt-8 max-w-md text-[13px] font-semibold leading-relaxed tracking-wide text-soft-ink/70">
            {keywords.join(" · ")}
          </p>

          <Link
            href="/who-its-for"
            className="ndo-press group mt-8 inline-flex w-fit items-center gap-1.5 text-[14px] font-semibold text-soft-primary"
          >
            See who it’s for
            <ArrowRight className="ndo-arrow size-3.5" />
          </Link>
        </m.div>

        <m.div
          variants={scaleIn}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="relative min-h-[320px] ss:min-h-[380px] md:min-h-full"
        >
          <Image
            src="/assets/people/caregiver.jpg"
            alt="A caregiver keeping a long-term medication routine on track"
            fill
            className="object-cover object-[50%_18%]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[#031428]/25 via-transparent to-transparent md:bg-gradient-to-l md:from-transparent md:via-transparent md:to-[#f3f7fb]/35"
          />
        </m.div>
      </div>
    </section>
  );
}
