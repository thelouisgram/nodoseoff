"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { m, useLandingVariants, viewOnce } from "@/components/landing/motion";

export default function Banner() {
  const { scaleIn } = useLandingVariants();

  return (
    <section className="landing-section bg-white py-16 ss:py-20">
      <div className="mx-auto max-w-6xl px-4 ss:px-6">
        <m.div
          variants={scaleIn}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="relative overflow-hidden bg-soft-primary px-6 py-14 text-white ss:px-12 ss:py-16"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 left-1/3 size-64 rounded-full bg-[#1a7a6d]/35"
          />

          <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center">
                <div className="relative z-[2] size-11 overflow-hidden border-2 border-white">
                  <Image
                    src="/assets/people/clinician.jpg"
                    alt="Clinician using NoDoseOff reports"
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <div className="relative z-[1] -ml-3 size-11 overflow-hidden border-2 border-white">
                  <Image
                    src="/assets/people/caregiver.jpg"
                    alt="Caregiver staying on top of doses"
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <p className="ml-4 text-[12px] font-medium text-white/70">
                  Patients &amp; caregivers, same calm routine
                </p>
              </div>
              <h2 className="text-[2rem] font-bold tracking-tight ss:text-[2.5rem]">
                Ready for fewer missed doses?
              </h2>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/75 ss:text-[16px]">
                Create a free account, add your medications, and let AMANDA 6
                help you stay steady.
              </p>
            </div>
            <Link
              href="/signup"
              className="ndo-cta ndo-cta-solid group inline-flex shrink-0 items-center gap-2 px-7 py-3.5 text-[15px] font-bold"
            >
              Get started free
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </m.div>
      </div>
    </section>
  );
}
