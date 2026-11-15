"use client";

import { useReducedMotion } from "framer-motion";
import { m, ndoEase } from "@/components/landing/motion";

type Props = {
  text: string;
  className?: string;
  /** Delay before the first word (seconds). */
  delay?: number;
};

/**
 * Staggered word reveal — DesignBookmark “Word roll” energy without letter scrambling.
 */
export default function WordRoll({ text, className = "", delay = 0.18 }: Props) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={`inline-flex flex-wrap justify-center gap-x-[0.28em] md:justify-start ${className}`}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.08em]">
          <m.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.55,
              ease: ndoEase,
              delay: delay + i * 0.07,
            }}
          >
            {word}
          </m.span>
        </span>
      ))}
    </span>
  );
}
