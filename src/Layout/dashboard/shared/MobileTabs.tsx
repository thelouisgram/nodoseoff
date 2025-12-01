import React from "react";
import { useDispatch } from "react-redux";
import { updateActive } from "../../../../store/stateSlice";
import { LucideIcon } from "lucide-react";

interface TabItem {
  name: string;
  icon: LucideIcon;
}

interface TabsProps {
  item: TabItem;
  active: string;
  nav?: boolean; // optional label
}

const MobileTabs: React.FC<TabsProps> = ({ item, active, nav }) => {
  const dispatch = useDispatch();
  const Icon = item.icon;
  const isActive = active === item.name;


  // Manual color mapping for each tab
  const getColors = (name: string) => {
    switch (name) {
      case "Home":
        return {
          bg: "bg-blue-50",
          border: "border-blue-500",
          icon: "text-blue-600",
          text: "text-blue-600",
        };
      case "Drugs":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-500",
          icon: "text-emerald-600",
          text: "text-emerald-600",
        };
      default:
        return {
          bg: "bg-purple-50",
          border: "border-purple-500",
          icon: "text-purple-600",
          text: "text-purple-600",
        };
    }
  };

  const colors = getColors(item.name);


  return (
    <button
      onClick={() => dispatch(updateActive(item.name))}
      className={`
        relative flex flex-col items-center justify-center
         p-2 rounded-xl transition-all duration-200 border-[1.5px]
        ${isActive ? `${colors.bg} ${colors.border}`  : "hover:bg-gray-100"}
      `}
    >
      {/* Icon */}
      <Icon
        className={`w-6 h-6 ${isActive ? `${colors.text}` : "text-gray-400 group-hover:text-gray-600"}`}
        strokeWidth={1.5}
      />

      {/* Label */}
      {nav && (
        <span
          className={`
            mt-1 text-xs font-medium transition-colors duration-200
            ${isActive ? "text-white" : "text-gray-600"}
          `}
        >
          {item.name}
        </span>
      )}
    </button>
  );
};

export default MobileTabs;