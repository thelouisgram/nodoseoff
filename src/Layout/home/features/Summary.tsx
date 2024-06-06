import React from 'react'

const Summary = () => {
  return (
    <div className="relative w-full bg-[#FEFEFE] rounded-[16px] shadow-xl flex flex-col gap-5 items-center px-6 pt-4 pb-8">
            <h2 className="font-semibold text-[14px] mb-1">Drug History Report</h2>
            <div className="w-full flex gap-1">
              <h2 className="text-[14px] text-black w-32">Name</h2>
              <div className="w-full bg-gray-100 h-5"></div>
            </div>
            <div className="w-full flex gap-1">
              <h2 className="text-[14px] text-black w-32">Email</h2>
              <div className="w-full bg-gray-100 h-5"></div>
            </div>
            <div className="w-full flex gap-1">
              <h2 className="text-[14px] text-black w-32">Drugs</h2>
              <div className="w-full bg-gray-100 h-5"></div>
            </div>
            <div className="w-full flex gap-1">
              <h2 className="text-[14px] text-black w-32">Allergies</h2>
              <div className="w-full bg-gray-100 h-5"></div>
            </div>
          </div>
  )
}

export default Summary
