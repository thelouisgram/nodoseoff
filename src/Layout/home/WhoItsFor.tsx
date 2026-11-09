"use client";

import Image from "next/image";
import { m, useLandingVariants, viewOnce } from "@/components/landing/motion";

const audiences = [
  {
    image: "/assets/people/clinician.jpg",
    alt: "Smiling clinician in a white coat outdoors",
    title: "Patients & clinicians",
    desc: "Stay consistent between visits — then bring a clear adherence story to your next appointment.",
    accent: "from-[#002860] to-[#1a4a8a]",
  },
  {
    image: "/assets/people/caregiver.jpg",
    alt: "Young professional caregiver smiling with a laptop",
    title: "Caregivers & families",
    desc: "Coordinate someone else’s regimen without sticky notes, missed calls, or guesswork.",
    accent: "from-[#0d3d4d] to-[#1a6b6b]",
  },
];

export default function WhoItsFor() {
  const { fadeUp, stagger } = useLandingVariants();

  return (
    <section
      id="who"
      className="landing-section relative overflow-hidden bg-[#eef4fa] py-20 ss:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-4 ss:px-6">
        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="max-w-2xl"
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-soft-primary">
            Built for real routines
          </p>
          <h2 className="mt-3 text-[2rem] font-bold tracking-tight text-soft-ink ss:text-[2.35rem]">
            Made for the people behind every dose
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-soft-muted ss:text-[16px]">
            Whether you manage your own long-term meds or help someone you love —
            NoDoseOff keeps the routine visible.
          </p>
        </m.div>

        <m.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewOnce}
          className="mt-12 grid gap-6 md:grid-cols-2"
        >
          {audiences.map((item) => (
            <m.article
              key={item.title}
              variants={fadeUp}
              className="group relative min-h-[380px] overflow-hidden ss:min-h-[420px]"
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                quality={75}
                className="object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${item.accent} opacity-80`}
              />
              <div className="absolute inset-x-0 bottom-0 p-6 ss:p-8">
                <h3 className="text-[1.35rem] font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-md text-[14px] leading-relaxed text-white/85">
                  {item.desc}
                </p>
              </div>
            </m.article>
          ))}
        </m.div>
      </div>
    </section>
  );
}
