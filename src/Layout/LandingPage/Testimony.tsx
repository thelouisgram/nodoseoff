import React from "react";
import Image from "next/image";
import Link from "next/link";

const Testimony = () => {
  return (
    <div className="bg-[#F2F7F8] w-full ">
      <div className="container w-[1100px] mx-auto flex flex-col md:flex-row gap-16 py-10 ss:py-20  items-center text-navyBlue px-4 md:px-0">
        <Image
          src="/assets/testimony.png"
          width={4000}
          height={3000}
          quality={100}
          alt="testimony"
          className="w-[500px] h-auto"
        />
        <div className="w-full flex flex-col ">
          <h2 className="text-[24px] ss:text-[30px] font-bold leading-tight mb-6 text-center md:text-left">
            Join our community of 100+ relying on us for medication compliance
            assistance
          </h2>
          <div className="flex gap-3 ss:gap-6 w-full justify-center md:justify-start">
            <Link
              href="signin"
              className="px-5 py-3 border-navyBlue border rounded-[8px] bg-transparent font-semibold text-navyBlue"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-5 py-3 bg-navyBlue rounded-[8px] font-semibold text-white"
            >
              Create new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimony;
