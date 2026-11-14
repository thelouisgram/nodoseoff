"use client";

/** A6 avatar — lettermark, face, or badge (face + A6). */
export default function AmandaMark({
  className = "size-12",
  pulse = false,
  onDark = false,
  /**
   * `brand` — navy/white badge (chat, marketing)
   * `current` — inherits text color like Lucide nav icons (sidebar)
   */
  tone = "brand",
  /**
   * `letter` — A6 only (tight slots)
   * `face` — smiley only (sidebar / mobile dock)
   * `badge` — smiley + A6 (chat / marketing)
   */
  variant,
  /** @deprecated use variant="letter" */
  compact = false,
}: {
  className?: string;
  pulse?: boolean;
  onDark?: boolean;
  tone?: "brand" | "current";
  variant?: "letter" | "face" | "badge";
  compact?: boolean;
}) {
  const mode = variant ?? (compact ? "letter" : "badge");
  const inherit = tone === "current";
  const ink = inherit ? "currentColor" : onDark ? "#002860" : "#FFFFFF";
  const ground = onDark ? "#FFFFFF" : "#002860";

  return (
    <span
      className={`relative inline-grid place-items-center ${className}`}
      aria-hidden
    >
      {pulse ? (
        <span
          className={`absolute inset-[-14%] animate-pulse rounded-2xl blur-md ${
            onDark || inherit ? "bg-white/20" : "bg-soft-primary/20"
          }`}
        />
      ) : null}
      <svg
        viewBox="0 0 64 64"
        className={`relative size-full overflow-hidden ${
          inherit ? "" : "rounded-2xl shadow-soft-sm"
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {inherit ? null : <rect width="64" height="64" rx="16" fill={ground} />}
        {mode === "letter" ? (
          <text
            x="32"
            y="42"
            textAnchor="middle"
            fill={ink}
            fontFamily="Manrope, system-ui, sans-serif"
            fontWeight="800"
            fontSize="26"
            letterSpacing="-1"
          >
            A6
          </text>
        ) : mode === "face" ? (
          <>
            <circle cx="24" cy="27" r="4" fill={ink} />
            <circle cx="40" cy="27" r="4" fill={ink} />
            <path
              d="M24 38c3.2 5.5 12.8 5.5 16 0"
              stroke={ink}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <circle cx="24" cy="24" r="3.2" fill={ink} />
            <circle cx="40" cy="24" r="3.2" fill={ink} />
            <path
              d="M26 32c2.2 3 9.8 3 12 0"
              stroke={ink}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <text
              x="32"
              y="52"
              textAnchor="middle"
              fill={ink}
              fontFamily="Manrope, system-ui, sans-serif"
              fontWeight="800"
              fontSize="14"
              letterSpacing="-0.5"
            >
              A6
            </text>
          </>
        )}
      </svg>
    </span>
  );
}
