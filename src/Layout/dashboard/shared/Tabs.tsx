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

  return (
    <button
      onClick={() => dispatch(updateActive(item.name))}
      className={`
        flex items-center lg:gap-3 cursor-pointer h-10 w-10 lg:w-auto
        max-lg:justify-center transition-all font-Inter rounded-full
      `}
    >
      <Icon
        className={`w-6 h-6 transition-all ${
          isActive ? "fill-white stroke-white" : "stroke-white"
        }`}
        strokeWidth={isActive ? 1 : 2}
      />

      <span
        className={`
          text-[16px] rounded-md py-1 px-3
          ${nav ? "hidden lg:flex" : "hidden"}
          ${
            isActive
              ? "bg-white text-[#062863] font-medium"
              : "text-white"
          }
        `}
      >
        {item.name}
      </span>
    </button>
  );
};

export default Tabs;