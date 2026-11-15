"use client";

import Link from "next/link";

type Props = {
  href: string;
  label: string;
  className?: string;
  active?: boolean;
};

/**
 * Dual-line roll hover — DesignBookmark “Roll links” adapted for the navy nav.
 */
export default function RollLink({ href, label, className = "", active }: Props) {
  return (
    <Link
      href={href}
      className={`ndo-roll-link text-[14px] font-medium ${
        active ? "text-white" : "text-white/80"
      } ${className}`}
      aria-current={active ? "page" : undefined}
      data-text={label}
    >
      <span className="ndo-roll-link__inner">
        <span className="ndo-roll-link__line">{label}</span>
        <span className="ndo-roll-link__line" aria-hidden>
          {label}
        </span>
      </span>
    </Link>
  );
}
