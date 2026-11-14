import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import SiteWhims from "@/components/landing/SiteWhims";

export function SoftPage({
  children,
  whims = false,
}: {
  children: ReactNode;
  /** Floating doodles for marketing/auth — never dashboard/admin */
  whims?: boolean;
}) {
  return (
    <div className="relative min-h-screen bg-soft-canvas font-jakarta text-soft-ink antialiased">
      {whims ? <SiteWhims tone="soft" /> : null}
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}

export function SoftCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-black/[0.05] bg-soft-card shadow-soft-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function SoftPanel({
  children,
  className = "",
  title,
  subtitle,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-black/[0.05] bg-white p-4 shadow-soft-sm ss:p-5 md:p-6 ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title ? (
            <h2 className="text-[18px] font-semibold tracking-tight text-soft-ink">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mt-0.5 text-[13px] text-soft-muted">{subtitle}</p>
          ) : null}
        </div>
      )}
      {children}
    </div>
  );
}

export function SoftInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-black/[0.06] bg-soft-canvas px-4 py-3.5 text-[15px] text-soft-ink outline-none transition placeholder:text-soft-muted focus:border-soft-primary/25 focus:bg-white focus:ring-4 focus:ring-soft-primary/[0.06] ${className}`}
    />
  );
}

export function SoftButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  const styles =
    variant === "primary"
      ? "bg-soft-primary text-white hover:bg-soft-primary/90 shadow-soft-sm"
      : variant === "secondary"
        ? "bg-white text-soft-ink border border-black/[0.08] hover:bg-soft-canvas shadow-soft-sm"
        : "bg-transparent text-soft-muted hover:bg-soft-canvas hover:text-soft-ink";
  return (
    <button
      {...props}
      className={`ndo-press inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-[15px] font-semibold disabled:cursor-not-allowed disabled:opacity-55 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function SoftPill({
  children,
  tone = "lavender",
  className = "",
}: {
  children: ReactNode;
  tone?: "lavender" | "blue" | "pink" | "peach" | "mint" | "gray";
  className?: string;
}) {
  const tones = {
    lavender: "bg-soft-lavender text-soft-lavender-ink",
    blue: "bg-soft-blue text-soft-blue-ink",
    pink: "bg-soft-pink text-soft-pink-ink",
    peach: "bg-soft-peach text-soft-peach-ink",
    mint: "bg-soft-mint text-soft-mint-ink",
    gray: "bg-black/[0.05] text-soft-muted",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function SoftLabel({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[13px] font-medium text-soft-muted"
    >
      {children}
    </label>
  );
}

export function SoftDashboardSurface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative h-full w-full overflow-y-scroll bg-soft-canvas px-4 pb-24 pt-10 font-jakarta text-soft-ink ss:px-8 md:px-12 md:py-14 md:pb-20 ${className}`}
    >
      {children}
    </div>
  );
}

export function SoftSectionHeader({
  title,
  subtitle,
  className = "",
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={`mb-7 ${className}`}>
      <h1 className="truncate font-jakarta text-[28px] font-bold tracking-tight text-soft-ink ss:text-[32px]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1 text-[14px] text-soft-muted ss:text-[15px]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function SoftEmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="px-4 py-12 text-center text-soft-muted">
      {icon ? <div className="mx-auto mb-3 flex justify-center">{icon}</div> : null}
      <p className="text-[15px] font-semibold text-soft-ink">{title}</p>
      {description ? (
        <p className="mt-2 text-[13px] text-soft-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function SoftErrorState({
  title = "Could not load data",
  description = "Check your connection and try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <SoftCard className="max-w-md p-8 text-center">
        <p className="text-[13px] font-semibold uppercase tracking-widest text-soft-muted">
          Error
        </p>
        <h2 className="mt-2 text-[22px] font-bold tracking-tight text-soft-ink">
          {title}
        </h2>
        <p className="mt-2 text-[14px] text-soft-muted">{description}</p>
        {onRetry ? (
          <SoftButton type="button" className="mt-6 w-full" onClick={onRetry}>
            Try again
          </SoftButton>
        ) : null}
      </SoftCard>
    </div>
  );
}
