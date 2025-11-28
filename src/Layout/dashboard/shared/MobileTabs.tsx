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
}

const MobileTabs: React.FC<TabsProps> = ({ item, active }) => {
  const dispatch = useDispatch();
  const Icon = item.icon;
  const isActive = active === item.name;

  return (
    <div
      onClick={() => dispatch(updateActive(item.name))}
      className="flex items-center flex-col cursor-pointer w-full h-full justify-center relative font-Inter px-6"
    >
      <Icon
        className={`w-6 h-6 transition-all text-[#062863] ${
          isActive ? "fill-[#062863] stroke-[#062863]" : ""
        }`}
        strokeWidth={isActive ? 1 : 2}
      />
      <h2
        className={`text-[12px] text-[#062863] ${
          isActive
            ? "font-semibold "
            : "font-normal "
        }`}
      >
        {item.name}
      </h2>
    </div>
  );
};

export default MobileTabs;
