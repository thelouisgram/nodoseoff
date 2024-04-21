import React from 'react'
import Image from "next/image";
import Link from 'next/link'
import { links, scrollToSection } from '../../../utils/landingpage';

interface MobileNavBarProps {
  nav: boolean;
  setNav: Function;
  showLinks: boolean;
}

const MobileNavBar:React.FC<MobileNavBarProps> = ({nav, setNav, showLinks}) => {
  const renderedLinks = links?.map((link, index) => (
    <button
      onClick={() => {
        setNav(false);
        scrollToSection(link.id);
      }}
      key={index}
    >
      {link.title}
    </button>
  ));
  return (
    <div
      className={`w-full ${
        nav ? "top-0 z-[15]" : "-top-[100dvh]"
      } transitions-all 
            duration-300 p-6 fixed flex-col flex gap-3 h-[100dvh] bg-white font-Inter`}
    >
      <div className="w-full flex justify-end mb-10 p-2">
        <button onClick={() => setNav(false)}>
          <Image src="/assets/x (1).png" alt="cancel" width={24} height={24} />
        </button>
      </div>
      {showLinks && <div className="flex flex-col gap-4 items-center mb-10">
        {renderedLinks}
      </div> }
      <div className="w-full items-center flex flex-col gap-3">
        <Link
          href="/login"
          className="px-5 py-3 w-60 border-navyBlue border rounded-[10px] text-center bg-transparent font-semibold text-navyBlue"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="px-5 py-3 w-60 bg-navyBlue rounded-[8px] text-center font-semibold text-white"
        >
          Create new account
        </Link>
      </div>
    </div>
  );
}

export default MobileNavBar
