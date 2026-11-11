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
      return { Icon: Repeat, color: "text-soft-primary" };
    case "time":
      return { Icon: Clock, color: "text-soft-mint-ink" };
    case "duration":
      return { Icon: Calendar, color: "text-soft-peach-ink" };
    case "reminder":
      return { Icon: Target, color: "text-soft-lavender-ink" };
    case "start date":
      return { Icon: Calendar, color: "text-soft-mint-ink" };
    case "end date":
      return { Icon: Calendar, color: "text-soft-pink-ink" };
    case "total doses":
      return { Icon: Droplet, color: "text-soft-primary" };
    case "completed doses":
      return { Icon: Droplet, color: "text-soft-mint-ink" };
    case "missed doses":
      return { Icon: Droplet, color: "text-soft-pink-ink" };
    case "remaining doses":
      return { Icon: Droplet, color: "text-soft-peach-ink" };
    default:
      return { Icon: Info, color: "text-soft-muted" };
  }
};

const DrugDetailsGrid: React.FC<DrugDetailsGridProps> = ({ details }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-3 pb-24 ss:grid-cols-2 md:grid-cols-3"
    >
      {details.map((detail, index) => {
        const { Icon, color } = iconMap(detail.name);

        return (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex items-center gap-3 rounded-xl border border-black/[0.05] bg-white p-4 shadow-soft-sm"
          >
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-xl bg-soft-canvas ${color}`}
            >
              <Icon className="size-4" strokeWidth={2} />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-[11px] uppercase tracking-wide text-soft-muted">
                {detail.name}
              </span>
              <span className="truncate text-sm font-semibold capitalize text-soft-ink">
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
