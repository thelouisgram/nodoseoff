"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Stethoscope } from "lucide-react";
import { m, useLandingVariants } from "@/components/landing/motion";

export default function HeroSection() {
  const { reduce, heroItem, heroStagger } = useLandingVariants();

  return (
    <section
      id="home"
      className="landing-section-critical relative h-[100dvh] overflow-hidden bg-[#031428] 2xl:h-[860px]"
    >
      <div className="absolute inset-0 transform-gpu">
        <Image
          src="/assets/hero/old-man.jpg"
          alt="An older man smiling while checking his phone at an outdoor cafe"
          fill
          priority
          quality={75}
          className="landing-hero-media object-cover object-[50%_center] md:object-[68%_center]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#031428]/97 via-[#031428]/85 to-[#031428]/55 md:via-[#031428]/78 md:to-[#031428]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031428]/80 via-[#031428]/30 to-[#031428]/50" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-16 pt-28 ss:px-6 ss:pb-20 md:justify-center md:pb-24 md:pt-28 lg:pb-28">
        <m.div
          variants={heroStagger}
          initial="hidden"
          animate="show"
          className="max-w-xl text-left"
        >
          <m.p
            variants={heroItem}
            className="mb-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-white/70"
          >
            NoDoseOff
          </m.p>
          <m.h1
            variants={heroItem}
            className="text-[2.55rem] font-extrabold leading-[1.05] tracking-tight text-white ss:text-5xl md:text-[3.5rem]"
          >
            Never miss a dose again
          </m.h1>
          <m.p
            variants={heroItem}
            className="mt-5 max-w-md text-[16px] leading-relaxed text-white/80 ss:text-[17px]"
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
              className="ndo-press inline-flex items-center justify-center gap-2 bg-white px-7 py-3.5 text-[15px] font-bold text-soft-primary transition-opacity hover:opacity-92"
            >
              Start free
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#amanda"
              className="ndo-press inline-flex items-center justify-center gap-2 border border-white/30 bg-white/10 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/15"
            >
              <Sparkles className="size-4" />
              Meet AMANDA 6
            </Link>
          </m.div>
          <m.p
            variants={heroItem}
            className="mt-6 inline-flex items-center gap-2 text-[13px] font-medium text-white/75"
          >
            <Stethoscope
              className="size-4 shrink-0 text-[#3dcfb6]"
              strokeWidth={1.75}
            />
            Built &amp; designed by doctors
          </m.p>
        </m.div>

        <m.div
          initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: reduce ? 0 : 0.55,
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="pointer-events-none absolute bottom-24 right-4 hidden max-w-[220px] border border-white/20 bg-[#031428]/85 p-3.5 md:block lg:right-8"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#3dcfb6]">
            Live reminder
          </p>
          <p className="mt-1 text-[13px] font-semibold text-white">
            Evening dose in 15m
          </p>
          <p className="text-[11px] text-white/65">Ask AMANDA 6 if unsure</p>
        </m.div>
      </div>
    </section>
  );
}
