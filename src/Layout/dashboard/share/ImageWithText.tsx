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

  console.log(allergies);

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
      <button
        onClick={handleDownload}
        className="my-4 px-4 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
      >
        Download Image
      </button>
      <div className="border w-full h-auto">
        <div ref={imageRef} className="aspect-[793.92/1122.24] w-full h-auto ">
          <div className="bg-navyBlue py-4 ss:py-8 px-4 w-full">
            <div className="w-full flex justify-center">
              <Image
                src="/assets/pill perfect png2.png"
                width={3912}
                height={1000}
                alt="logo"
                className="w-[120px] ss:w-[200px] h-auto"
              />
            </div>
            <h3 className="text-center font-bold text-[16px] ss:text-[24px] uppercase text-white">
              Drug History Summary
            </h3>
          </div>
          <div className="text-[14px] py-10 px-6 border-navyBlue">
            <h2 className="text-[16px] font-semibold text-blackII mb-4">
              Patient&apos;s Information
            </h2>
            <div className="border border-navyBlue text-[12px] mb-10">
              <div className="flex items-center gap-2 border-b border-navyBlue">
                <div className="w-[115px] py-3 px-2 bg-lightBlue border-r border-navyBlue font-semibold">
                  Name:
                </div>
                <h4>{name}</h4>
              </div>
              <div className="flex items-center gap-2 border-b border-navyBlue">
                <div className="w-[115px] py-3 px-2 bg-lightBlue border-r border-navyBlue font-semibold">
                  Phone Number:
                </div>
                <h4>{phone}</h4>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[115px] py-3 px-2 bg-lightBlue border-r border-navyBlue font-semibold">
                  Email:
                </div>
                <h4>{email}</h4>
              </div>
            </div>
            <div className="w-[1/2] bg-lightBlue py-3 px-2 mb-10 font-semibold ">
              Drug Compliance: {percentageCompleted.toFixed(0)}%
            </div>
            <div className="flex flex-col border border-navyBlue mb-10">
              <div className="py-3 bg-navyBlue text-white text-center font-[500]">
                Ongoing Drugs
              </div>
              <div className="capitalize p-2 ">
                {currentDrugs.join(", ") || "N/A"}
              </div>
            </div>
            <div className="flex flex-col border border-navyBlue mb-10">
              <div className="py-3 bg-navyBlue text-white text-center font-[500]">
                Past Drugs
              </div>
              <div className="capitalize p-2 ">
                {pastDrugs.join(", ") || "N/A"}
              </div>
            </div>
            <div className="flex flex-col border border-navyBlue mb-10">
              <div className="py-3 bg-navyBlue text-white text-center font-[500]">
                Allergies
              </div>
              <div className="capitalize p-2 ">
                {allergicDrugs.join(", ") || "N/A"}
              </div>
            </div>
            <div className="flex flex-col ss:flex-row gap-5 w-full mb-10 ss:mb-0">
              <div className="px-2 py-3 bg-lightBlue font-[500] w-full">
                Hx. of Over-the-counter drugs: --
              </div>
              <div className="px-2 py-3 bg-lightBlue font-[500] w-full">
                Hx. of Herbs & Concoctions: --
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageWithText;
