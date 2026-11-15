"use client";

import Link from "next/link";
import { m, useLandingVariants, viewOnce } from "@/components/landing/motion";

/** FAQ copy answers the long-tail questions SEO tools surface for medication reminders. */
export const HOME_FAQS = [
  {
    question: "Is there an app for medication reminders?",
    answer:
      "Yes. NoDoseOff is a free med reminder app and medication tracker built for medication reminders on long-term treatment — blood pressure, diabetes, ARVs, cancer care, and weekly shots.",
  },
  {
    question: "Is there an app to remind you to take medication?",
    answer:
      "NoDoseOff is a medication app that sends med reminders when each dose is due, then lets you mark it taken in one tap. Use a private nickname on pill reminders so lock-screen alerts stay discreet.",
  },
  {
    question: "How do I set up a medication reminder in a health app?",
    answer:
      "Create a free NoDoseOff account, add each medication with dose times and course length, and turn medication reminders on. Morning, midday, and night schedules are supported — including multi-dose days.",
  },
  {
    question: "What is the best medication reminder app?",
    answer:
      "The best med reminder app is the one you’ll actually use. NoDoseOff pairs reliable medication reminders with a medication tracker, adherence streaks, clinician-ready reports, and AMANDA 6 — without noise.",
  },
  {
    question: "Are there any heart apps that also have medication reminders?",
    answer:
      "If you take heart or blood-pressure meds, NoDoseOff works as a pill reminder and medication tracker for those regimens too — catch missed doses and bring a clear adherence record to your next visit.",
  },
  {
    question: "Do medication reminder apps improve health?",
    answer:
      "Medication reminder apps improve adherence — taking meds on time — which is what clinicians watch. NoDoseOff’s med reminder and tracker help you stay consistent and show your week at a glance.",
  },
  {
    question: "What is AMANDA 6?",
    answer:
      "AMANDA 6 is NoDoseOff’s medication AI assistant. Ask about dosing, timing, missed doses, interactions, and storage — answers stay grounded in your regimen, not a generic web dump. It’s free with your account.",
  },
  {
    question: "Is there an AI medication assistant in NoDoseOff?",
    answer:
      "Yes. AMANDA 6 is built-in medication AI search: open chat, ask in plain language, and get regimen-aware guidance you can take to a pharmacist or clinician. Meet AMANDA 6 from the home page or your dashboard.",
  },
] as const;

export default function Faq() {
  const { fadeUp, stagger } = useLandingVariants();

  return (
    <section
      id="faq"
      className="landing-section relative bg-soft-canvas py-20 ss:py-24"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl px-4 ss:px-6">
        <m.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="mb-10 text-center"
        >
          <m.p
            variants={fadeUp}
            className="text-[13px] font-semibold uppercase tracking-[0.14em] text-soft-primary-muted"
          >
            FAQ
          </m.p>
          <m.h2
            id="faq-heading"
            variants={fadeUp}
            className="mt-3 text-[28px] font-bold tracking-tight text-soft-ink ss:text-[34px]"
          >
            Medication reminder questions, answered
          </m.h2>
          <m.p
            variants={fadeUp}
            className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-soft-muted"
          >
            Looking for an app to remind you to take medication — or a
            medication AI like AMANDA 6? Here’s how NoDoseOff fits.
          </m.p>
        </m.div>

        <m.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="space-y-3"
        >
          {HOME_FAQS.map((item) => (
            <m.div key={item.question} variants={fadeUp}>
              <details className="group rounded-2xl border border-black/[0.05] bg-white px-5 py-4 shadow-soft-sm open:shadow-soft">
                <summary className="cursor-pointer list-none text-left text-[16px] font-semibold tracking-tight text-soft-ink marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    {item.question}
                    <span
                      aria-hidden
                      className="mt-0.5 shrink-0 text-soft-muted transition group-open:rotate-45"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-[14px] leading-relaxed text-soft-muted">
                  {item.answer}{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-soft-primary underline-offset-2 hover:underline"
                  >
                    Start free
                  </Link>
                  .
                </p>
              </details>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}
