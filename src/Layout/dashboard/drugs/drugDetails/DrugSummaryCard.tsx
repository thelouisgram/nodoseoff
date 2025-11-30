import React from "react";
import { Activity, Beaker, CheckCircle, Clock, LucideIcon } from "lucide-react";

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
    <div className="w-full ss:w-1/2 rounded-xl border border-gray-200 bg-white p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-navyBlue truncate">
          {drug}
        </h3>

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
          <p className={`font-semibold ${complianceColor}`}>
            {compliance}%
          </p>
        </div>
      </div>

      {/* Progress bar (flat) */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${
            compliance >= 80
              ? "bg-green-500"
              : compliance >= 60
              ? "bg-yellow-400"
              : "bg-red-500"
          }`}
          style={{ width: `${compliance}%` }}
        />
      </div>
    </div>
  );
};

export default DrugSummaryCard;
