import React from "react";
import { Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { ScheduleItem } from "@/types/dashboard";
import { ndoEase } from "@/components/landing/motion";

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
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: ndoEase }}
      whileTap={{ scale: 0.985 }}
      className="flex w-full items-center justify-between rounded-xl border border-black/[0.05] bg-soft-canvas/70 px-3.5 py-3.5"
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={handleDoseClick}
          disabled={busy}
          className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition duration-200 ${
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
            <motion.span
              key="check"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 480, damping: 22 }}
            >
              <Check className="size-3.5" strokeWidth={2.5} />
            </motion.span>
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

      <motion.span
        key={item.completed ? "done" : "pending"}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: ndoEase }}
        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          item.completed
            ? "bg-soft-mint text-soft-mint-ink"
            : "bg-amber-50 text-amber-700"
        }`}
      >
        {item.completed ? "Completed" : "Pending"}
      </motion.span>
    </motion.div>
  );
};

export default DoseCard;
