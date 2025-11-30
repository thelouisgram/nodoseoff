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

  return (
    <button
      onClick={() => dispatch(updateActive(item.name))}
      className={`
        relative flex flex-col items-center justify-center
         p-2 rounded-full transition-all duration-200
        ${isActive ? "bg-blue-600" : "hover:bg-gray-100"}
      `}
    >
      {/* Icon */}
      <Icon
        className={`w-6 h-6 ${isActive ? "text-white" : "text-gray-600"}`}
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

      {/* Active indicator dot (optional) */}
      {isActive && !nav && (
        <span className="absolute -bottom-2 w-1 h-1 rounded-full bg-blue-600" />
      )}
    </button>
  );
};

export default MobileTabs;