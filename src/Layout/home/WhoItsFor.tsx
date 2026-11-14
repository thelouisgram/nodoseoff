"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WHO_ITS_FOR } from "@/utils/who-its-for";
import { m, useLandingVariants, viewOnce } from "@/components/landing/motion";

export default function WhoItsFor() {
  const { fadeUp, stagger, scaleIn } = useLandingVariants();

  return (
    <section
      id="who-its-for"
      className="landing-section relative overflow-hidden bg-[#f3f7fb] py-20 text-soft-ink ss:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-16 size-72 rounded-full bg-[#dff5ee]/70 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-10 size-80 rounded-full bg-[#e4eef8]/80 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 ss:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <m.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewOnce}
            className="max-w-xl"
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-soft-primary">
              Who it’s for
            </p>
            <h2 className="mt-3 text-[2.15rem] font-extrabold tracking-tight text-soft-ink ss:text-[2.5rem]">
              Built for regimens that don’t take a day off
            </h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-soft-muted ss:text-[16px]">
              Cancer, autoimmune, ARVs, diabetes, contraceptives, Ozempic — and
              every other long-term course that has to survive real life.
            </p>
            <Link
              href="/who-its-for"
              className="ndo-press group mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-soft-primary"
            >
              See all audiences
              <ArrowRight className="ndo-arrow size-3.5" />
            </Link>
          </m.div>

          <m.div
            variants={scaleIn}
            initial="hidden"
            whileInView="show"
            viewport={viewOnce}
            className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl lg:mx-0 lg:max-w-none"
          >
            <Image
              src="/assets/people/caregiver.jpg"
              alt="A caregiver keeping a long-term medication routine on track"
              fill
              className="object-cover object-[50%_20%]"
              sizes="(max-width: 1024px) 90vw, 42vw"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[#031428]/35 via-transparent to-transparent"
            />
          </m.div>
        </div>

        <m.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="mt-12 grid gap-x-10 gap-y-8 border-t border-black/[0.06] pt-10 ss:mt-14 ss:grid-cols-2 lg:grid-cols-3"
        >
          {WHO_ITS_FOR.map((item) => (
            <m.li key={item.title} variants={fadeUp} className="max-w-sm">
              <h3 className="text-[1.05rem] font-bold tracking-tight text-soft-ink">
                {item.title}
              </h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-soft-muted">
                {item.desc}
              </p>
            </m.li>
          ))}
        </m.ul>
      </div>
    </section>
  );
}
