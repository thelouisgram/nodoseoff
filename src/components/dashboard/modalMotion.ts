import type { Transition, Variants } from "framer-motion";
import { ndoEase } from "@/components/landing/motion";

/** Shared dashboard overlay / sheet motion — Emil modal recipe + reduced motion. */
export function dashboardModalMotion(reduce: boolean | null) {
  const overlayTransition: Transition = {
    duration: reduce ? 0.12 : 0.22,
    ease: ndoEase,
  };

  const sheetTransition: Transition = reduce
    ? { duration: 0.12, ease: "easeOut" }
    : { duration: 0.28, ease: ndoEase };

  const overlay: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const sheet: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        hidden: { opacity: 0, scale: 0.96, y: 10 },
        show: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.97, y: 8 },
      };

  return { overlay, sheet, overlayTransition, sheetTransition };
}
