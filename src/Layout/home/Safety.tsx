"use client";

import { Lock, FileCheck2, Bell } from "lucide-react";
import { m, useLandingVariants, viewOnce } from "@/components/landing/motion";

const points = [
  {
    icon: Lock,
    title: "Private by default",
    desc: "Your medication data stays in your account. Dashboard routes are not indexed for search.",
  },
  {
    icon: FileCheck2,
    title: "Share only what you choose",
    desc: "Export adherence reports when you want your clinician to see progress — on your terms.",
  },
  {
    icon: Bell,
    title: "Reminders that respect your day",
    desc: "Dose alerts help you stay consistent without flooding you with noise.",
  },
];

export default function Safety() {
  const { fadeUp, stagger } = useLandingVariants();

  return (
    <section id="safety" className="landing-section bg-white py-20 ss:py-24">
      <div className="mx-auto max-w-6xl px-4 ss:px-6">
        <div className="grid items-end gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <m.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewOnce}
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-soft-primary">
              Trust &amp; safety
            </p>
            <h2 className="mt-3 text-[2rem] font-bold tracking-tight text-soft-ink ss:text-[2.35rem]">
              Healthcare data deserves careful handling
            </h2>
          </m.div>
          <m.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewOnce}
            className="text-[15px] leading-relaxed text-soft-muted"
          >
            NoDoseOff is educational software — not a replacement for your
            doctor or pharmacist. AMANDA 6 reinforces that boundary in every
            conversation.
          </m.p>
        </div>

        <m.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="mt-12 grid gap-px overflow-hidden border border-soft-line bg-soft-line md:grid-cols-3"
        >
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <m.div
                key={point.title}
                variants={fadeUp}
                className="bg-white p-6 ss:p-8"
              >
                <Icon
                  className="size-6 text-soft-primary"
                  strokeWidth={1.75}
                />
                <h3 className="mt-4 text-[16px] font-bold text-soft-ink">
                  {point.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-soft-muted">
                  {point.desc}
                </p>
              </m.div>
            );
          })}
        </m.div>
      </div>
    </section>
  );
}
