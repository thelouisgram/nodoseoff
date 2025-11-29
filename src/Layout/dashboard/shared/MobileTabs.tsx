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
  nav?: boolean; // optional, show label
}

const MobileTabs: React.FC<TabsProps> = ({ item, active, nav }) => {
  const dispatch = useDispatch();
  const Icon = item.icon;
  const isActive = active === item.name;

  // Single blue color for all tabs
  const colors = {
    bg: "bg-blue-100",
    border: "border-blue-500",
    icon: "text-blue-600",
    text: "text-blue-600",
  };

  return (
    <button
      onClick={() => dispatch(updateActive(item.name))}
      className="relative flex flex-col items-center justify-center cursor-pointer transition-all duration-200 font-Inter w-full group"
    >
      {/* Optional top indicator line */}
      <div
        className={`
          absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-b-full
          transition-all duration-200
          ${isActive ? `w-10 ${colors.icon}` : "w-0 bg-transparent"}
        `}
      />

      {/* Icon with circular background */}
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
            w-5 h-5 transition-colors duration-200
            ${isActive ? colors.icon : "text-gray-400 group-hover:text-gray-600"}
          `}
          strokeWidth={2}
        />
      </div>

      {/* Optional label below icon */}
      {nav && (
        <span
          className={`
            text-[12px] mt-1 transition-colors duration-200
            ${isActive ? colors.text : "text-gray-500 group-hover:text-gray-700"}
          `}
        >
          {item.name}
        </span>
      )}
    </button>
  );
};

export default MobileTabs;
