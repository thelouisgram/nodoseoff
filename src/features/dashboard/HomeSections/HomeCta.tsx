"use client";

import { ArrowRight, Pill } from "lucide-react";
import { motion } from "framer-motion";
import type { DrugProps } from "@/types/dashboard";

type Props = {
  drugs: DrugProps[];
  setAdd: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveModal: (value: string) => void;
};

export default function HomeCta({ drugs, setAdd, setActiveModal }: Props) {
  if (drugs.length > 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mx-4 mb-4 ss:mx-8 md:mx-0"
    >
      <div className="relative overflow-hidden rounded-2xl bg-soft-primary px-5 py-5 text-white shadow-soft-sm ss:px-6 ss:py-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-white/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-14 left-1/4 size-40 rounded-full bg-[#1a7a6d]/30"
        />

        <div className="relative flex flex-col gap-4 ss:flex-row ss:items-center ss:justify-between">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#3dcfb6]">
              <Pill className="size-3.5" strokeWidth={2} />
              Get started
            </p>
            <h3 className="mt-1.5 text-[18px] font-bold tracking-tight ss:text-[20px]">
              Add your first medication
            </h3>
            <p className="mt-1 max-w-md text-[13px] leading-relaxed text-white/70 ss:text-[14px]">
              Set up your regimen once — reminders and adherence tracking
              follow.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setAdd(false);
              setActiveModal("drugs");
            }}
            className="ndo-cta ndo-cta-solid group inline-flex shrink-0 items-center justify-center gap-2 self-start px-5 py-3 text-[14px] font-bold ss:self-center"
          >
            Add medication
            <ArrowRight className="ndo-arrow size-4" />
          </button>
        </div>
      </div>
    </motion.section>
  );
}
