"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { links, scrollToSection } from "../../../utils/landingpage";

interface navProps {
  nav: boolean;
  setNav: Function;
  isScrolled: boolean;
  showLinks: boolean;
}

const Navbar: React.FC<navProps> = ({ isScrolled, setNav, showLinks }) => {
  const renderedLinks = links?.map((link, index) => (
    <button key={index} onClick={() => scrollToSection(link.id)}>
      {link.title}
    </button>
  ));

  return (
    <section
      className={`${
        isScrolled ? "shadow-md fixed" : ""
      } w-full bg-lightBlue top-0 z-[14] fixed`}
    >
      <nav
        className="container md:w-[1165px] lg:w-[1165px] mx-auto px-4 ss:px-5 md:px-0 w-full h-[80px] flex justify-between items-center relative 
      text-[14px] "
      >
        <div className="flex items-center gap-20">
          <Link href="/">
            <Image
              src="/assets/logo/logo with name - blue color.png"
              width={1062}
              height={212}
              alt="logo"
              priority
              className="w-[160px] h-auto"
            />
          </Link>
          {showLinks && (
            <div className="gap-8 font-semibold text-[16px] hidden md:flex">
              {renderedLinks}
            </div>
          )}
        </div>
        <div className="flex gap-6 font-Inter">
          <Image
            src="/assets/burger-menu.png"
            width="512"
            height="512"
            alt="menu"
            className="flex ss:hidden w-8 h-auto"
            onClick={() => {
              setNav(true);
            }}
          />
          <Link
            href="/login"
            className="hidden ss:flex px-5 py-3 border border-navyBlue rounded-[10px] font-semibold text-navyBlue text-[16px]"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="hidden ss:flex px-5 py-3 bg-navyBlue rounded-[10px] font-semibold text-white text-[16px]"
          >
            Create an Account
          </Link>
        </div>
      </nav>
    </section>
  );
};

export default Navbar;
