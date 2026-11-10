import React from "react";
import { Check, Loader2 } from "lucide-react";
import { ScheduleItem } from "@/types/dashboard";

interface DoseCardProps {
  item: ScheduleItem;
  onUpdateCompleted: (item: ScheduleItem) => void | Promise<void>;
}

const formatTime = (time: string): string => {
  const [hourString, minutes] = time.split(":");
  const hour = parseInt(hourString);
  const period = hour < 12 ? "AM" : "PM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${period}`;
};

const DoseCard: React.FC<DoseCardProps> = ({ item, onUpdateCompleted }) => {
  const [busy, setBusy] = React.useState(false);

  const handleDoseClick = () => {
    // Per-card debounce only — other doses stay clickable concurrently.
    // Optimistic Redux update makes the checkmark flip immediately.
    if (busy) return;
    setBusy(true);
    void Promise.resolve(onUpdateCompleted(item));
    window.setTimeout(() => setBusy(false), 220);
  };

  return (
    <div className="flex w-full items-center justify-between rounded-xl border border-black/[0.05] bg-soft-canvas/70 px-3.5 py-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={handleDoseClick}
          disabled={busy}
          className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition ${
            item.completed
              ? "border-soft-mint-ink/25 bg-soft-mint text-soft-mint-ink"
              : "border-black/[0.12] bg-white text-transparent hover:border-soft-primary/40"
          }`}
          aria-label={`Mark ${item.drug} as ${
            item.completed ? "not taken" : "taken"
          }`}
        >
          {busy && !item.completed ? (
            <Loader2 className="size-3.5 animate-spin text-soft-muted" />
          ) : item.completed ? (
            <Check className="size-3.5" strokeWidth={2.5} />
          ) : null}
        </button>

        <div className="flex min-w-0 flex-col">
          <p className="truncate text-[14px] font-semibold capitalize text-soft-ink">
            {item.drug}
          </p>
          <span className="mt-0.5 text-[12px] text-soft-muted">
            Time: {formatTime(item.time)}
          </span>
        </div>
      </div>

      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          item.completed
            ? "bg-soft-mint text-soft-mint-ink"
            : "bg-amber-50 text-amber-700"
        }`}
      >
        {item.completed ? "Completed" : "Pending"}
      </span>
    </div>
  );
};

export default DoseCard;
