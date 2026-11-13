"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, Stethoscope } from "lucide-react";
import { m, useLandingVariants, viewOnce } from "@/components/landing/motion";

const capabilities = [
  {
    icon: MessageCircle,
    title: "Ask about your meds",
    desc: "Side effects, timing, missed doses, and interactions — grounded in what’s on your dashboard.",
  },
  {
    icon: Stethoscope,
    title: "Medication-only focus",
    desc: "AMANDA 6 stays on pharmacy and adherence topics. No off-topic chatter, no invented prescriptions.",
  },
  {
    icon: ShieldCheck,
    title: "Educational, not a diagnosis",
    desc: "Clear guidance you can take to a pharmacist or clinician — with prompts to confirm personal advice.",
  },
];

const samplePrompts = [
  "Any interactions among my medications?",
  "What if I miss an evening dose?",
  "How should I store this prescription?",
];

export default function Amanda() {
  const { fadeUp, stagger, scaleIn } = useLandingVariants();

  return (
    <section
      id="amanda"
      className="landing-section relative overflow-hidden bg-[#071526] py-20 text-white ss:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(26,122,109,0.35), transparent 42%), radial-gradient(circle at 10% 80%, rgba(0,40,96,0.5), transparent 45%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 ss:px-6 md:grid-cols-2 md:gap-16">
        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3dcfb6]">
            Assistant
          </p>
          <h2 className="mt-3 text-[2.15rem] font-extrabold tracking-tight ss:text-[2.5rem]">
            AMANDA 6
          </h2>
          <p className="mt-2 text-[1.05rem] font-semibold leading-snug text-white/90">
            Your medication AI, live in the dashboard
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-white/70 ss:text-[16px]">
            Ask drug-related questions with your regimen already in context —
            side effects, timing, missed doses, and interactions.
          </p>

          <m.ul
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewOnce}
            className="mt-8 space-y-5"
          >
            {capabilities.map((item) => {
              const Icon = item.icon;
              return (
                <m.li key={item.title} variants={fadeUp} className="flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center bg-[#1a7a6d] text-white">
                    <Icon className="size-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-white/65">
                      {item.desc}
                    </p>
                  </div>
                </m.li>
              );
            })}
          </m.ul>

          <Link
            href="/signup"
            className="ndo-cta ndo-cta-solid group mt-9 inline-flex items-center gap-2 px-6 py-3.5 text-[14px] font-bold"
          >
            Chat with AMANDA 6
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </m.div>

        <m.div
          variants={scaleIn}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="relative border border-white/10 bg-white/[0.06] p-5 ss:p-7"
        >
          <div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="relative size-12 overflow-hidden">
              <Image
                src="/assets/people/clinician.jpg"
                alt="AMANDA 6 assistant portrait"
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div>
              <p className="flex items-center gap-2 text-[15px] font-bold text-white">
                AMANDA 6
                <span
                  aria-hidden
                  className="ndo-pulse-dot size-1.5 rounded-full bg-[#3dcfb6]"
                />
              </p>
              <p className="text-[12px] text-white/55">
                Adherence &amp; Medication Assistant
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="max-w-[90%] bg-white px-4 py-3 text-[13px] leading-relaxed text-soft-ink">
              Hi — I’m AMANDA 6. Ask me about your medications, timing, side
              effects, or interactions. I’ll keep answers educational and
              practical.
            </div>
            <div className="ml-auto max-w-[85%] bg-[#1a7a6d] px-4 py-3 text-[13px] leading-relaxed text-white">
              Can I take my evening blood pressure med with food?
            </div>
            <div className="max-w-[92%] bg-white px-4 py-3 text-[13px] leading-relaxed text-soft-ink">
              Many blood pressure medicines can be taken with food — but check
              your specific drug label. If you share the name from your
              dashboard, I can give more tailored timing notes.
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">
              Try asking
            </p>
            <div className="mt-2 flex flex-col gap-2">
              {samplePrompts.map((prompt) => (
                <p
                  key={prompt}
                  className="border border-dashed border-white/20 px-3 py-2 text-[13px] text-white/80"
                >
                  {prompt}
                </p>
              ))}
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
