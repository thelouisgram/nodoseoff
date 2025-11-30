// components/DrugDetailsGrid.tsx
import React from "react";
import {
  Clock,
  Calendar,
  Repeat,
  Droplet,
  Target,
  Info,
} from "lucide-react";

interface Detail {
  name: string;
  details: string | number;
}

interface DrugDetailsGridProps {
  details: Detail[];
}

const iconMap = (name: string) => {
  switch (name.toLowerCase()) {
    case "frequency":
      return { Icon: Repeat, color: "text-indigo-600" };
    case "time":
      return { Icon: Clock, color: "text-green-600" };
    case "duration":
      return { Icon: Calendar, color: "text-orange-500" };
    case "reminder":
      return { Icon: Target, color: "text-teal-600" };
    case "start date":
      return { Icon: Calendar, color: "text-green-500" };
    case "end date":
      return { Icon: Calendar, color: "text-red-500" };
    case "total doses":
      return { Icon: Droplet, color: "text-blue-600" };
    case "completed doses":
      return { Icon: Droplet, color: "text-green-600" };
    case "missed doses":
      return { Icon: Droplet, color: "text-red-600" };
    case "remaining doses":
      return { Icon: Droplet, color: "text-yellow-600" };
    default:
      return { Icon: Info, color: "text-gray-400" };
  }
};

const DrugDetailsGrid: React.FC<DrugDetailsGridProps> = ({ details }) => {
  return (
    <div className="grid ss:grid-cols-2 md:grid-cols-3 gap-3 mt-6 pb-24">
      {details.map((detail, index) => {
        const { Icon, color } = iconMap(detail.name);

        return (
          <div
            key={index}
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className={`flex items-center justify-center ${color}`}>
              <Icon className="size-5" />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-gray-400 uppercase tracking-wide">
                {detail.name}
              </span>
              <span className="text-sm font-semibold text-gray-900 truncate capitalize">
                {detail.details || "—"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DrugDetailsGrid;
