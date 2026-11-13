"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";

type Variant = "white" | "blue" | "mark-blue" | "mark-white";

const ASSETS: Record<
  Variant,
  { src: string; width: number; height: number }
> = {
  white: {
    src: "/assets/logo/logo-with-name-white.png",
    width: 168,
    height: 40,
  },
  blue: {
    src: "/assets/logo/logo-with-name-blue.png",
    width: 168,
    height: 40,
  },
  "mark-blue": {
    src: "/assets/logo/logo-blue.png",
    width: 48,
    height: 48,
  },
  "mark-white": {
    src: "/assets/logo/logo-white.png",
    width: 48,
    height: 48,
  },
};

type Props = {
  variant?: Variant;
  href?: string | null;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  width?: number;
  height?: number;
};

export default function InteractiveLogo({
  variant = "white",
  href = "/",
  className = "",
  imgClassName = "h-8 w-auto ss:h-9",
  priority = false,
  width,
  height,
}: Props) {
  const reduce = useReducedMotion();
  const controls = useAnimationControls();
  const [busy, setBusy] = useState(false);
  const [hovered, setHovered] = useState(false);
  const asset = ASSETS[variant];

  const playWiggle = useCallback(async () => {
    if (reduce || busy) return;
    setBusy(true);
    await controls.start({
      rotate: [0, -10, 9, -6, 4, 0],
      scale: [1, 1.1, 1.05, 1.12, 1.03, 1],
      y: [0, -3, 1, -4, 0, 0],
      transition: { duration: 0.58, ease: "easeInOut" },
    });
    setBusy(false);
  }, [busy, controls, reduce]);

  const mark = (
    <motion.span
      className={`relative inline-flex origin-center will-change-transform ${className}`}
      animate={controls}
      whileHover={
        reduce
          ? undefined
          : {
              scale: 1.07,
              rotate: -3,
              transition: { type: "spring", stiffness: 460, damping: 16 },
            }
      }
      whileTap={
        reduce
          ? undefined
          : {
              scale: 0.93,
              rotate: 4,
              transition: { type: "spring", stiffness: 520, damping: 18 },
            }
      }
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => {
        setHovered(false);
        if (!busy && !reduce) {
          void controls.start({
            rotate: 0,
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 340, damping: 22 },
          });
        }
      }}
      onTap={() => {
        void playWiggle();
      }}
    >
      <Image
        src={asset.src}
        alt="NoDoseOff"
        width={width ?? asset.width}
        height={height ?? asset.height}
        priority={priority}
        className={`select-none ${imgClassName}`}
        draggable={false}
      />

      {!reduce && hovered ? (
        <>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 size-1.5 rounded-full bg-[#3dcfb6]"
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.3, 1.15, 0.2],
              x: [0, 8, 14],
              y: [0, -6, -12],
            }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-[18%] top-0 size-1 rounded-full bg-white/90"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.2, 1, 0.2],
              y: [0, -8, -14],
              x: [0, -4, -6],
            }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute bottom-1 right-[22%] size-1 rounded-full bg-[#7dd3fc]"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.2, 1.1, 0.2],
              y: [0, 5, 9],
              x: [0, 5, 8],
            }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
          />
        </>
      ) : null}
    </motion.span>
  );

  if (href === null) return mark;

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#3dcfb6]/55 focus-visible:ring-offset-2"
      aria-label="NoDoseOff home"
    >
      {mark}
    </Link>
  );
}
