"use client";

/** Compact A6 avatar for chat threads and tight UI. */
export default function AmandaMark({
  className = "size-12",
  pulse = false,
  onDark = false,
  /** Nav-sized: lettermark only, no face detail */
  compact = false,
}: {
  className?: string;
  pulse?: boolean;
  onDark?: boolean;
  compact?: boolean;
}) {
  const ink = onDark ? "#002860" : "#FFFFFF";
  const ground = onDark ? "#FFFFFF" : "#002860";

  return (
    <span
      className={`relative inline-grid place-items-center ${className}`}
      aria-hidden
    >
      {pulse ? (
        <span
          className={`absolute inset-[-14%] animate-pulse rounded-2xl blur-md ${
            onDark ? "bg-white/20" : "bg-soft-primary/20"
          }`}
        />
      ) : null}
      <svg
        viewBox="0 0 64 64"
        className="relative size-full overflow-hidden rounded-2xl shadow-soft-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="64" height="64" rx="16" fill={ground} />
        {compact ? (
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
