import React from "react";
import { Activity, Beaker, CheckCircle, Clock, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface DrugSummaryCardProps {
  drug: string;
  tab: string;
  route: string;
  compliance: number;
}

interface StatusConfig {
  label: string;
  text: string;
  bg: string;
  Icon: LucideIcon;
}

const statusMap: Record<string, StatusConfig> = {
  Ongoing: {
    label: "Active",
    text: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
    Icon: Activity,
  },
  Completed: {
    label: "Completed",
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    Icon: CheckCircle,
  },
  Allergies: {
    label: "Allergy",
    text: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    Icon: Beaker,
  },
};

const DrugSummaryCard: React.FC<DrugSummaryCardProps> = ({
  drug,
  tab,
  route,
  compliance,
}) => {
  const status = statusMap[tab] || {
    label: tab,
    text: "text-gray-600 dark:text-gray-400",
    bg: "bg-gray-50 dark:bg-slate-800",
    Icon: Clock,
  };

  const complianceColor =
    compliance >= 80
      ? "text-green-600"
      : compliance >= 60
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full ss:w-1/2 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-start">
        <span
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${status.bg} ${status.text}`}
        >
          <status.Icon className="size-3.5" />
          {status.label}
        </span>
      </div>

      {/* Info Row */}
      <div className="flex items-center justify-between text-sm">
        <div>
          <p className="text-gray-400 dark:text-gray-500 text-xs">Route</p>
          <p className="font-medium text-gray-800 dark:text-slate-200 capitalize">
            {route || "N/A"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-gray-400 dark:text-gray-500 text-xs">Compliance</p>
          <p className={`font-semibold ${complianceColor}`}>{compliance}%</p>
        </div>
      </div>

      {/* Progress bar (animated) */}
      <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            compliance >= 80
              ? "bg-green-500"
              : compliance >= 60
                ? "bg-yellow-400"
                : "bg-red-500"
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${compliance}%` }}
          transition={{ type: "spring", bounce: 0, duration: 1, delay: 0.2 }}
        />
      </div>
    </motion.div>
  );
};

export default DrugSummaryCard;
