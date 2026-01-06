import React, { useState } from "react";
import { LogOut, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { tabs } from "@/utils/dashboard/dashboard";
import Tabs from "./Tabs";
import { motion } from "framer-motion";

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
  const renderedTabs = tabs.map((item: tabsProps, index: number) => (
    <div key={index}>
      <Tabs item={item} activeTab={activeTab} nav={nav} />
    </div>
  ));

  return (
    <>
      {/* Top Section */}
      <div>
        <div className="flex items-center gap-5 mb-12 h-[60.81px]">
          {/* Small screen logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="flex lg:hidden">
              <Image
                src="/assets/logo/logo-blue.png"
                alt="logo"
                width={1084}
                height={257}
                className="w-8 h-auto block dark:hidden"
                quality={100}
              />
              <Image
                src="/assets/logo/logo-white.png"
                alt="logo"
                width={1084}
                height={257}
                className="w-8 h-auto hidden dark:block"
                quality={100}
              />
            </Link>
          </motion.div>

          {/* Menu button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setNav(!nav)}
          >
            <Menu className="text-navyBlue dark:text-slate-200 size-6 -ml-4 hidden lg:flex" />
          </motion.button>

          {/* Large screen logo */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/"
              className={`overflow-hidden transition-all duration-300 hidden lg:flex ${
                nav ? "w-[140px]" : "w-0"
              }`}
            >
              <Image
                src="/assets/logo/logo-with-name-blue.png"
                alt="logo"
                width={1084}
                height={257}
                className="h-auto block dark:hidden"
                quality={100}
              />
              <Image
                src="/assets/logo/logo-with-name-white.png"
                alt="logo"
                width={1084}
                height={257}
                className="h-auto hidden dark:block"
                quality={100}
              />
            </Link>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col gap-6">{renderedTabs}</div>
      </div>

      {/* Sign Out Button */}
      <motion.button
        whileHover={{ x: 4 }}
        onClick={handleSignOut}
        className="flex items-center gap-4 font-Inter transition-all duration-300 text-navyBlue dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 justify-start"
      >
        <LogOut className=" size-6" />
        <span
          className={` overflow-hidden transition-all duration-300 ${
            nav ? " opacity-100 hidden lg:flex" : "w-0 hidden opacity-0"
          }`}
        >
          Logout
        </span>
      </motion.button>
    </>
  );
};

export default SideBar;
