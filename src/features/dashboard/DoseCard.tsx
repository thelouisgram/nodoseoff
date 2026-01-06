import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Pill } from "lucide-react";
import { ScheduleItem } from "@/types/dashboard";

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
  const [loading, setLoading] = React.useState(false);

  const handleDoseClick = async ({ item }: { item: ScheduleItem }) => {
    setLoading(true);
    await onUpdateCompleted(item);
    setLoading(false);
  };

  return (
    <div
      className="
        w-full border border-gray-200 dark:border-gray-700 rounded-lg
        px-4 py-3
        flex justify-between items-center
        bg-white dark:bg-slate-900 font-Inter text-sm
      "
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`
            p-2 rounded-md transition-colors duration-300
            ${item.completed ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-100 dark:bg-slate-800"}
          `}
        >
          <motion.div
            initial={false}
            animate={{
              scale: item.completed ? [1, 1.2, 1] : 1,
              rotate: item.completed ? [0, 10, -10, 0] : 0,
            }}
            transition={{ duration: 0.4 }}
          >
            <Pill
              className={`
                size-4
                ${item.completed ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}
              `}
              strokeWidth={1.5}
            />
          </motion.div>
        </div>

        <div className="flex flex-col min-w-0">
          <p className="font-medium capitalize truncate dark:text-slate-100">
            {item.drug}
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(item.time)}
          </span>
        </div>
      </div>

      <button
        onClick={() => handleDoseClick({ item })}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium
          border transition-all duration-300
          ${loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-sm"}
          ${
            item.completed && !loading
              ? "border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30"
              : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700"
          }
        `}
        disabled={loading}
        aria-label={`Mark ${item.drug} as ${
          item.completed ? "not taken" : "taken"
        }`}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 180 }}
            >
              <Loader2 className="size-3.5 animate-spin" strokeWidth={2} />
            </motion.div>
          ) : (
            <motion.div
              key={item.completed ? "taken" : "mark"}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Check className="size-3.5" strokeWidth={2} />
            </motion.div>
          )}
        </AnimatePresence>
        {item.completed ? "Taken" : "Mark"}
      </button>
    </div>
  );
};

export default DoseCard;
