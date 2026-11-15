"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { m } from "@/components/landing/motion";

type Props = {
  /** Softer for auth / legal pages */
  tone?: "loud" | "soft";
};

/**
 * Sparse site-wide marketing marks — intentional motion, not decoration noise.
 * Hidden on small screens so the first viewport stays clean.
 */
export default function SiteWhims({ tone = "loud" }: Props) {
  const reduce = useReducedMotion();
  const soft = tone === "soft";
  const opacity = soft ? "opacity-35" : "opacity-55";

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[1] hidden overflow-hidden md:block ${opacity}`}
    >
      {/* Capsule — mid left */}
      <m.svg
        className="absolute left-[5%] top-[28%] size-14 text-soft-primary/45 md:size-16"
        viewBox="0 0 64 64"
        fill="none"
        animate={reduce ? undefined : { y: [0, -8, 0], rotate: [-12, -6, -12] }}
        transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect
          x="18"
          y="8"
          width="28"
          height="48"
          rx="14"
          stroke="currentColor"
          strokeWidth="2.25"
        />
        <path d="M18 32h28" stroke="currentColor" strokeWidth="2.25" />
      </m.svg>

      {/* Interactive logo mark — mid right */}
      <m.button
        type="button"
        tabIndex={-1}
        className="pointer-events-auto absolute right-[8%] top-[46%] size-10 cursor-pointer border-0 bg-transparent p-0 md:size-11"
        whileHover={
          reduce
            ? undefined
            : {
                scale: 1.28,
                rotate: 22,
                transition: { type: "spring", stiffness: 400, damping: 14 },
              }
        }
        whileTap={
          reduce
            ? undefined
            : {
                scale: 0.88,
                rotate: -16,
                transition: { type: "spring", stiffness: 500, damping: 14 },
              }
        }
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/assets/logo/logo-blue.png"
          alt=""
          width={44}
          height={44}
          className="size-full drop-shadow-[0_8px_18px_rgba(0,40,96,0.25)]"
          draggable={false}
        />
      </m.button>

      {/* Check burst — lower right */}
      <m.svg
        className="absolute bottom-[20%] right-[14%] size-12 text-[#3dcfb6]/50"
        viewBox="0 0 48 48"
        fill="none"
        animate={reduce ? undefined : { y: [0, 6, 0], rotate: [8, 14, 8] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle
          cx="24"
          cy="24"
          r="17"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 6"
        />
        <path
          d="M14 25l7 7 14-16"
          stroke="currentColor"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </m.svg>
    </div>
  );
}
