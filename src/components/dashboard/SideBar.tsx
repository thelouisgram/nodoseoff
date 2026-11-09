import React from "react";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { tabs } from "@/utils/dashboard/dashboard";
import Tabs from "./Tabs";

interface tabsProps {
  name: string;
  icon: LucideIcon;
}

interface SideBarProps {
  activeTab: string;
  handleSignOut: () => void;
  nav: boolean;
  setNav: (value: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({
  activeTab,
  handleSignOut,
  nav,
  setNav,
}) => {
  return (
    <div className="flex h-full flex-col">
      <div
        className={`mb-6 flex items-center justify-center px-1.5 ${
          nav ? "lg:justify-start lg:gap-2" : ""
        }`}
      >
        <Link href="/" className="flex shrink-0 lg:hidden">
          <Image
            src="/assets/logo/logo-blue.png"
            alt="NoDoseOff logo"
            width={205}
            height={212}
            className="h-7 w-auto"
            quality={100}
            priority
          />
        </Link>

        <button
          type="button"
          onClick={() => setNav(!nav)}
          className="hidden size-10 shrink-0 place-items-center rounded-lg text-soft-muted transition hover:bg-black/[0.04] hover:text-soft-primary lg:grid"
          aria-label={nav ? "Collapse sidebar" : "Expand sidebar"}
        >
          {nav ? (
            <PanelLeftClose className="size-5" strokeWidth={1.75} absoluteStrokeWidth />
          ) : (
            <PanelLeftOpen className="size-5" strokeWidth={1.75} absoluteStrokeWidth />
          )}
        </button>

        <Link
          href="/"
          className={`hidden overflow-hidden transition-all duration-300 lg:block ${
            nav ? "w-[148px] opacity-100" : "w-0 opacity-0"
          }`}
        >
          <Image
            src="/assets/logo/logo-with-name-blue.png"
            alt="NoDoseOff logo"
            width={1084}
            height={257}
            className="h-auto w-[148px]"
            quality={100}
            priority
          />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
        {tabs.map((item: tabsProps) => (
          <Tabs key={item.name} item={item} activeTab={activeTab} nav={nav} />
        ))}
      </nav>

      <button
        type="button"
        onClick={handleSignOut}
        className={`group mt-auto flex w-full items-center justify-center rounded-xl px-1.5 py-1.5 text-soft-muted transition-colors hover:bg-soft-pink hover:text-soft-pink-ink ${
          nav ? "lg:justify-start lg:gap-3 lg:pr-3" : ""
        }`}
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-lg">
          <LogOut className="size-5" strokeWidth={1.75} absoluteStrokeWidth />
        </span>
        <span
          className={`whitespace-nowrap text-[14px] font-medium transition-all ${
            nav ? "hidden lg:inline" : "hidden"
          }`}
        >
          Logout
        </span>
      </button>
    </div>
  );
};

export default SideBar;
