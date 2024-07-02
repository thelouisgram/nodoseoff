import React from "react";
import Image from "next/image";
import { FaInstagram, FaRegCopyright, FaTwitter } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="w-full bg-lightBlue">
      <div className="container md:w-[1165px] lg:w-[1165px] py-24 mx-auto px-4 xs:px-1 ss:px-5 md:px-0 flex flex-col gap-14">
        <div className="w-full flex flex-col md:flex-row justify-between">
          <div className="px-4 ss:px-20 md:px-0 flex flex-col md:flex-row gap-12 md:gap-48 w-full">
            <div className="w-full flex justify-start ">
              <Link href="/" className="w-[160px] ">
                <Image
                  src="/assets/logo/logo with name - blue color.png"
                  width={1062}
                  height={212}
                  alt="logo"
                  priority
                  className="w-full h-auto"
                />
              </Link>
            </div>
            <div className=" grid grid-cols-2 md:grid-cols-3 gap-16 md:gap-48 mb-16 md:mb-0 ">
              <div className="flex flex-col gap-3">
                <h2 className="font-[500] text-[18px]">Pages</h2>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/about">About</Link>
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="font-[500] text-[18px]">Company</h2>
                <p>FAQs</p>
                <p>Blog</p>
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="font-[500] text-[18px]">Legal</h2>
                <p>Terms</p>
                <p>Privacy</p>
              </div>
            </div>
          </div>
          <div className="px-4 ss:px-20 md:px-0 flex flex-col gap-4 w-full justify-start md:justify-end">
            <div className="flex gap-6 w-full justify-start md:justify-end">
              <Link href="https://www.instagram.com/nodoseoff">
                <FaInstagram className="text-[28px]" />
              </Link>
            </div>
            <h3 className="text-left md:text-right">Abuja, Nigeria</h3>
            <h3 className="text-left md:text-right">nodoseoff@gmail.com</h3>
            <h3 className="text-left md:text-right">+234 816 450 2181</h3>
          </div>
        </div>
        <div className="w-full flex justify-center items-center gap-1">
          <FaRegCopyright />
          Copyright NoDoseOff 2024
        </div>
      </div>
    </div>
  );
};

export default Footer;
