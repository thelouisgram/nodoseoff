"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Stethoscope } from "lucide-react";
import { m, useLandingVariants } from "@/components/landing/motion";
import HeroDoseCard from "./HeroDoseCard";

export default function HeroSection() {
  const { heroItem, heroStagger } = useLandingVariants();
  const reduce = useReducedMotion();
  const [photoReady, setPhotoReady] = useState(false);

  return (
    <section
      id="home"
      className="landing-section-critical relative h-[100dvh] overflow-hidden bg-[#031428] 2xl:h-[860px]"
    >
      <div className="absolute inset-0 transform-gpu" aria-hidden>
        {/* Sketch → photo dissolve (blur + soft scale) */}
        <m.div
          className="absolute inset-0"
          initial={false}
          animate={
            reduce
              ? { opacity: photoReady ? 0 : 1 }
              : photoReady
                ? { opacity: 0, scale: 1.06, filter: "blur(14px)" }
                : { opacity: 1, scale: 1.02, filter: "blur(0px)" }
          }
          transition={{
            duration: reduce ? 0.01 : 1.35,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Image
            src="/assets/hero/hero-doodle.jpg"
            alt=""
            fill
            priority
            quality={70}
            className="object-cover object-[72%_center] md:object-[78%_center]"
            sizes="100vw"
          />
        </m.div>

        <m.div
          className="absolute inset-0"
          initial={false}
          animate={
            reduce
              ? { opacity: photoReady ? 1 : 0 }
              : photoReady
                ? { opacity: 1, scale: 1.04, filter: "blur(0px)" }
                : { opacity: 0, scale: 1.1, filter: "blur(18px)" }
          }
          transition={{
            duration: reduce ? 0.01 : 1.55,
            ease: [0.16, 1, 0.3, 1],
            delay: reduce || !photoReady ? 0 : 0.08,
          }}
        >
          <Image
            src="/assets/hero/old-man.jpg"
            alt="An older man smiling while checking his phone at an outdoor cafe"
            fill
            priority
            quality={75}
            onLoad={() => setPhotoReady(true)}
            className={`object-cover object-[50%_center] md:object-[68%_center] ${
              photoReady ? "landing-hero-media" : ""
            }`}
            sizes="100vw"
          />
        </m.div>

        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#031428]/97 via-[#031428]/85 to-[#031428]/55 md:via-[#031428]/78 md:to-[#031428]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031428]/80 via-[#031428]/30 to-[#031428]/50" />
      </div>

      {/* Floating accents after photo is ready */}
      {photoReady ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <m.svg
            className="absolute right-[8%] top-[22%] hidden size-10 text-[#3dcfb6]/45 md:block lg:right-[12%] lg:size-12"
            viewBox="0 0 48 48"
            fill="none"
            animate={reduce ? undefined : { y: [0, -10, 0], rotate: [8, 16, 8] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M12 20c0-6 5-10 12-10s12 4 12 10v8c0 4-3 7-7 7h-2l-3 5-3-5h-2c-4 0-7-3-7-7v-8z"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinejoin="round"
            />
            <circle cx="20" cy="24" r="1.75" fill="currentColor" />
            <circle cx="28" cy="24" r="1.75" fill="currentColor" />
          </m.svg>
        </div>
      ) : null}

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-16 pt-28 ss:px-6 ss:pb-20 md:justify-center md:pb-24 md:pt-28 lg:pb-28">
        <m.div
          variants={heroStagger}
          initial="hidden"
          animate="show"
          className="max-w-xl text-left"
        >
          <m.h1
            variants={heroItem}
            className="text-[2.75rem] font-extrabold leading-[0.98] tracking-tight text-white ss:text-[3.25rem] md:text-[3.75rem]"
          >
            NoDoseOff
          </m.h1>
          <m.p
            variants={heroItem}
            className="mt-4 max-w-md text-[1.35rem] font-semibold leading-snug tracking-tight text-white/90 ss:text-[1.5rem] md:text-[1.65rem]"
          >
            Never miss a dose again
          </m.p>
          <m.p
            variants={heroItem}
            className="mt-3 max-w-md text-[15px] leading-relaxed text-white/75 ss:text-[16px]"
          >
            Smart reminders, adherence tracking, and{" "}
            <span className="font-semibold text-white">AMANDA 6</span> — so
            long-term treatment stays on schedule.
          </m.p>
          <m.div
            variants={heroItem}
            className="mt-8 flex flex-col gap-3 ss:flex-row ss:items-center"
          >
            <Link
              href="/signup"
              className="ndo-cta ndo-cta-solid group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[15px] font-bold"
            >
              Start free
              <ArrowRight className="ndo-arrow size-4" />
            </Link>
            <Link
              href="/amanda"
              className="ndo-cta ndo-cta-ghost group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[15px] font-semibold"
            >
              <Sparkles className="ndo-spark size-4" />
              Meet AMANDA 6
            </Link>
          </m.div>
          <m.p
            variants={heroItem}
            className="mt-6 inline-flex items-center gap-2 text-[13px] font-medium text-white/75"
          >
            <Stethoscope
              className="ndo-nod size-4 shrink-0 text-[#3dcfb6]"
              strokeWidth={1.75}
            />
            Built &amp; designed by doctors
          </m.p>
        </m.div>

        <HeroDoseCard />
      </div>
    </section>
  );
}
