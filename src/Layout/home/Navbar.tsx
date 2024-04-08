"use client";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { links } from "../../../utils/landingpage";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const renderedLinks = links?.map((link, index) => (
    <Link href={link.link} key={index}>
      {link.title}
    </Link>
  ));
  return (
    <section className="w-full bg-lightBlue">
      <nav className="container md:w-[1165px] lg:w-[1165px] mx-auto px-4 md:px-0 w-full h-[80px] flex justify-between items-center relative text-[14px] ">
        <div className="flex items-center gap-20">
          <Image
            src="/assets/logo/logo with name - blue color.png"
            width={3912}
            height={1000}
            alt="logo"
            priority
            className="w-[100px] ss:w-[160px] h-auto"
          />
          <div className="flex gap-8 font-semibold text-[16px]">
            {renderedLinks}
          </div>
        </div>
        <div className="flex gap-6">
          <Image
            src="/assets/menu.png"
            width="24"
            height={24}
            alt="menu"
            className="flex ss:hidden"
            onClick={() => {
              setNav((prev) => !prev);
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
        <div
          className={`w-full bg-[#F2F7F8] rounded-xl  border border-navyBlue ${
            nav ? "top-20" : "-top-[160px]"
          } transitions-all 
      duration-300 p-6 absolute  flex-col flex gap-3 `}
        >
          <Link
            href="/login"
            className="px-5 py-3 border-navyBlue border rounded-[10px] text-center bg-transparent font-semibold text-navyBlue"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-5 py-3 bg-navyBlue rounded-[8px] text-center font-semibold text-white"
          >
            Create new account
          </Link>
        </div>
      </nav>
    </section>
  );
};

export default Navbar;
