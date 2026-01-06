import { Pill, Shield, Clock } from "lucide-react";
import { calculateClosestDoseCountdown } from "@/utils/dashboard/dashboard";
import { useDrugs, useSchedule } from "@/hooks/useDashboardData";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const SummaryCards = ({}) => {
  const { userId } = useAppStore((state) => state);
  const { data: drugs = [] } = useDrugs(userId);
  const { data: schedule = [] } = useSchedule(userId);
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="md:w-full flex gap-4 ss:gap-5 mb-8 ss:mb-12 overflow-x-scroll md:overflow-hidden px-4 ss:px-8 md:px-0 bar"
    >
      <motion.div
        variants={cardVariants}
        className="min-w-[300px] ss:w-full h-[120px] ss:h-[150px] bg-[#A755F7] rounded-[10px] flex justify-start items-center p-4 gap-2"
      >
        <Clock className="w-12 h-12 text-white" strokeWidth={2} />
        <div className="flex flex-col text-white justify-center w-full items-start gap-1">
          <h2 className="leading-none font-semibold text-[14px]">
            Next dose in
          </h2>
          <h4 className="font-bold text-[28px] tracking-wider leading-none">
            {calculateClosestDoseCountdown(schedule) || "00:00:00"}
          </h4>
        </div>
      </motion.div>

      <motion.div
        variants={cardVariants}
        className="min-w-[300px] ss:w-full h-[120px] ss:h-[150px] bg-grey dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-[10px] flex justify-start items-center p-4 gap-2 shadow-sm"
      >
        <Pill className="w-12 h-12 text-white" strokeWidth={2} />
        <div className="flex flex-col text-white justify-center w-full items-start gap-1">
          <h2 className="leading-none font-semibold text-[14px]">
            Ongoing Drugs
          </h2>
          <h4 className="font-bold text-[28px] tracking-wider leading-none">
            {drugs.length}
          </h4>
        </div>
      </motion.div>

      <motion.div
        variants={cardVariants}
        className="min-w-[300px] ss:w-full h-[120px] ss:h-[150px] bg-[#3B82F6] rounded-[10px] flex justify-start items-center py-4 pl-4 gap-2"
      >
        <Shield className="w-12 h-12 text-white" strokeWidth={2} />
        <div className="flex flex-col text-white justify-center w-full items-start gap-1">
          <h2 className="leading-none font-semibold text-[14px]">
            Drug Compliance
          </h2>
          <h4 className="font-bold text-[28px] tracking-wider leading-none">
            {Math.round(
              (schedule.filter((d) => d.completed).length / schedule.length) *
                100 || 0
            )}
            %
          </h4>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default SummaryCards;
