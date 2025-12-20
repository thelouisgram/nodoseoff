import React from "react";
import { useDispatch } from "react-redux";
import { LucideIcon } from "lucide-react";
import { useAppStore } from "../../../../store/useAppStore";

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
  const { setActiveTab } = useAppStore((state) => state)
  const Icon = item.icon;
  const isActive = item.name === activeTab;

  // Manual color mapping for each tab
  const getColors = (name: string) => {
    switch (name) {
      case "Home":
        return {
          bg: "bg-blue-100",
          border: "border-blue-500",
          icon: "text-blue-600",
          text: "text-blue-600",
        };
      case "Drugs":
        return {
          bg: "bg-emerald-100",
          border: "border-emerald-500",
          icon: "text-emerald-600",
          text: "text-emerald-600",
        };
      default:
        return {
          bg: "bg-purple-100",
          border: "border-purple-500",
          icon: "text-purple-600",
          text: "text-purple-600",
        };
    }
  };

  const colors = getColors(item.name);

  return (
    <button
      onClick={() => setActiveTab(item.name)}
      className="flex items-center lg:gap-3 cursor-pointer transition-all font-Inter w-full group"
    >
      {/* Icon with border */}
      <div
        className={`
          rounded-xl p-2 transition-all duration-200 border-[1.5px]
          ${isActive 
            ? `${colors.bg} ${colors.border}` 
            : "bg-transparent border-transparent group-hover:bg-gray-100"
          }
        `}
      >
        <Icon
          className={`
            size-6 transition-colors duration-200
            ${isActive ? colors.icon : "text-gray-400 group-hover:text-gray-600"}
          `}
          strokeWidth={1.5}
        />
      </div>

      {/* Label */}
      <span
        className={`
          text-[15px] transition-colors duration-200 whitespace-nowrap
          ${nav ? "hidden lg:block" : "hidden"}
          ${isActive 
            ? `${colors.text} font-semibold` 
            : "text-gray-500 font-normal group-hover:text-gray-700"
          }
        `}
      >
        {item.name}
      </span>
    </button>
  );
};

export default Tabs;