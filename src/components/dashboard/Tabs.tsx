"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useAppDispatch } from "@/store";
import { setActiveTab } from "@/store/appSlice";
import {
  dashboardTabLabel,
  isDashboardTabActive,
} from "@/utils/dashboard/nav";

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
  const dispatch = useAppDispatch();
  const Icon = item.icon;
  const isActive = isDashboardTabActive(item.name, activeTab);
  const label = dashboardTabLabel(item.name);

  return (
    <button
      type="button"
      onClick={() => dispatch(setActiveTab(item.name))}
      className={`ndo-press group relative flex w-full items-center justify-center rounded-2xl py-1.5 ${
        nav ? "lg:justify-start lg:gap-3 lg:pl-1.5 lg:pr-3" : ""
      } ${
        isActive
          ? "text-white"
          : "text-soft-muted hover:bg-soft-primary-soft/70 hover:text-soft-primary"
      }`}
      aria-current={isActive ? "page" : undefined}
      title={!nav ? label : undefined}
    >
      {isActive ? (
        <motion.span
          layoutId="sidebar-active"
          aria-hidden
          className="absolute inset-0 rounded-2xl bg-soft-primary"
          transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.7 }}
        />
      ) : null}

      <span className="relative z-[1] grid size-10 shrink-0 place-items-center">
        <Icon
          className="size-[19px]"
          strokeWidth={isActive ? 2 : 1.75}
          absoluteStrokeWidth
        />
      </span>

      <span
        className={`relative z-[1] min-w-0 flex-1 truncate text-left text-[14px] tracking-tight ${
          nav ? "hidden lg:inline" : "hidden"
        } ${isActive ? "font-semibold" : "font-medium"}`}
      >
        {label}
      </span>
    </button>
  );
};

export default Tabs;
