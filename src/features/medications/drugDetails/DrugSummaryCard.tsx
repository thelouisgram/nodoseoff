import React from "react";
import { Beaker, CheckCircle, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface DrugSummaryCardProps {
  drug: string;
  tab: string;
  route: string;
  /** null when there are no past doses to score yet */
  compliance: number | null;
  courseCount?: number;
}

interface StatusConfig {
  label: string;
  text: string;
  bg: string;
  Icon: LucideIcon;
}

const statusMap: Record<string, StatusConfig> = {
  completed: {
    label: "Completed",
    text: "text-soft-primary",
    bg: "bg-soft-primary-soft",
    Icon: CheckCircle,
  },
  allergies: {
    label: "Allergy",
    text: "text-soft-pink-ink",
    bg: "bg-soft-pink",
    Icon: Beaker,
  },
};

const DrugSummaryCard: React.FC<DrugSummaryCardProps> = ({
  tab,
  route,
  compliance,
  courseCount = 1,
}) => {
  const status = statusMap[tab];
  const scored = compliance != null;

  const complianceColor =
    !scored
      ? "text-soft-muted"
      : compliance >= 80
        ? "text-soft-mint-ink"
        : compliance >= 60
          ? "text-soft-peach-ink"
          : "text-soft-pink-ink";

  const barColor =
    !scored
      ? "bg-soft-muted/30"
      : compliance >= 80
        ? "bg-soft-mint-ink"
        : compliance >= 60
          ? "bg-soft-peach-ink"
          : "bg-soft-pink-ink";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-4 rounded-2xl border border-black/[0.05] bg-white p-5 shadow-soft-sm ss:w-1/2"
    >
      {(status || courseCount > 1) && (
        <div className="flex flex-wrap items-center gap-2">
          {status ? (
            <span
              className={`inline-flex items-center gap-1.5 rounded-[10px] px-2.5 py-1 text-[12px] font-semibold ${status.bg} ${status.text}`}
            >
              <status.Icon className="size-3.5" />
              {status.label}
            </span>
          ) : null}
          {courseCount > 1 ? (
            <span className="rounded-[10px] bg-soft-canvas px-2.5 py-1 text-[12px] font-semibold text-soft-muted">
              {courseCount} courses
            </span>
          ) : null}
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <div>
          <p className="text-[11px] text-soft-muted">Route</p>
          <p className="font-semibold capitalize text-soft-ink">
            {route || "—"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[11px] text-soft-muted">
            {tab === "completed" ? "Overall adherence" : "Adherence so far"}
          </p>
          <p className={`font-semibold ${complianceColor}`}>
            {scored ? `${compliance}%` : "—"}
          </p>
        </div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-soft-canvas">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: scored ? `${compliance}%` : "0%" }}
          transition={{ type: "spring", bounce: 0, duration: 1, delay: 0.2 }}
        />
      </div>
      {!scored ? (
        <p className="text-[12px] text-soft-muted">
          No past doses to score yet — upcoming ones don’t count against you.
        </p>
      ) : null}
    </motion.div>
  );
};

export default DrugSummaryCard;
