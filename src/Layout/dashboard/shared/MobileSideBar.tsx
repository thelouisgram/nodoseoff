import React from "react";
import MobileTabs from "./MobileTabs";
import { tabs } from "../../../../utils/dashboard/dashboard";
import { LucideIcon } from "lucide-react";

interface tabsProps {
  name: string;
  icon: LucideIcon;
}

const MobileSideBar = ({ active }: { active: string }) => {
  const renderedTabs = tabs.map((item: tabsProps, index: number) => (
    <div key={index}>
      <MobileTabs item={item} active={active} />
    </div>
  ));
  return <div className="flex justify-between w-full h-full px-3 items-center">{renderedTabs}</div>;
};

export default MobileSideBar;
