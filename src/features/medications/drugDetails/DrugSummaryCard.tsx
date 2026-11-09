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
    text: "text-green-600",
    bg: "bg-green-50",
    Icon: Activity,
  },
  Completed: {
    label: "Completed",
    text: "text-blue-600",
    bg: "bg-blue-50",
    Icon: CheckCircle,
  },
  Allergies: {
    label: "Allergy",
    text: "text-red-600",
    bg: "bg-red-50",
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
    text: "text-gray-600",
    bg: "bg-gray-50",
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
      className="w-full space-y-4 rounded-2xl border border-black/[0.05] bg-white p-5 shadow-soft-sm ss:w-1/2"
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
          <p className="text-gray-400 text-xs">Route</p>
          <p className="font-medium text-gray-800 capitalize">
            {route || "N/A"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-gray-400 text-xs">Compliance</p>
          <p className={`font-semibold ${complianceColor}`}>{compliance}%</p>
        </div>
      </div>

      {/* Progress bar (animated) */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
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
