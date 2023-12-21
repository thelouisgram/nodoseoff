import React, { useEffect, useState } from "react";
import Image from "next/image";

const Loader = () => {
  const [lineWidth, setLineWidth] = useState(0);

  useEffect(() => {
    let interval:any;
    let currentWidth = 0;

    const fillLine = () => {
      currentWidth += 20; // Increase by 20px each interval (adjust for smoother animation)
      setLineWidth((prevWidth) => Math.min(prevWidth + 20, 400)); // Cap at 400px to match the total width

      if (currentWidth >= 400) {
        clearInterval(interval);
      }
    };

    interval = setInterval(fillLine, 100); // Run more frequently for smoother animation (adjust the interval as needed)

    setTimeout(() => {
      clearInterval(interval);
    }, 2500); // Stop after 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-navyBlue text-white">
      <div className="mb-20">
        <Image
          src="/assets/pill perfect png logo.png"
          width={150}
          height={150}
          alt="logo"
          quality={100}
        />
        <h1 className="text-4xl font-bold leading-none mt-4">Pillperfect</h1>
      </div>
      <div className="w-400 h-1 bg-darkGrey rounded-full overflow-hidden">
        <div
          className="bg-white h-full transition-all duration-500"
          style={{ width: `${lineWidth}px` }}
        ></div>
      </div>
    </div>
  );
};

export default Loader;
