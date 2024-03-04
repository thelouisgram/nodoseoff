import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { RootState } from "../../../../store";
import { useSelector } from "react-redux";
import Image from "next/image";

const ImageWithText: React.FC = () => {
  const { drugs, schedule, userId, info, allergies, completedDrugs } =
    useSelector((state: RootState) => state.app);

  const { name, phone, email } = info[0];
  const currentDrugs = drugs.map((drug) => drug.drug);
  const pastDrugs = completedDrugs.map((drug) => drug.drug);
  const allergicDrugs = allergies.map((drug) => drug?.drug);

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
  };

  return (
    <div className="flex flex-col items-start w-full px-4 ss:px-8 md:px-0 font-Inter ">
      <div className="flex flex-col items-start w-full md:px-0 font-Inter ">
        <button
          onClick={handleDownload}
          className="my-4 px-4 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          Download Image
        </button>
        <div className="w-full h-auto">
          <div ref={imageRef} className="relative w-full h-auto border">
            <Image
              src="/assets/image.png"
              width={1074}
              height={1417}
              alt="image"
            />
            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-start items-start text-[10px] ss:text-[14px] md:text-[16px]">
              <div className="bg-navyBlue py-2 ss:py-4 md:py-8 px-4 w-full">
                <div className="w-full flex justify-center font-montserrant text-white">
                  <h1 className="text-[16px] ss:text-[32px] font-semibold">
                    NoDoseOff
                  </h1>
                </div>
              </div>
              <div className="w-full flex justify-center pt-2 ss:pt-3 text-center font-bold text-[12px] ss:text-[24px] uppercase ">
                Drug History Summary
              </div>
              <div className="py-2 ss:py-3 md:py-6 px-3 ss:px-6 border-navyBlue w-full">
                <h2 className="font-semibold text-blackII mb-1 ss:mb-2 md:mb-4 text-[12px] ss:text-[16px]">
                  Patient&apos;s Information
                </h2>
                <div className="border border-navyBlue mb-2 ss:mb-4 md:mb-10 w-full text-[10px] ss:text-[14px] md:text-[16px]">
                  <div className="flex items-center gap-2 border-b border-navyBlue w-full">
                    <div className="w-[105px] ss:w-[150px] py-1 md:py-3 px-2 bg-lightBlue border-r border-navyBlue font-semibold">
                      Name:
                    </div>
                    <h4>{name}</h4>
                  </div>
                  <div className="flex items-center gap-2 border-b border-navyBlue">
                    <div className="w-[105px] ss:w-[150px] py-1 md:py-3 px-2 bg-lightBlue border-r border-navyBlue font-semibold">
                      Phone Number:
                    </div>
                    <h4>{phone}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-[105px] ss:w-[150px] py-1 md:py-3 px-2 bg-lightBlue border-r border-navyBlue font-semibold">
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
                    Past Drugs
                  </div>
                  <div className="capitalize py-1 px-2 ss:p-2 ">
                    {pastDrugs.join(", ") || "N/A"}
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
                  <div className="px-2 py-1 ss:py-3 bg-lightBlue font-[500] w-full">
                    Over-the-Counter drugs: --
                  </div>
                  <div className="px-2 py-1 ss:py-3 bg-lightBlue font-[500] w-full">
                    Herbs & Concoctions: --
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageWithText;
