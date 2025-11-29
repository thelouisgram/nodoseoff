/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Lock, Trash, X } from "lucide-react";

interface Settings {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

const AccountSettings: React.FC<Settings> = ({
  setActiveModal,
  activeModal,
}) => {
  if (activeModal !== "accountSettings") return null;

  return (
    <div className="w-full min-h-[100dvh] h-full right-0 bg-none fixed z-[32] font-Inter">
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          activeModal === "accountSettings" ? "right-0" : "-right-[450px]"
        } transition-all duration-300 absolute w-full ss:w-[450px] bg-white h-full z-10`}
      >
        <div className="h-full flex flex-col w-full gap-8 p-8 pt-0 overflow-y-scroll bg-white">
          <div className="h-auto w-auto">
            {/* Close button */}
            <div className="w-full flex justify-end mb-10">
              <button
                onClick={() => setActiveModal("")}
                className="cursor-pointer pt-8 hover:opacity-70 transition-opacity"
              >
                <X className="size-6 text-gray-800" />
              </button>
            </div>

            {/* Account Settings heading */}
            <h1 className="text-[24px] text-blue-700 font-bold mb-10">
              Account Settings
            </h1>

            {/* Options */}
            <div className="flex flex-col gap-4">
              <button
                onClick={() => setActiveModal("changePassword")}
                className="w-full border border-gray-300 rounded-lg py-4 px-4 flex justify-between gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex gap-3 items-center">
                  <Lock className="size-5 text-navyBlue" strokeWidth={2} />
                  <h2 className="font-Inter text-[14px] font-medium text-navyBlue">
                    Change Password
                  </h2>
                </div>
              </button>

              <button
                disabled={true}
                className="w-full border border-gray-300 rounded-lg py-4 px-4 flex justify-between gap-3 cursor-not-allowed opacity-50"
              >
                <div className="flex gap-3 items-center">
                  <Trash className="size-5 text-red-600" strokeWidth={2} />
                  <h2 className="font-Inter text-[14px] font-medium text-navyBlue">
                    Delete Account
                  </h2>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;