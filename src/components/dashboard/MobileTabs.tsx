import React from "react";
import { LucideIcon } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";

interface TabItem {
  name: string;
  icon: LucideIcon;
}

interface TabsProps {
  item: TabItem;
  activeTab: string;
  nav?: boolean; // optional label
}

const MobileTabs: React.FC<TabsProps> = ({ item, activeTab, nav }) => {
  const { setActiveTab } = useAppStore((state) => state);
  const Icon = item.icon;
  const isActive = activeTab === item.name;

  // Manual color mapping for each tab
  const getColors = (name: string) => {
    switch (name) {
      case "Home":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-500 dark:border-blue-400",
          icon: "text-blue-600 dark:text-blue-400",
          text: "text-blue-600 dark:text-blue-400",
        };
      case "Drugs":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-900/20",
          border: "border-emerald-500 dark:border-emerald-400",
          icon: "text-emerald-600 dark:text-emerald-400",
          text: "text-emerald-600 dark:text-emerald-400",
        };
      default:
        return {
          bg: "bg-purple-50 dark:bg-purple-900/20",
          border: "border-purple-500 dark:border-purple-400",
          icon: "text-purple-600 dark:text-purple-400",
          text: "text-purple-600 dark:text-purple-400",
        };
    }
  };

  const colors = getColors(item.name);

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setActiveTab(item.name)}
      className={`
        relative flex flex-col items-center justify-center
         p-2 rounded-xl transition-all duration-200 border-[1.5px]
        ${isActive ? `${colors.bg} ${colors.border}` : "hover:bg-gray-100 dark:hover:bg-slate-700"}
      `}
    >
      {/* Icon */}
      <Icon
        className={`w-6 h-6 ${isActive ? `${colors.text}` : "text-gray-400 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-200"}`}
        strokeWidth={1.5}
      />

      {/* Label */}
      {nav && (
        <span
          className={`
            mt-1 text-xs font-medium transition-colors duration-200
            ${isActive ? "text-white dark:text-slate-100" : "text-gray-600 dark:text-gray-400"}
          `}
        >
          {item.name}
        </span>
      )}
    </motion.button>
  );
};

export default MobileTabs;
