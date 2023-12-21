import React from 'react'
import Image from 'next/image';

const Footer = () => {
  return (
    <div className="bg-[#F2F7F8] w-full h-full">
      <div className="container w-[1100px] mx-auto py-[40px]">
        <div className="w-full flex justify-center">
          <Image
            src="/assets/pill perfect png.png"
            alt="logo"
            width={4672}
            height={1920}
            quality={100}
            className="w-[120px] ss:w-[200px] h-auto"
          />
        </div>
        <h3 className="text-center text-darkGrey">Copyright 2023</h3>
      </div>
    </div>
  );
}

export default Footer
