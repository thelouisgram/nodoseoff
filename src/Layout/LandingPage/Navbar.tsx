"use client";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  return (
    <nav className="w-full h-[80px] flex justify-between items-center relative">
      <Image
        src="/assets/pill perfect png.png"
        alt="logo"
        width={4672}
        height={1920}
        quality={100}
        className="w-[120px] ss:w-[200px] h-auto"
      />
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
          href="/signin"
          className="hidden ss:flex px-5 py-3 border-navyBlue border rounded-[8px] bg-transparent font-semibold text-navyBlue"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="hidden ss:flex px-5 py-3 bg-navyBlue rounded-[8px] font-semibold text-white"
        >
          Create new account
        </Link>
      </div>
      <div
        className={`w-full bg-[#F2F7F8] rounded-xl  border border-navyBlue ${
          nav ? "top-20" : "-top-[160px]"
        } transitions-all 
      duration-300 p-6 absolute  flex-col flex gap-3 `}
      >
        <Link
          href="/signin"
          className="px-5 py-3 border-navyBlue border rounded-[8px] text-center bg-transparent font-semibold text-navyBlue"
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
  );
};

export default Navbar;
