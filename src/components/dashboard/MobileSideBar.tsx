import React from "react";
import MobileTabs from "./MobileTabs";
import { tabs } from "@/utils/dashboard/dashboard";
import { LucideIcon } from "lucide-react";

interface tabsProps {
  name: string;
  icon: LucideIcon;
}

const MobileSideBar = ({ activeTab }: { activeTab: string }) => {
  return (
    <div className="flex h-full w-full items-center justify-around px-1">
      {tabs.map((item: tabsProps) => (
        <MobileTabs key={item.name} item={item} activeTab={activeTab} />
      ))}
    </div>
  );
};

export default MobileSideBar;
