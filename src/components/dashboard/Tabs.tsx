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
  nav: boolean;
}

const Tabs: React.FC<TabsProps> = ({ item, activeTab, nav }) => {
  const { setActiveTab } = useAppStore((state) => state);
  const Icon = item.icon;
  const isActive = item.name === activeTab;

  // Manual color mapping for each tab
  const getColors = (name: string) => {
    switch (name) {
      case "Home":
        return {
          bg: "bg-blue-100 dark:bg-blue-900/40",
          border: "border-blue-500 dark:border-blue-400",
          icon: "text-blue-600 dark:text-blue-400",
          text: "text-blue-600 dark:text-blue-400",
        };
      case "Drugs":
        return {
          bg: "bg-emerald-100 dark:bg-emerald-900/40",
          border: "border-emerald-500 dark:border-emerald-400",
          icon: "text-emerald-600 dark:text-emerald-400",
          text: "text-emerald-600 dark:text-emerald-400",
        };
      default:
        return {
          bg: "bg-purple-100 dark:bg-purple-900/40",
          border: "border-purple-500 dark:border-purple-400",
          icon: "text-purple-600 dark:text-purple-400",
          text: "text-purple-600 dark:text-purple-400",
        };
    }
  };

  const colors = getColors(item.name);

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setActiveTab(item.name)}
      className="flex items-center lg:gap-3 cursor-pointer transition-all font-Inter w-full group"
    >
      {/* Icon with border */}
      <div
        className={`
          rounded-xl p-2 transition-all duration-200 border-[1.5px]
          ${
            isActive
              ? `${colors.bg} ${colors.border}`
              : "bg-transparent border-transparent group-hover:bg-gray-100 dark:group-hover:bg-gray-800"
          }
        `}
      >
        <Icon
          className={`
            size-6 transition-colors duration-200
            ${isActive ? colors.icon : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"}
          `}
          strokeWidth={1.5}
        />
      </div>
      {/* Label */}
      <span
        className={`
          text-[15px] transition-colors duration-200 whitespace-nowrap
          ${nav ? "hidden lg:block" : "hidden"}
          ${
            isActive
              ? `${colors.text} font-semibold`
              : "text-gray-500 dark:text-gray-400 font-normal group-hover:text-gray-700 dark:group-hover:text-gray-200"
          }
        `}
      >
        {item.name}
      </span>
    </motion.button>
  );
};

export default Tabs;
