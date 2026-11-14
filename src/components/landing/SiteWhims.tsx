"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { m } from "@/components/landing/motion";

type Props = {
  /** Softer for auth / legal pages */
  tone?: "loud" | "soft";
};

/**
 * Site-wide marketing whims — floating doodles + interactive marks.
 * Not used on dashboard.
 */
export default function SiteWhims({ tone = "loud" }: Props) {
  const reduce = useReducedMotion();
  const soft = tone === "soft";
  const opacity = soft ? "opacity-40" : "opacity-70";

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[1] overflow-hidden ${opacity}`}
    >
      {/* Capsule — top left */}
      <m.svg
        className="absolute left-[4%] top-[18%] size-12 text-soft-primary/50 ss:left-[7%] ss:size-14 md:size-16"
        viewBox="0 0 64 64"
        fill="none"
        animate={reduce ? undefined : { y: [0, -10, 0], rotate: [-14, -8, -14] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
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

      {/* Check burst — top right */}
      <m.svg
        className="absolute right-[5%] top-[22%] size-11 text-[#3dcfb6]/60 ss:right-[9%] ss:size-13 md:size-14"
        viewBox="0 0 48 48"
        fill="none"
        animate={reduce ? undefined : { y: [0, 8, 0], rotate: [10, 18, 10] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
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

      {/* Interactive logo mark — mid right (pointer-events on) */}
      <m.button
        type="button"
        tabIndex={-1}
        className="pointer-events-auto absolute right-[6%] top-[48%] size-9 cursor-pointer border-0 bg-transparent p-0 ss:right-[10%] ss:size-10 md:size-11"
        whileHover={
          reduce
            ? undefined
            : { scale: 1.35, rotate: 28, transition: { type: "spring", stiffness: 400, damping: 12 } }
        }
        whileTap={
          reduce
            ? undefined
            : { scale: 0.85, rotate: -20, transition: { type: "spring", stiffness: 500, damping: 14 } }
        }
        animate={reduce ? undefined : { y: [0, -14, 0], rotate: [12, 20, 12] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
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

      {/* Clock — bottom left */}
      <m.svg
        className="absolute bottom-[16%] left-[6%] size-10 text-soft-primary/45 ss:bottom-[18%] ss:left-[9%] ss:size-12"
        viewBox="0 0 48 48"
        fill="none"
        animate={reduce ? undefined : { y: [0, 12, 0], rotate: [6, -4, 6] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="24" cy="24" r="15" stroke="currentColor" strokeWidth="2" />
        <path
          d="M24 15v10l6 4"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
        />
      </m.svg>

      {/* Spark — bottom right */}
      <m.svg
        className="absolute bottom-[22%] right-[12%] size-9 text-soft-primary/35 ss:bottom-[24%] ss:right-[16%] ss:size-10"
        viewBox="0 0 40 40"
        fill="none"
        animate={
          reduce
            ? undefined
            : { scale: [1, 1.25, 1], rotate: [0, 45, 0], opacity: [0.45, 0.9, 0.45] }
        }
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M20 4v8M20 28v8M4 20h8M28 20h8M9 9l5.5 5.5M25.5 25.5L31 31M31 9l-5.5 5.5M9 31l5.5-5.5"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
        />
      </m.svg>

      {/* Plus marks */}
      <m.span
        className="absolute left-[20%] top-[38%] text-2xl font-light text-soft-primary/30"
        animate={reduce ? undefined : { rotate: [12, -12, 12], scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        +
      </m.span>
      <m.span
        className="absolute right-[24%] bottom-[36%] text-xl font-light text-[#3dcfb6]/40"
        animate={reduce ? undefined : { rotate: [-8, 16, -8], y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        ×
      </m.span>
    </div>
  );
}
