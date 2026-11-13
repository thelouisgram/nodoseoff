"use client";

import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  type Transition,
  type Variants,
} from "framer-motion";
import type { ReactNode } from "react";

/** Tree-shakeable motion subset — prefer over full `motion` on the landing page. */
export { m };

/** Shared ease — soft deceleration used across landing + app. */
export const ndoEase = [0.22, 1, 0.36, 1] as const;

export const ndoSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
};

export const ndoSpringSoft = {
  type: "spring" as const,
  stiffness: 280,
  damping: 28,
};

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
        hidden: { opacity: 0, y: 22 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: ndoEase },
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
          transition: { duration: 0.45, ease: "easeOut" },
        },
      };

  const scaleIn: Variants = reduce
    ? {
        hidden: { opacity: 1, scale: 1 },
        show: { opacity: 1, scale: 1 },
      }
    : {
        hidden: { opacity: 0, scale: 0.96 },
        show: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.5, ease: ndoEase },
        },
      };

  const slideInLeft: Variants = reduce
    ? {
        hidden: { opacity: 1, x: 0 },
        show: { opacity: 1, x: 0 },
      }
    : {
        hidden: { opacity: 0, x: -18 },
        show: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.55, ease: ndoEase },
        },
      };

  const slideInRight: Variants = reduce
    ? {
        hidden: { opacity: 1, x: 0 },
        show: { opacity: 1, x: 0 },
      }
    : {
        hidden: { opacity: 0, x: 18 },
        show: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.55, ease: ndoEase },
        },
      };

  const stagger: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.08,
        delayChildren: reduce ? 0 : 0.06,
      },
    },
  };

  const staggerFast: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.05,
        delayChildren: reduce ? 0 : 0.02,
      },
    },
  };

  const heroItem: Variants = reduce
    ? {
        hidden: { opacity: 1, y: 0 },
        show: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: 18 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: ndoEase },
        },
      };

  const heroStagger: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.09,
        delayChildren: reduce ? 0 : 0.12,
      },
    },
  };

  return {
    fadeUp,
    fadeIn,
    scaleIn,
    slideInLeft,
    slideInRight,
    stagger,
    staggerFast,
    heroItem,
    heroStagger,
    reduce,
  };
}

export const viewOnce = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -6% 0px",
} as const;

/** Dashboard / app page crossfade with a soft lift. */
export function useAppPageTransition() {
  const reduce = useReducedMotion();

  const transition: Transition = reduce
    ? { duration: 0 }
    : { duration: 0.28, ease: ndoEase };

  return {
    reduce,
    initial: reduce ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: reduce ? { opacity: 0 } : { opacity: 0, y: -6 },
    transition,
  };
}

/** List / card enter for dashboard rows. */
export function useListItemMotion(index = 0) {
  const reduce = useReducedMotion();
  if (reduce) {
    return {
      initial: false as const,
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0 },
    };
  }
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.32,
      ease: ndoEase,
      delay: Math.min(index * 0.04, 0.24),
    },
  };
}

/**
 * Shared in-tab section motion — same fade + soft lift as page transitions.
 * Use across Home / Drugs / Account / AMANDA for visual cohesion.
 */
export function useDashboardSectionMotion() {
  const reduce = useReducedMotion();

  const stagger: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.06,
        delayChildren: reduce ? 0 : 0.04,
      },
    },
  };

  const rise: Variants = reduce
    ? {
        hidden: { opacity: 1, y: 0 },
        show: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: 10 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.32, ease: ndoEase },
        },
      };

  /** Nested list ↔ details (same grammar as tab change, slightly softer). */
  const panel = {
    initial: reduce ? false : ({ opacity: 0, y: 10 } as const),
    animate: { opacity: 1, y: 0 },
    exit: reduce ? { opacity: 0 } : { opacity: 0, y: -6 },
    transition: reduce
      ? { duration: 0 }
      : ({ duration: 0.28, ease: ndoEase } as Transition),
  };

  return { reduce, stagger, rise, panel };
}
