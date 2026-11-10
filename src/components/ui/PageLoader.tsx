import Image from "next/image";

export default function PageLoader({
  label = "Loading…",
}: {
  label?: string;
}) {
  return (
    <div
      className="flex min-h-[100dvh] w-full flex-col items-center justify-center gap-5 bg-soft-canvas text-soft-ink"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="ndo-logo-loader relative grid size-[88px] place-items-center">
        <span
          aria-hidden
          className="ndo-logo-loader__ring absolute inset-0 rounded-[22px] bg-soft-primary-soft"
        />
        <span
          aria-hidden
          className="ndo-logo-loader__glow absolute inset-2 rounded-[18px] bg-white shadow-soft-sm"
        />
        <Image
          src="/assets/logo/logo-blue.png"
          alt=""
          width={48}
          height={48}
          priority
          className="ndo-logo-loader__mark relative z-[1] h-11 w-auto select-none"
        />
      </div>

      <div className="flex flex-col items-center gap-2.5">
        <p className="text-[13px] font-medium tracking-tight text-soft-muted">
          {label}
        </p>
        <span aria-hidden className="ndo-logo-loader__dots flex items-center gap-1.5">
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
  );
}
