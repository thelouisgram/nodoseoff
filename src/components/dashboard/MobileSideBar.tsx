"use client";

import { LayoutGroup } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { tabs } from "@/utils/dashboard/dashboard";
import MobileTabs from "./MobileTabs";

interface TabItem {
  name: string;
  icon: LucideIcon;
}

const MobileSideBar = ({ activeTab }: { activeTab: string }) => {
  return (
    <LayoutGroup id="mobile-dock">
      <nav
        className="flex h-full w-full items-stretch gap-0.5 px-1"
        aria-label="Main"
      >
        {tabs.map((item: TabItem) => (
          <MobileTabs key={item.name} item={item} activeTab={activeTab} />
        ))}
      </nav>
    </LayoutGroup>
  );
};

export default MobileSideBar;
