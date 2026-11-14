"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Stethoscope } from "lucide-react";
import { m, useLandingVariants } from "@/components/landing/motion";
import HeroDoseCard from "./HeroDoseCard";

/** Tiny LQIP for instant paint while the hero streams in. */
const HERO_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABcQERQRDhcUEhQaGBcbIjklIh8fIkYyNSk5UkhXVVFIUE5bZoNvW2F8Yk5QcptzfIeLkpSSWG2grJ+OqoOPko3/2wBDARgaGiIeIkMlJUONXlBejY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY3/wAARCAANABQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCfVI2ieOGIoCxzgNlifcVAb+5so2kW2ChnIcjpVNXeRpJmYeZnhsdOKjLPFvEbkAgBg3Ocmlyu1w02Nu11MzW0bsBuI5orDZzbYiQZAGc5NFTqB//Z";

export default function HeroSection() {
  const { heroItem, heroStagger } = useLandingVariants();
  const reduce = useReducedMotion();

  return (
    <section
      id="home"
      className="landing-section-critical relative h-[100dvh] overflow-hidden bg-[#031428] 2xl:h-[860px]"
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <Image
          src="/assets/hero/old-man.webp"
          alt="An older man smiling while checking his phone at an outdoor cafe"
          fill
          priority
          fetchPriority="high"
          quality={70}
          placeholder="blur"
          blurDataURL={HERO_BLUR}
          className="object-cover object-[38%_28%] md:object-[72%_center] landing-hero-media"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 1200px, 1600px"
        />

        <div className="absolute inset-0 bg-black/30" />
        {/* Mobile: even veil so the subject stays optically centered; desktop: left text wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#031428]/65 via-[#031428]/30 to-[#031428]/88 md:hidden" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-[#031428]/97 via-[#031428]/82 to-[#031428]/40 md:block md:via-[#031428]/75 md:to-[#031428]/30" />
        <div className="absolute inset-0 hidden bg-gradient-to-t from-[#031428]/75 via-[#031428]/25 to-[#031428]/45 md:block" />
      </div>

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

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-16 pt-28 ss:px-6 ss:pb-20 md:justify-center md:pb-24 md:pt-28 lg:pb-28">
        <m.div
          variants={heroStagger}
          initial="hidden"
          animate="show"
          className="mx-auto w-full max-w-xl text-center md:mx-0 md:text-left"
        >
          <m.h1
            variants={heroItem}
            className="text-[2.75rem] font-extrabold leading-[0.98] tracking-tight text-white ss:text-[3.25rem] md:text-[3.75rem]"
          >
            NoDoseOff
          </m.h1>
          <m.p
            variants={heroItem}
            className="mx-auto mt-4 max-w-md text-[1.35rem] font-semibold leading-snug tracking-tight text-white/90 ss:text-[1.5rem] md:mx-0 md:text-[1.65rem]"
          >
            Never miss a dose again
          </m.p>
          <m.p
            variants={heroItem}
            className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/75 ss:text-[16px] md:mx-0"
          >
            Smart reminders, adherence tracking, and{" "}
            <span className="font-semibold text-white">AMANDA 6</span> — so
            long-term treatment stays on schedule.
          </m.p>
          <m.div
            variants={heroItem}
            className="mt-8 flex flex-col items-stretch gap-3 ss:flex-row ss:items-center ss:justify-center md:justify-start"
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
            className="mt-6 inline-flex items-center justify-center gap-2 text-[13px] font-medium text-white/75 md:justify-start"
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
