"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MarketingPage from "@/components/landing/MarketingPage";
import AboutHero from "@/Layout/marketing/AboutHero";
import TeamMemberCard, {
  type TeamMember,
} from "@/Layout/marketing/TeamMemberCard";
import { m, useLandingVariants, viewOnce } from "@/components/landing/motion";

/**
 * Drop photos into /public/assets/team/ matching the `image` paths below.
 * Rename people/roles/blurbs anytime — the cards keep working with placeholders.
 */
const TEAM: TeamMember[] = [
  {
    name: "Dr. Adeyeye Adesanoye",
    role: "Founder and Chief Executive Officer",
    blurb: "",
    image: "/assets/team/01-adeyeye.jpg",
    initials: "AA",
  },
  {
    name: "Dr. Agbo Catherine",
    role: "Co-Founder and Chief Medical Officer",
    blurb: "",
    image: "/assets/team/02-casty.jpg",
    initials: "AC",
  },
  {
    name: "Dr. Ugwoke Chelsea",
    role: "Co-Founder and Chief Product Officer",
    blurb: "",
    image: "/assets/team/03-chelsea.jpg",
    initials: "UC",
  },
  {
    name: "Adeyeye Adeife Esq.",
    role: "Chief Legal and Operating Officer",
    blurb: "",
    image: "/assets/team/04-adeife.png",
    initials: "AA",
  },
];

const BEATS = [
  {
    n: "01",
    title: "The spark",
    text: "Building started in 2023 — a marathon in medical school, not a pitch deck, for a problem that wouldn’t leave.",
  },
  {
    n: "02",
    title: "The gap",
    text: "Wards write perfect regimens. Real life skips evening doses and shows up to clinic unsure.",
  },
  {
    n: "03",
    title: "The team",
    text: "Trained alongside at the College of Medicine, Bingham University — three doctors and a lawyer, same problem.",
  },
];

export default function AboutPage() {
  const { fadeUp, stagger } = useLandingVariants();

  return (
    <MarketingPage
      title="About"
      description="NoDoseOff began at the College of Medicine, Bingham University — the story and team behind medication tracking for people on long-term treatment."
      path="/about"
    >
      <AboutHero />

      <section className="border-t border-black/[0.05] bg-white py-16 ss:py-20">
        <div className="mx-auto max-w-6xl px-4 ss:px-6">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            <m.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewOnce}
            >
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-soft-primary">
                Our story
              </p>
              <h2 className="mt-3 text-[1.85rem] font-extrabold tracking-tight text-soft-ink ss:text-[2.15rem]">
                From a student marathon to a daily product
              </h2>
              <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-soft-muted ss:text-[16px]">
                <p>
                  <span className="font-semibold text-soft-ink">
                    Dr. Adeyeye Adesanoye
                  </span>{" "}
                  started building NoDoseOff in 2023 in medical school —
                  because sticky notes and phone alarms kept failing the people
                  who needed consistency the most.
                </p>
                <p>
                  On the wards, the regimen is easy to write. Between visits,
                  evening doses vanish and clinic becomes “I think I took it
                  most days.” He believed that gap was worth building for — so
                  the marathon didn’t stay a student experiment.
                </p>
                <p>
                  Today{" "}
                  <span className="font-semibold text-soft-ink">NoDoseOff</span>{" "}
                  is tracking, reminders, adherence reports, and{" "}
                  <Link
                    href="/amanda"
                    className="font-semibold text-soft-primary underline-offset-2 hover:underline"
                  >
                    AMANDA 6
                  </Link>{" "}
                  — educational medication help, never a replacement for your
                  doctor or pharmacist.
                </p>
              </div>
            </m.div>

            <m.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={viewOnce}
              className="flex flex-col gap-3"
            >
              <m.blockquote
                variants={fadeUp}
                className="rounded-2xl bg-[#031428] px-6 py-7 text-white shadow-soft-md"
              >
                <p className="text-[1.15rem] font-semibold leading-snug tracking-tight ss:text-[1.25rem]">
                  “Long-term treatment rarely fails in the clinic. It fails
                  between visits, on the loud days, when a reminder isn’t
                  enough.”
                </p>
              </m.blockquote>

              {BEATS.map((beat) => (
                <m.div
                  key={beat.n}
                  variants={fadeUp}
                  className="ndo-whims-card flex gap-4 rounded-2xl border border-black/[0.05] bg-[#f3f7fb] px-5 py-4"
                >
                  <span className="text-[13px] font-bold tabular-nums text-soft-primary">
                    {beat.n}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold tracking-tight text-soft-ink">
                      {beat.title}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-soft-muted">
                      {beat.text}
                    </p>
                  </div>
                </m.div>
              ))}
            </m.div>
          </div>
        </div>
      </section>

      <section className="bg-[#f3f7fb] py-16 ss:py-20">
        <div className="mx-auto max-w-6xl px-4 ss:px-6">
          <m.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewOnce}
            className="flex flex-col gap-4 ss:flex-row ss:items-end ss:justify-between"
          >
            <div className="max-w-xl">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-soft-primary">
                Team
              </p>
              <h2 className="mt-3 text-[1.85rem] font-extrabold tracking-tight text-soft-ink">
                Meet the team
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-soft-muted">
                Building NoDoseOff for anyone on long-term medication.
                NoDoseOff is a product of{" "}
                <span className="font-semibold text-soft-ink">Vomerly</span>.
              </p>
            </div>
            <Link
              href="/who-its-for"
              className="ndo-press group inline-flex shrink-0 items-center gap-1.5 text-[14px] font-semibold text-soft-primary"
            >
              Who it’s for
              <ArrowRight className="ndo-arrow size-3.5" />
            </Link>
          </m.div>

          <m.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewOnce}
            className="mt-10 grid grid-cols-2 gap-3 overflow-visible ss:gap-5 lg:grid-cols-4 lg:gap-6"
          >
            {TEAM.map((member) => (
              <m.div
                key={`${member.role}-${member.image}`}
                variants={fadeUp}
                className="overflow-visible"
              >
                <TeamMemberCard member={member} />
              </m.div>
            ))}
          </m.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 ss:px-6 ss:pb-20">
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
              Join free — add your meds, turn on reminders, and meet AMANDA 6
              inside the dashboard.
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
