"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutGroup } from "framer-motion";
import { LogOut, PanelLeftClose, PanelLeftOpen, type LucideIcon } from "lucide-react";
import { tabs } from "@/utils/dashboard/dashboard";
import Tabs from "./Tabs";

interface TabItem {
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
        className={`mb-7 flex items-center px-1.5 ${
          nav ? "justify-center lg:justify-start lg:gap-2" : "justify-center"
        }`}
      >
        {/* Mark — tablet icon rail (md–lg) */}
        <Link href="/" className="flex shrink-0 lg:hidden">
          <Image
            src="/assets/logo/logo-blue.png"
            alt="NoDoseOff"
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
          className="hidden size-10 shrink-0 place-items-center rounded-xl text-soft-muted transition hover:bg-black/[0.04] hover:text-soft-primary lg:grid"
          aria-label={nav ? "Collapse sidebar" : "Expand sidebar"}
        >
          {nav ? (
            <PanelLeftClose className="size-5" strokeWidth={1.75} absoluteStrokeWidth />
          ) : (
            <PanelLeftOpen className="size-5" strokeWidth={1.75} absoluteStrokeWidth />
          )}
        </button>

        {/* Wordmark — expanded desktop */}
        <Link
          href="/"
          className={`hidden overflow-hidden transition-all duration-300 lg:block ${
            nav ? "w-[132px] opacity-100" : "w-0 opacity-0"
          }`}
        >
          <Image
            src="/assets/logo/logo-with-name-blue.png"
            alt="NoDoseOff"
            width={1084}
            height={257}
            className="h-auto w-[132px]"
            quality={100}
            priority
          />
        </Link>
      </div>

      <LayoutGroup id="desktop-rail">
        <nav className="flex flex-1 flex-col gap-1.5" aria-label="Main">
          {tabs.map((item: TabItem) => (
            <Tabs key={item.name} item={item} activeTab={activeTab} nav={nav} />
          ))}
        </nav>
      </LayoutGroup>

      <div className="mt-auto border-t border-black/[0.05] pt-3">
        <button
          type="button"
          onClick={handleSignOut}
          className={`group flex w-full items-center justify-center rounded-2xl px-1.5 py-1.5 text-soft-muted transition-colors hover:bg-soft-pink hover:text-soft-pink-ink ${
            nav ? "lg:justify-start lg:gap-3 lg:pr-3" : ""
          }`}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl">
            <LogOut className="size-[19px]" strokeWidth={1.75} absoluteStrokeWidth />
          </span>
          <span
            className={`whitespace-nowrap text-[14px] font-medium transition-all ${
              nav ? "hidden lg:inline" : "hidden"
            }`}
          >
            Log out
          </span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
