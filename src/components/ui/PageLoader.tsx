import SiteWhims from "@/components/landing/SiteWhims";
import LogoMarkAssemble from "@/components/ui/LogoMarkAssemble";

export default function PageLoader({
  label = "Loading…",
}: {
  label?: string;
}) {
  return (
    <div
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-soft-canvas font-jakarta text-soft-ink"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <SiteWhims tone="soft" />

      <div className="relative z-[2] flex flex-col items-center gap-5">
        <LogoMarkAssemble className="size-[72px]" />
        <p className="text-[13px] font-medium tracking-tight text-soft-muted">
          {label}
        </p>
      </div>
    </div>
  );
}
