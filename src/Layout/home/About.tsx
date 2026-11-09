"use client";

import Image from "next/image";
import { Bell } from "lucide-react";
import { m, useLandingVariants, viewOnce } from "@/components/landing/motion";

const points = [
  "Track multiple medications without confusion",
  "Know what you took — and what you still need",
  "Bring clear adherence history to appointments",
];

export default function AboutNodoseOff() {
  const { fadeUp } = useLandingVariants();

  return (
    <section id="about" className="landing-section bg-white py-20 ss:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 ss:px-6 md:grid-cols-2 md:gap-16">
        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden ss:aspect-[5/6]">
            <Image
              src="/assets/people/caregiver.jpg"
              alt="Caregiver managing medication routines on a laptop"
              fill
              quality={75}
              className="object-cover object-[center_15%]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-soft-primary/45 via-transparent to-transparent" />
          </div>

          <m.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewOnce}
            className="absolute -bottom-4 left-4 right-4 border border-white/40 bg-white p-4 shadow-soft-md ss:left-6 ss:right-auto ss:w-[260px]"
          >
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center bg-[#e8f6ef] text-[#2f6b4f]">
                <Bell className="size-4" />
              </span>
              <div>
                <p className="text-[12px] font-bold text-soft-ink">
                  Evening dose due
                </p>
                <p className="mt-0.5 text-[12px] text-soft-muted">
                  Lisinopril · in 15 minutes
                </p>
              </div>
            </div>
          </m.div>

          <div className="absolute -right-2 top-8 hidden overflow-hidden border-4 border-white shadow-soft-md ss:block ss:h-28 ss:w-28 md:-right-6">
            <Image
              src="/assets/people/clinician.jpg"
              alt="Clinician ready to review adherence reports"
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>
        </m.div>

        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="md:pl-4"
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-soft-primary">
            Why NoDoseOff
          </p>
          <h2 className="mt-3 text-[2rem] font-bold tracking-tight text-soft-ink ss:text-[2.35rem]">
            Medication routines that protect your health
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-soft-muted ss:text-[16px]">
            Missing doses can undo weeks of progress. NoDoseOff keeps your
            regimen visible, timely, and shareable — so you and your clinicians
            stay aligned.
          </p>

          <ul className="mt-8 space-y-4">
            {points.map((point) => (
              <li key={point} className="flex gap-3 text-[15px] text-soft-ink">
                <span
                  aria-hidden
                  className="mt-1.5 size-2 shrink-0 bg-[#1a7a6d]"
                />
                {point}
              </li>
            ))}
          </ul>
        </m.div>
      </div>
    </section>
  );
}
