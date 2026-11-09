import { Loader2 } from "lucide-react";

export default function PageLoader({
  label = "Loading…",
}: {
  label?: string;
}) {
  return (
    <div
      className="flex min-h-[100dvh] w-full flex-col items-center justify-center gap-3 bg-soft-canvas text-soft-ink"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2 className="size-8 animate-spin text-soft-primary" />
      <p className="text-[13px] font-medium text-soft-muted">{label}</p>
    </div>
  );
}
