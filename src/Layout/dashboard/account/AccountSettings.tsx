/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import ChangePassword from "./AccountSettings/ChangePassword";

interface Settings {
  setAccountSettings: (value: boolean) => void;
  setDeleteAccountModal: (value: boolean) => void;
  setScreen: (value: boolean) => void;
  accountSettings: boolean;
}

type RefObject<T> = React.RefObject<T>;

const AccountSettings: React.FC<Settings> = ({
  setAccountSettings,
  accountSettings,
  setDeleteAccountModal,
  setScreen,
}) => {
  const {} = useSelector((state: RootState) => state.app);

  const [tab, setTab] = useState<string>("default");
  const dropdownRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent): void => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setAccountSettings(false);
      setTab("default");
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      handleClickOutside(event);
    };

    // Add event listener for clicks outside of dropdown
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      // Remove event listener when component unmounts
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

 
  return (
    <div
      className={` ${
        accountSettings ? "w-full min-h-[100dvh]" : "w-0 h-0"
      } right-0 bg-none fixed z-[2]`}
    >
      <div
        className={` ${
          accountSettings
            ? "right-0 ss:w-[450px]"
            : "-right-[450px] ss:w-[450px]"
        } transition duration-300 absolute w-full bg-white h-full z-[4] `}
      >
        <div
          ref={dropdownRef}
          className={`h-full flex flex-col w-full justify-between gap-8 p-8 pt-0 overflow-y-scroll bg-white`}
        >
          {tab === "default" ? (
            <div className="h-auto w-auto">
              {/* Close button */}
              <div className="w-full flex justify-end mb-10">
                <Image
                  src="/assets/x (1).png"
                  width={18}
                  height={18}
                  alt="cancel"
                  onClick={() => {
                    setAccountSettings(false);
                  }}
                  id="top-drug"
                  className="cursor-pointer pt-8"
                />
              </div>
              {/* Account Settings heading */}
              <h1 className="text-[24px] text-blue-700 font-bold mb-10">
                Account Settings
              </h1>
              {/* Options */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    setTab("changePassword");
                  }}
                  className="w-full border border-gray-300 rounded-lg py-4 px-4 flex justify-between gap-3 cursor-pointer"
                >
                  <div className="flex gap-3">
                    <Image
                      src="/assets/account/lock.png"
                      width={24}
                      height={24}
                      alt="lock"
                      className="w-6 h-6"
                    />
                    <h2>Change Password</h2>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setDeleteAccountModal(true),
                      setAccountSettings(false),
                      setScreen(true);
                  }}
                  className="w-full border border-gray-300 rounded-lg py-4 px-4 flex justify-between gap-3 cursor-pointer"
                >
                  <div className="flex gap-3">
                    <Image
                      src="/assets/delete.png"
                      width={24}
                      height={24}
                      alt="delete"
                      className="w-6 h-6"
                    />
                    <h2>Delete Account</h2>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <ChangePassword
              setAccountSettings={setAccountSettings}
              setTab={setTab}
            />
          )}
        </div>
      </div>

      {/* Background overlay */}
      <div
        onClick={() => {
          setTab("default");
          setAccountSettings(false);
        }}
        className="absolute w-full h-full bg-grey opacity-[40] z-[3]"
      />
    </div>
  );
};

export default AccountSettings;
