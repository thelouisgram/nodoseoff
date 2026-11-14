"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { m, useLandingVariants } from "@/components/landing/motion";

type Props = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  dark?: boolean;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  dark = false,
}: Props) {
  const { fadeUp, heroStagger, heroItem } = useLandingVariants();

  return (
    <section
      className={`relative overflow-hidden pt-28 pb-14 ss:pt-32 ss:pb-16 ${
        dark ? "bg-[#031428] text-white" : "bg-[#f3f7fb] text-soft-ink"
      }`}
    >
      {dark ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 30%, rgba(61,207,182,0.18), transparent 40%), radial-gradient(circle at 85% 20%, rgba(0,40,96,0.55), transparent 45%)",
          }}
        />
      ) : null}

      {/* Hero doodle cluster */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <m.span
          className={`absolute right-[8%] top-[30%] hidden ss:block ${
            dark ? "opacity-40" : "opacity-50"
          }`}
          animate={{ y: [0, -8, 0], rotate: [8, 16, 8] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={dark ? "/assets/logo/logo-white.png" : "/assets/logo/logo-blue.png"}
            alt=""
            width={36}
            height={36}
            className="size-9 drop-shadow-sm"
          />
        </m.span>
        <m.span
          className={`absolute left-[10%] bottom-[18%] text-3xl font-light ${
            dark ? "text-white/20" : "text-soft-primary/25"
          }`}
          animate={{ rotate: [0, 20, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        >
          +
        </m.span>
      </div>

      <m.div
        variants={heroStagger}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-6xl px-4 ss:px-6"
      >
        <m.p
          variants={heroItem}
          className={`ndo-whims-eyebrow inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] ${
            dark ? "text-[#3dcfb6]" : "text-soft-primary"
          }`}
        >
          <span className="ndo-pulse-dot size-1.5 rounded-full bg-current" />
          {eyebrow}
        </m.p>
        <m.h1
          variants={heroItem}
          className="mt-3 max-w-[16ch] text-[2.5rem] font-extrabold leading-[1.05] tracking-tight ss:text-[3rem] md:text-[3.35rem]"
        >
          {title}
        </m.h1>
        <m.p
          variants={fadeUp}
          className={`mt-4 max-w-xl text-[15px] leading-relaxed ss:text-[16px] ${
            dark ? "text-white/70" : "text-soft-muted"
          }`}
        >
          {description}
        </m.p>
      </m.div>
    </section>
  );
}
