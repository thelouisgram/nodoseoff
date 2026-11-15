"use client";

import Link from "next/link";
import {
  useCallback,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import { m, ndoSpring } from "@/components/landing/motion";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  /** Soft pull strength in px (default 10). */
  strength?: number;
};

/**
 * Magnetic CTA — pointer attraction inspired by DesignBookmark “Magnetic button”.
 * Animates transform only; respects prefers-reduced-motion.
 */
export default function MagneticCta({
  href,
  className = "",
  children,
  strength = 10,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (reduce || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      ref.current.style.transform = `translate3d(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px, 0)`;
    },
    [reduce, strength],
  );

  const onLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "translate3d(0, 0, 0)";
  }, []);

  if (reduce) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <m.div
      className="inline-flex"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={ndoSpring}
    >
      <Link
        ref={ref}
        href={href}
        className={`ndo-cta-magnetic ${className} will-change-transform`}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ transition: "transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        {children}
      </Link>
    </m.div>
  );
}
