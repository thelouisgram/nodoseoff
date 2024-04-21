import Calendar from "./features/Calendar";
import Summary from "./features/Summary";
import Tracker from "./features/tracker";

const Features = () => {
  return (
    <div id='features' className="bg-white py-24 font-Inter">
      <div className="container md:w-[1165px] lg:w-[1165px] mx-auto px-4 xs:px-1 ss:px-5 md:px-0 w-full grid ss:grid-cols-2 gap-5">
        <div className="px-6 py-10 md:py-12 bg-[#EFF4F5] flex flex-col md:flex-row justify-between rounded-[16px] w-full gap-8">
          <div className="flex flex-col text-grey md:w-[325px] gap-2 md:pt-14">
            <h2 className="font-bold leading-none text-[18px]">
              Medication Calendar and Report
            </h2>
            <p className="text-[16px] leading-tight font-[500]">
              Track your meds with our responsive calendar and get daily reports
              for updates.
            </p>
          </div>
          <div className="relative w-full">
            <Calendar />
          </div>
        </div>
        <div className="px-6 py-10 md:py-12 bg-lightPink flex flex-col md:flex-row justify-between rounded-[16px] w-full gap-8">
          <div className="flex flex-col text-grey md:w-[325px] gap-2 md:pt-14">
            <h2 className="font-bold leading-none text-[18px]">
              Medication Tracker
            </h2>
            <p className="text-[16px] leading-tight font-[500]">
              Easily mark off today&apos;s taken meds and never miss a dose.
            </p>
          </div>
          <div className="relative w-full h-full flex items-start justify-center">
            <Tracker />
          </div>
        </div>
        <div className="px-6 py-10 md:py-12 bg-lightPurple flex flex-col md:flex-row justify-between rounded-[16px] w-full gap-8">
          <div className="flex flex-col text-grey md:w-[325px] gap-2 h-auto md:pt-14">
            <h2 className="font-bold leading-none text-[18px]">
              Access your Drug History Report
            </h2>
            <p className="text-[16px] leading-tight font-[500]">
              Share your drug history report with your physician easily.
            </p>
          </div>
          <Summary />
        </div>
      </div>
    </div>
  );
};

export default Features;
