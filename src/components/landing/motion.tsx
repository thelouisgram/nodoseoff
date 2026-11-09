"use client";

import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import type { ReactNode } from "react";

/** Tree-shakeable motion subset — prefer over full `motion` on the landing page. */
export { m };

export function LandingMotion({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

export function useLandingVariants() {
  const reduce = useReducedMotion();

  const fadeUp: Variants = reduce
    ? {
        hidden: { opacity: 1, y: 0 },
        show: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        },
      };

  const fadeIn: Variants = reduce
    ? {
        hidden: { opacity: 1 },
        show: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { duration: 0.4, ease: "easeOut" },
        },
      };

  const stagger: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.06,
        delayChildren: reduce ? 0 : 0.04,
      },
    },
  };

  return { fadeUp, fadeIn, stagger, reduce };
}

export const viewOnce = {
  once: true,
  amount: 0.18,
  margin: "0px 0px -8% 0px",
} as const;
