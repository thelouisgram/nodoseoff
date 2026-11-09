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
}

const MobileTabs: React.FC<TabsProps> = ({ item, activeTab }) => {
  const dispatch = useAppDispatch();
  const Icon = item.icon;
  const isActive =
    activeTab === item.name ||
    (item.name === "AMANDA 6" &&
      (activeTab === "AI" || activeTab === "AMANDA"));

  return (
    <button
      type="button"
      onClick={() => dispatch(setActiveTab(item.name))}
      className={`flex min-w-[64px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 transition-colors ${
        isActive ? "text-soft-primary" : "text-soft-muted"
      }`}
      aria-current={isActive ? "page" : undefined}
      aria-label={item.name}
    >
      <span
        className={`grid size-9 place-items-center rounded-lg transition-colors ${
          isActive ? "bg-soft-primary-soft text-soft-primary" : ""
        }`}
      >
        <Icon className="size-5" strokeWidth={1.75} absoluteStrokeWidth />
      </span>
      <span
        className={`text-[10px] tracking-tight ss:text-[11px] ${
          isActive ? "font-semibold" : "font-medium"
        }`}
      >
        {item.name === "AMANDA 6" ? "A6" : item.name}
      </span>
    </button>
  );
};

export default MobileTabs;
