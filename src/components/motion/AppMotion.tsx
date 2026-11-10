"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { ndoEase } from "@/components/landing/motion";

/**
 * App surfaces already use the full `motion` API (sidebar, lists, doses).
 * Only share MotionConfig here — do not wrap with LazyMotion `strict`,
 * which forbids `motion` and requires `m`.
 */
export default function AppMotion({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: ndoEase }}>
      {children}
    </MotionConfig>
  );
}
