import React from "react";
import { Check, Pill } from "lucide-react";
import { ScheduleItem } from "../../../../types/dashboard";

interface DoseCardProps {
  item: ScheduleItem;
  onUpdateCompleted: (item: ScheduleItem) => void;
}

const formatTime = (time: string): string => {
  const [hourString, minutes] = time.split(":");
  const hour = parseInt(hourString);
  const period = hour < 12 ? "AM" : "PM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${period}`;
};

const DoseCard: React.FC<DoseCardProps> = ({ item, onUpdateCompleted }) => {
  return (
    <div
      className="
        w-full border border-gray-200 rounded-lg
        px-4 py-3
        flex justify-between items-center
        bg-white font-Inter text-sm
      "
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`
            p-2 rounded-md
            ${item.completed ? "bg-green-50" : "bg-gray-100"}
          `}
        >
          <Pill
            className={`
              size-4
              ${item.completed ? "text-green-600" : "text-gray-400"}
            `}
            strokeWidth={1.5}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <p className="font-medium capitalize truncate">
            {item.drug}
          </p>
          <span className="text-xs text-gray-500">
            {formatTime(item.time)}
          </span>
        </div>
      </div>

      {/* Action */}
      <button
        onClick={() => onUpdateCompleted(item)}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium
          border transition-colors
          ${
            item.completed
              ? "border-green-300 text-green-700 bg-green-50 hover:bg-green-100"
              : "border-gray-200 text-gray-500 hover:bg-gray-50"
          }
        `}
        aria-label={`Mark ${item.drug} as ${
          item.completed ? "not taken" : "taken"
        }`}
      >
        <Check className="size-3.5" strokeWidth={2} />
        {item.completed ? "Taken" : "Mark"}
      </button>
    </div>
  );
};

export default DoseCard;
