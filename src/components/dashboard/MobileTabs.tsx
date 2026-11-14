"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useAppDispatch } from "@/store";
import { setActiveTab } from "@/store/appSlice";
import {
  dashboardTabLabel,
  isDashboardTabActive,
} from "@/utils/dashboard/nav";
import AmandaMark from "@/Layout/marketing/AmandaMark";

interface TabItem {
  name: string;
  icon: LucideIcon;
}

interface TabsProps {
  item: TabItem;
  activeTab: string;
}

const MobileTabs: React.FC<TabsProps> = ({ item, activeTab }) => {
  const dispatch = useAppDispatch();
  const Icon = item.icon;
  const isActive = isDashboardTabActive(item.name, activeTab);
  const label = dashboardTabLabel(item.name);
  const isAmanda = item.name === "AMANDA 6";

  return (
    <button
      type="button"
      onClick={() => dispatch(setActiveTab(item.name))}
      className={`ndo-press group relative flex min-h-[52px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 ${
        isActive ? "text-soft-primary" : "text-soft-muted hover:text-soft-ink"
      }`}
      aria-current={isActive ? "page" : undefined}
      aria-label={label}
    >
      <span
        className={`relative z-[1] grid size-9 place-items-center rounded-xl transition-colors ${
          isActive ? "text-white" : "group-hover:bg-soft-primary-soft/70"
        }`}
      >
        {isActive ? (
          <motion.span
            layoutId="mobile-nav-active"
            aria-hidden
            className="absolute inset-0 rounded-xl bg-soft-primary"
            transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.7 }}
          />
        ) : null}
        {isAmanda ? (
          <AmandaMark
            compact
            className="relative z-[1] size-[22px] [&_svg]:rounded-md [&_svg]:shadow-none"
            onDark={isActive}
          />
        ) : (
          <Icon
            className="relative z-[1] size-[20px]"
            strokeWidth={isActive ? 2 : 1.75}
            absoluteStrokeWidth
          />
        )}
      </span>
      <span
        className={`relative z-[1] text-[11px] leading-none tracking-tight ${
          isActive ? "font-semibold" : "font-medium group-hover:font-semibold"
        }`}
      >
        {label}
      </span>
    </button>
  );
};

export default MobileTabs;
