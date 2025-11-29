import React from "react";
import { Check, Pill } from "lucide-react";
import { ScheduleItem } from "../../../../types/dashboard/dashboard";

interface DoseCardProps {
  item: ScheduleItem;
  onUpdateCompleted: (item: ScheduleItem) => void;
}

const formatTime = (time: string): string => {
  const [hourString, minutes] = time.split(":");
  const hour = parseInt(hourString);
  const period = hour < 12 ? "AM" : "PM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes}${period}`;
};

const DoseCard: React.FC<DoseCardProps> = ({ item, onUpdateCompleted }) => {
  return (
    <div
      className="p-5 md:p-4 border border-gray-100 rounded-[10px] flex justify-between items-center
          bg-white w-full font-Inter text-[14px] text-slate-800 shadow-sm"
    >
      <div className="flex gap-3 items-center">
        <span className={`p-2 rounded-md ${!item.completed ? "bg-gray-200" : "bg-blue-100"}`}>
          <Pill className={`stroke-1.5 ${!item.completed ? "text-gray-400" : "text-blue-600"}`} />
        </span>
        <div className="flex flex-col gap-0 items-start">
          <p className="capitalize font-semibold w-[125px] ss:w-auto">{item.drug}</p>
          <p>{formatTime(item.time)}</p>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <button
          className={`p-2 rounded-full text-white transition-colors duration-200 ${
            item.completed ? "bg-blue-600" : "bg-gray-400"
          }`}
          onClick={() => onUpdateCompleted(item)}
          aria-label={`Mark ${item.drug} as ${item.completed ? "not taken" : "taken"}`}
        >
          <Check className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

export default DoseCard;
