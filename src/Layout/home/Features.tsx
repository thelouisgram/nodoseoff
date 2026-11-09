"use client";

import Image from "next/image";
import { BellRing, ChartColumnIncreasing, FileText, Sparkles } from "lucide-react";
import { m, useLandingVariants, viewOnce } from "@/components/landing/motion";

const features = [
  {
    n: "01",
    icon: BellRing,
    title: "Reminders that find you",
    desc: "Morning, midday, night — a clear tap the moment each dose is due.",
    wash: "bg-[#dff5ee]",
    ink: "text-[#0a3d36]",
    iconWell: "bg-[#b7e6d6] text-[#0a3d36]",
    mark: "text-[#b4e4d4]",
  },
  {
    n: "02",
    icon: ChartColumnIncreasing,
    title: "A week you can read",
    desc: "Taken, missed, upcoming — your week at a glance, ready to share.",
    wash: "bg-[#e4eef8]",
    ink: "text-[#002860]",
    iconWell: "bg-[#c5d8ec] text-[#002860]",
    mark: "text-[#c2d6eb]",
  },
  {
    n: "03",
    icon: FileText,
    title: "Reports for the appointment",
    desc: "Bring a clear adherence record to your next visit.",
    wash: "bg-[#f3ebe0]",
    ink: "text-[#4a3224]",
    iconWell: "bg-[#e4d4c0] text-[#4a3224]",
    mark: "text-[#e2d2bd]",
  },
  {
    n: "04",
    icon: Sparkles,
    title: "AMANDA 6 on call",
    desc: "Ask about your meds in plain language — with your regimen already loaded.",
    wash: "bg-[#e8f2f6]",
    ink: "text-[#0a3a4a]",
    iconWell: "bg-[#c9dde8] text-[#0a3a4a]",
    mark: "text-[#c6dae6]",
  },
];

export default function Features() {
  const { fadeUp, stagger } = useLandingVariants();

  return (
    <section
      id="features"
      className="landing-section relative overflow-hidden bg-white pt-12 pb-0 text-soft-ink ss:pt-14 md:h-[100dvh] md:py-0 2xl:h-[900px]"
    >
      {/* Brand atmosphere — kept inside the section so it isn’t clipped away */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-0 w-full overflow-hidden md:w-[48%]"
      >
        <Image
          src="/assets/logo/logo-blue.png"
          alt=""
          width={280}
          height={280}
          className="absolute -left-6 top-[18%] size-28 opacity-[0.05] ss:size-36 md:left-4 md:top-[22%] md:size-40"
        />
        <p className="absolute left-3 top-[42%] font-extrabold leading-[0.85] tracking-[-0.05em] text-soft-primary/[0.06] text-[clamp(3.5rem,18vw,8.5rem)] md:left-6">
          No
          <br />
          Dose
          <br />
          Off
        </p>
      </div>

      <div className="relative z-[1] mx-auto grid h-full max-w-6xl md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] md:grid-rows-1">
        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="relative flex flex-col justify-center px-4 pb-8 pt-2 ss:px-6 md:px-8 md:py-10 lg:px-10"
        >
          <h2 className="max-w-[14ch] text-[2.2rem] font-extrabold leading-[1.05] tracking-tight text-soft-ink ss:text-[2.5rem] md:text-[2.75rem]">
            What keeps you on dose.
          </h2>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-soft-muted ss:text-[15px]">
            Reminders, progress, reports, and AMANDA 6 — built for people who
            take medicine every day.
          </p>
        </m.div>

        <m.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="relative flex flex-col md:grid md:h-full md:min-h-0 md:grid-rows-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <m.article
                key={feature.n}
                variants={fadeUp}
                className={`relative min-h-[200px] overflow-hidden px-5 py-8 ss:px-8 md:min-h-0 md:px-8 md:py-5 lg:px-10 ${feature.wash}`}
              >
                <span
                  aria-hidden
                  className={`pointer-events-none absolute -right-1 top-1/2 -z-0 -translate-y-1/2 select-none font-extrabold leading-none ${feature.mark} text-[5.5rem] md:text-[6.5rem]`}
                >
                  {feature.n}
                </span>

                <div className="relative z-[1] flex h-full max-w-md flex-col justify-center gap-3">
                  <span
                    className={`flex size-10 items-center justify-center rounded-xl ${feature.iconWell}`}
                  >
                    <Icon className="size-4" strokeWidth={1.85} />
                  </span>

                  <div>
                    <h3
                      className={`text-[1.25rem] font-bold leading-tight tracking-tight md:text-[1.35rem] ${feature.ink}`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`mt-1.5 text-[13px] leading-relaxed text-current/75 md:text-[14px] ${feature.ink}`}
                    >
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </m.article>
            );
          })}
        </m.div>
      </div>
    </section>
  );
}
