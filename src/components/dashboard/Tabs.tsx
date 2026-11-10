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
      className={`group relative flex w-full items-center justify-center rounded-2xl px-1.5 py-1.5 transition-colors ${
        nav ? "lg:justify-start lg:gap-3 lg:pr-3" : ""
      } ${
        isActive
          ? "text-soft-primary"
          : "text-soft-muted hover:bg-black/[0.03] hover:text-soft-ink"
      }`}
      aria-current={isActive ? "page" : undefined}
      title={!nav ? label : undefined}
    >
      {isActive ? (
        <motion.span
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-2xl bg-soft-primary-soft"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      ) : null}

      <span
        className={`relative z-[1] grid size-10 shrink-0 place-items-center rounded-xl transition-colors ${
          isActive
            ? "bg-white text-soft-primary shadow-soft-sm"
            : "text-soft-muted group-hover:text-soft-ink"
        }`}
      >
        <Icon className="size-[19px]" strokeWidth={1.75} absoluteStrokeWidth />
      </span>

      <span
        className={`relative z-[1] min-w-0 truncate text-[14px] tracking-tight transition-all ${
          nav ? "hidden lg:inline" : "hidden"
        } ${isActive ? "font-semibold text-soft-primary" : "font-medium"}`}
      >
        {label}
      </span>
    </button>
  );
};

export default Tabs;
