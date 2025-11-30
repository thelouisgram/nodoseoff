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
  nav: boolean;
}

const Tabs: React.FC<TabsProps> = ({ item, active, nav }) => {
  const dispatch = useDispatch();
  const Icon = item.icon;
  const isActive = item.name === active;

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
          bg: "bg-gray-100",
          border: "border-gray-500",
          icon: "text-gray-600",
          text: "text-gray-600",
        };
    }
  };

  const colors = getColors(item.name);

  return (
    <button
      onClick={() => dispatch(updateActive(item.name))}
      className="flex items-center lg:gap-3 cursor-pointer transition-all font-Inter w-full group"
    >
      {/* Icon with border */}
      <div
        className={`
          rounded-lg p-2 transition-all duration-200 border-2
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
          strokeWidth={2}
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