import Image from "next/image";
import Link from "next/link";
import React from "react";

const HeroSection = () => {
  return (
    <section className="flex flex-col md:flex-row gap-20 justify-between items-center pt-[100px] pb-[50px] md:pb-[100px] w-full ">
      <div className="text-navyBlue ss:w-[450px] flex flex-col justify-center text-center md:text-left">
        <h1 className="text-[40px] font-bold leading-tight mb-8 ">
          Revolutionizing Drug Monitoring
        </h1>
        <p className="ss:w-[400px] mb-8 leading-normal tracking-wide text-[18px]">
          Pillperfect streamlines medication tracking for millions, ensuring
          seamless monitoring and control.
        </p>
        <div className="w-full justify-center">
          <Link
            href="/signup"
            className="px-5 py-3 w-[100px] bg-navyBlue rounded-[8px] font-semibold text-white"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="relative robot">
        <Image
          src="/assets/hero-image.png"
          width={400}
          height={400}
          quality={100}
          alt="hero-image"
          className="w-[300px] ss:w-[500px] h-auto"
        />
        <div
          className="bg-white rounded-[10px] px-2 ss:px-3 py-2 flex justify-between w-[165px] ss:w-[250px] absolute top-[60px] ss:top-[100px]
         -left-[20px] ss:left-[-60px]"
        >
          <div>
            <h2 className="font-semibold text-[10px] ss:text-[16px]">
              Tracking
            </h2>
            <p className="text-[8px] ss:text-[12px]">365days dose tracking.</p>
          </div>
          <div className="p-1 ss:p-2  bg-[#FCC41912] rounded-[4px] h-[26px] ss:h-[40px]">
            <Image
              width="50"
              height="50"
              quality={100}
              src="/assets/icons8-today-50.png"
              alt="appointment-reminders--v1"
              className="w-[18px] h-[18px] ss:w-[24px] ss:h-[24px]"
            />
          </div>
        </div>
        <div className="bg-white rounded-[10px] px-2 ss:px-3 py-2 flex justify-between w-[165px] ss:w-[250px] absolute top-[200px] ss:top-[320px] left-[-40px]">
          <div>
            <h2 className="font-semibold text-[10px] ss:text-[16px]">
              Reports
            </h2>
            <p className="text-[8px] ss:text-[12px]">
              Generate and share reports.
            </p>
          </div>
          <div className="p-1 ss:p-2  bg-[#FA525233] rounded-[4px] h-[26px] ss:h-[40px]">
            <Image
              width="50"
              height="50"
              quality={100}
              src="/assets/icons8-line-chart-50.png"
              alt="reports"
              className="w-[18px] h-[18px] ss:w-[24px] ss:h-[24px]"
            />
          </div>
        </div>
        <div className="bg-white rounded-[10px] px-2 ss:px-3 py-2 flex justify-between w-[165px] ss:w-[250px] absolute top-[130px] ss:top-[220px] right-[-40px]">
          <div className="mr-1">
            <h2 className="font-semibold text-[10px] ss:text-[16px]">
              Add Reminders
            </h2>
            <p className="text-[8px] ss:text-[12px]">
              Customize reminders for you.
            </p>
          </div>
          <div className="p-1 ss:p-2  bg-[#CC5DE840] rounded-[4px] h-[26px] ss:h-[40px]">
            <Image
              width="50"
              height="50"
              quality={100}
              src="/assets/icons8-alarm-add-50.png"
              alt="reminder"
              className="w-[18px] h-[18px] ss:w-[24px] ss:h-[24px]"
            />
          </div>
        </div>
        <div className="bg-white rounded-[10px] px-2 ss:px-3 py-2 flex justify-between w-[165px] ss:w-[250px] absolute bottom-[-10px] right-[80px] ss:right-[140px]">
          <div className="mr-1">
            <h2 className="font-semibold text-[10px] ss:text-[16px]">
              Add Drugs
            </h2>
            <p className="text-[8px] ss:text-[12px]">
              Update your regimen anytime.
            </p>
          </div>
          <div className="p-1 ss:p-2 bg-[#7BD82D36] rounded-[4px] h-[26px] ss:h-[40px]">
            <Image
              width="50"
              height="50"
              quality={100}
              src="/assets/icons8-drugs-50.png"
              alt="drugs"
              className="w-[18px] h-[18px] ss:w-[24px] ss:h-[24px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
