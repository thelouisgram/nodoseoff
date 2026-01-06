// components/DrugDetailsGrid.tsx
import React from "react";
import { Clock, Calendar, Repeat, Droplet, Target, Info } from "lucide-react";
import { motion } from "framer-motion";

interface Detail {
  name: string;
  details: string | number;
}

interface DrugDetailsGridProps {
  details: Detail[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid ss:grid-cols-2 md:grid-cols-3 gap-3 mt-6 pb-24"
    >
      {details.map((detail, index) => {
        const { Icon, color } = iconMap(detail.name);

        return (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex items-center gap-3 rounded-lg border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"
          >
            <div className={`flex items-center justify-center ${color}`}>
              <Icon className="size-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                {detail.name}
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate capitalize">
                {detail.details || "—"}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default DrugDetailsGrid;
