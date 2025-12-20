import React, { useState } from 'react';
import { LogOut, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { tabs } from '../../../../utils/dashboard/dashboard';
import Tabs from './Tabs';

interface tabsProps {
  name: string;
  icon: LucideIcon;
}

interface SideBarProps {
  activeTab: string;
  handleSignOut: () => void;
  nav: boolean
  setNav: (value:boolean) => void
}

const SideBar: React.FC<SideBarProps> = ({ activeTab, handleSignOut, nav, setNav}) => {

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
          <Link href="/" className="flex lg:hidden">
            <Image
              src="/assets/logo/logo-blue.png"
              alt="logo"
              width={1084}
              height={257}
              className="w-8 h-auto"
              quality={100}
            />
          </Link>

          {/* Menu button */}
          <button onClick={() => setNav(!nav)}>
            <Menu className="text-navyBlue size-6 hidden lg:flex" />
          </button>

          {/* Large screen logo */}
          <Link
            href="/"
            className={`overflow-hidden transition-all duration-300 hidden lg:flex ${
              nav ? 'w-[140px] ml-4' : 'w-0'
            }`}
          >
            <Image
              src="/assets/logo/logo-with-name-blue.png"
              alt="logo"
              width={1084}
              height={257}
              className="h-auto"
              quality={100}
            />
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex flex-col gap-6">
          {renderedTabs}
        </div>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut} // Fixed
        className="flex items-center gap-4 font-Inter transition-all duration-300 text-navyBlue justify-start"
      >
        <LogOut className=" size-6" />
        <span
          className={` overflow-hidden transition-all duration-300 ${
            nav ? ' opacity-100 hidden lg:flex' : 'w-0 hidden opacity-0'
          }`}
        >
          Logout
        </span>
      </button>
    </>
  );
};

export default SideBar;
