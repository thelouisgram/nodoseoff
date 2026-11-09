import React from "react";
import { LucideIcon } from "lucide-react";
import { useAppDispatch } from "@/store";
import { setActiveTab } from "@/store/appSlice";

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
  const isActive =
    item.name === activeTab ||
    (item.name === "AMANDA 6" &&
      (activeTab === "AI" || activeTab === "AMANDA"));

  return (
    <button
      type="button"
      onClick={() => dispatch(setActiveTab(item.name))}
      className={`group flex w-full items-center justify-center rounded-xl px-1.5 py-1.5 transition-colors ${
        nav ? "lg:justify-start lg:gap-3 lg:pr-3" : ""
      } ${
        isActive
          ? "bg-soft-primary-soft text-soft-primary"
          : "text-soft-muted hover:bg-black/[0.03] hover:text-soft-ink"
      }`}
      aria-current={isActive ? "page" : undefined}
      title={!nav ? item.name : undefined}
    >
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-lg transition-colors ${
          isActive
            ? "bg-white text-soft-primary shadow-soft-sm"
            : "text-soft-muted group-hover:text-soft-ink"
        }`}
      >
        <Icon className="size-5" strokeWidth={1.75} absoluteStrokeWidth />
      </span>
      <span
        className={`min-w-0 truncate text-[14px] tracking-tight transition-all ${
          nav ? "hidden lg:inline" : "hidden"
        } ${isActive ? "font-semibold text-soft-primary" : "font-medium"}`}
      >
        {item.name}
      </span>
    </button>
  );
};

export default Tabs;
