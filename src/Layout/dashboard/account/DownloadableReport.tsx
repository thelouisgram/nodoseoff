import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { RootState } from "../../../../store";
import { useSelector } from "react-redux";
import Image from "next/image";
import { toast } from "sonner";
import { DrugProps } from "../../../../types/dashboard";

const DownloadableReport: React.FC = () => {
  const { drugs, schedule, info, allergies, completedDrugs } = useSelector(
    (state: RootState) => state.app
  );

  const { name, phone, email, otcDrugs, herbs } = info[0];
  const currentDrugs = drugs.map((drug) => drug.drug);
  const allergicDrugs = allergies.map((drug) => drug?.drug);

  function filterRecentDrugs(completedDrugs: DrugProps[]) {
    // Calculate the date 6 months ago
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Filter the list for drugs that ended within the last 6 months
    const recentDrugs = completedDrugs.filter((drug) => {
      const endDate = new Date(drug.end);
      return endDate >= sixMonthsAgo;
    });

    return recentDrugs;
  }

  // Filter recent drugs and map to get the drug names
  const filteredDrugNames = filterRecentDrugs(completedDrugs).map(
    (drug) => drug.drug
  );

  // Use a Set to eliminate duplicates and then convert it back to an array
  const recentDrugs = Array.from(new Set(filteredDrugNames));

  const currentTime = new Date(); // Get the current date and time

  const completedBeforeCurrentTime = schedule.filter((dose) => {
    const doseDateTime = new Date(`${dose?.date}T${dose?.time}`);
    return doseDateTime <= currentTime && dose?.completed;
  });

  const totalBeforeCurrentTime = schedule.filter((dose) => {
    const doseDateTime = new Date(`${dose?.date}T${dose?.time}`);
    return doseDateTime <= currentTime;
  });

  const missedDoses =
    totalBeforeCurrentTime.length - completedBeforeCurrentTime.length;

  let percentageCompleted = 0;

  if (totalBeforeCurrentTime.length > 0) {
    percentageCompleted =
      (completedBeforeCurrentTime.length / totalBeforeCurrentTime.length) * 100;
  }

  const imageRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!imageRef.current) return;

    html2canvas(imageRef.current).then((canvas: HTMLCanvasElement) => {
      const link = document.createElement("a");
      link.download = `${name}_reports.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
    toast.loading("Downloading Report");
  };

  return (
    <div className="flex flex-col items-start w-full font-Inter">
      <button
        onClick={handleDownload}
        className="mb-6 px-4 py-3 flex gap-2 items-center text-navyBlue  rounded-md border-navyBlue border"
      >
        Download Report
        <Image
          src="/assets/download.png"
          width={512}
          height={512}
          alt="download"
          quality={100}
          className="w-[20px] h-auto"
        />
      </button>
      <div className="w-full h-auto border border-navyBlue">
        <div ref={imageRef} className="relative w-full h-auto">
          <Image
            src="/assets/image.png"
            width={1074}
            height={1417}
            alt="image"
          />
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-start items-start text-[8px] ss:text-[14px] md:text-[16px] px-2 md:px-6">
            <div className="w-full flex justify-center pt-2 ss:pt-6">
              <Image
                src="/assets/logo/logo with name - blue color.png"
                alt="logo"
                width={1084}
                height={257}
                className={`w-[100px] h-[19.95px] ss:w-[150px] ss:h-[29.94px] md:w-[200px] md:h-auto hidden md:flex`}
                quality={100}
              />
              <div className="w-full justify-center text-center font-bold text-[14px] ss:text-[24px] flex md:hidden ">
                NoDoseOff
              </div>
            </div>
            <div className="w-full flex justify-center text-center font-[500] text-[8px] ss:text-[18px] uppercase ">
              Drug History Report
            </div>
            <div className="py-1 ss:py-3 md:py-6 px-3 ss:px-6 border-navyBlue w-full">
              <h2 className="font-semibold text-grey mb-1 ss:mb-2 md:mb-4 text-[8px] ss:text-[16px]">
                Patient&apos;s Information
              </h2>
              <div className="border border-navyBlue mb-2 ss:mb-4 md:mb-10 w-full text-[8px] ss:text-[14px] md:text-[16px]">
                <div className="flex items-center gap-2 border-b border-navyBlue w-full capitalize">
                  <div className="w-[100px] ss:w-[150px] py-1 md:py-3 px-2 bg-lightBlue border-r border-navyBlue font-semibold">
                    Name:
                  </div>
                  <h4>{name}</h4>
                </div>
                <div className="flex items-center gap-2 border-b border-navyBlue">
                  <div className="w-[100px] ss:w-[150px] py-1 md:py-3 px-2 bg-lightBlue border-r border-navyBlue font-semibold">
                    Phone Number:
                  </div>
                  <h4>{phone}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-[100px] ss:w-[150px] py-1 md:py-3 px-2 bg-lightBlue border-r border-navyBlue font-semibold">
                    Email:
                  </div>
                  <h4>{email}</h4>
                </div>
              </div>
              <div className="w-[1/2] bg-lightBlue py-1 md:py-3 px-2 mb-2 ss:mb-4 md:mb-10 font-semibold">
                Drug Compliance: {percentageCompleted.toFixed(0)}%
              </div>
              <div className="flex flex-col border border-navyBlue mb-2 ss:mb-4 md:mb-10">
                <div className="py-1 ss:py-2 md:py-3 bg-navyBlue text-white text-center font-[500]">
                  Ongoing Drugs
                </div>
                <div className="capitalize py-1 px-2 ss:p-2 ">
                  {currentDrugs.join(", ") || "N/A"}
                </div>
              </div>
              <div className="flex flex-col border border-navyBlue mb-2 ss:mb-4 md:mb-10">
                <div className="py-1 ss:py-2 md:py-3 bg-navyBlue text-white text-center font-[500]">
                  Past Drugs (6months)
                </div>
                <div className="capitalize py-1 px-2 ss:p-2 ">
                  {recentDrugs.join(", ") || "N/A"}
                </div>
              </div>
              <div className="flex flex-col border border-navyBlue mb-2 ss:mb-4 md:mb-10">
                <div className="py-1 ss:py-2 md:py-3 bg-navyBlue text-white text-center font-[500]">
                  Allergies
                </div>
                <div className="capitalize py-1 px-2 ss:p-2 ">
                  {allergicDrugs.join(", ") || "N/A"}
                </div>
              </div>
              <div className="flex gap-4 ss:gap-6 w-full mb-4 md:mb-10 ss:mb-0">
                <div className="px-2 py-1 ss:py-3 bg-lightBlue font-[500] w-full capitalize">
                  Over-the-Counter drugs: {otcDrugs || "--"}
                </div>
                <div className="px-2 py-1 ss:py-3 bg-lightBlue font-[500] w-full capitalize">
                  Herbs & Concoctions: {herbs || "--"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadableReport;
