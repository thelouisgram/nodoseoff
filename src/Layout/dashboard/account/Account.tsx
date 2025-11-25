/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import Image from "next/image";
import { toast } from "sonner";
import supabase from "../../../../utils/supabase";

import {
  updateIsAuthenticated,
  updateUserId,
  updateSchedule,
} from "../../../../store/stateSlice";
import { useRouter } from "next/router";
import Report from "./Report";
import Loader from "../shared/Loader";

type RefObject<T> = React.RefObject<T>;

interface AccountProps {
  setDrugHxForm: Function;
  deleteAccountModal: boolean;
  setProfileForm: Function;
  setShowStats: Function;
  setShowContact: Function;
  setAccountSettings: Function;
  setDeleteAccountModal: Function;
  setScreen: Function;
}

const Account: React.FC<AccountProps> = ({
  setProfileForm,
  setDrugHxForm,
  setShowStats,
  setShowContact,
  setAccountSettings,
  deleteAccountModal,
  setDeleteAccountModal,
  setScreen,
}) => {
  const { info, userId, profilePicture } = useSelector((state: RootState) => state.app);
  const router = useRouter();
  const dispatch = useDispatch();
  const { name, phone, email } = info[0];

  const dropdownRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);


  const [tab, setTab] = useState("Account");

  const logOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error signing out");
      }
      dispatch(updateUserId(""));
      dispatch(updateIsAuthenticated(false));
      router.push("/login");
      dispatch(updateSchedule([]));
    } catch (error) {
      toast.error("Error signing out: " + error);
    }
  };

  const deleteUser = async () => {
    try {
      toast.loading('Deleting Account')
      setScreen(false)
      const response = await fetch("/api/deleteUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Account Deleted Successfully');
        router.push("./login");
        // Redirect or update state as needed
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Error deleting account");
    }
  };

  const CDNURL =
    "https://opshqmqagtfidynwftzk.supabase.co/storage/v1/object/public/profile-picture/";

  return (
    <>
      {tab === "Account" ? (
        <div className="h-[100dvh] overflow-y-scroll w-full md:py-16 md:px-12 px-4 pt-10 pb-24 ss:p-10 ss:pb-24  mb-10 text-navyBlue font-karla relative">
          <div className="mb-[28px]">
            <h1 className="text-[24px] ss:text-[32px] font-semibold font-karla ">
              My Account
            </h1>
            <p className="text-[16px] text-grey capitalize">{name}</p>
          </div>
          <div className="w-full flex-col flex md:flex-row-reverse gap-4 ss:gap-30 ">
            <div className="w-full">
              <div className="w-full items-center flex flex-col mb-8">
                <div className="w-[150px] h-[150px] rounded-full overflow-hidden">
                  <Image
                    src={CDNURL + userId + "/" + profilePicture }
                    width={100}
                    height={100}
                    alt="user"
                    quality={100}
                    className="w-[150px] h-[150px] object-cover"
                    priority
                  />
                </div>
                <h1 className=" text-[20px] ss:text-[32px] mt-4 font-bold font-Inter text-center capitalize">
                  {name}
                </h1>
              </div>
              <div className="w-full grid ss:grid-cols-2 gap-4 mb-4">
                <div className="w-full border border-gray-300 rounded-lg  py-4 px-4 flex gap-3 flex-wrap">
                  <h2 className="font-semibold">Email:</h2>
                  <p>{email}</p>
                </div>
                <div className="w-full border border-gray-300 rounded-lg  py-4 px-4 flex gap-3 flex-wrap">
                  <h2 className="font-semibold">Phone Number:</h2>
                  <p>{phone}</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-[600px] flex flex-col gap-4">
              <button
                onClick={() => {
                  setProfileForm(true);
                }}
                className="w-full border h-full border-gray-300 rounded-lg  py-4 px-4 flex justify-between gap-3 cursor-pointer"
              >
                <div className="flex gap-3 h-full w-full">
                  <Image
                    src="/assets/account/profile.png"
                    width={24}
                    height={24}
                    alt="Profile"
                    className="w-6 h-auto"
                  />
                  <h2 className="">Profile Settings</h2>
                </div>
              </button>
              <button
                onClick={() => {
                  setDrugHxForm(true);
                }}
                className="w-full border border-gray-300 rounded-lg  py-4 px-4 flex cursor-pointer"
              >
                <div className="flex gap-3">
                  <Image
                    src="/assets/account/document.png"
                    width={24}
                    height={24}
                    alt="Drug History"
                    className="w-6 h-auto"
                  />
                  <h2 className="">Drug History</h2>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowStats(true);
                }}
                className="w-full border border-gray-300 rounded-lg  py-4 px-4 flex justify-between gap-3 cursor-pointer"
              >
                <div className="flex gap-3">
                  <Image
                    src="/assets/account/diagram.png"
                    width={24}
                    height={24}
                    alt="Statistics"
                    className="w-6 h-auto"
                  />
                  <h2 className="">Statistics</h2>
                </div>
              </button>
              <button
                onClick={() => {
                  setTab("Report");
                }}
                className="w-full border border-gray-300 rounded-lg  py-4 px-4 flex justify-between gap-3 cursor-pointer"
              >
                <div className="flex gap-3">
                  <Image
                    src="/assets/account/graph.png"
                    width={24}
                    height={24}
                    alt="Report"
                    className="w-6 h-auto"
                  />
                  <h2 className="">Drug Report</h2>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowContact(true);
                }}
                className="w-full border border-gray-300 rounded-lg  py-4 px-4 flex justify-between gap-3 cursor-pointer"
              >
                <div className="flex gap-3">
                  <Image
                    src="/assets/account/support.png"
                    width={24}
                    height={24}
                    alt="contact"
                    className="w-6 h-auto"
                  />
                  <h2 className="">Contact Us</h2>
                </div>
              </button>
              <button
                onClick={() => {
                  setAccountSettings(true);
                }}
                className="w-full border border-gray-300 rounded-lg  py-4 px-4 flex justify-between gap-3 cursor-pointer"
              >
                <div className="flex gap-3">
                  <Image
                    src="/assets/account/settings.png"
                    width={24}
                    height={24}
                    alt="contact"
                    className="w-6 h-auto"
                  />
                  <h2 className="">Account Settings</h2>
                </div>
              </button>

              <button
                onClick={logOut}
                className="flex justify-between border-[1px] ss:w-[1/2] text-red w-full rounded-[10px]  px-4 py-4 items-center  gap-3"
              >
                <div className="flex gap-3 items-center h-full">
                  <Image
                    src="/assets/exit.png"
                    width={18}
                    height={18}
                    alt="logout"
                  />
                  Log out
                </div>
                <Image
                  src="/assets/down.png"
                  width={512}
                  height={512}
                  alt="download"
                  quality={100}
                  className="w-[20px] h-auto -rotate-90"
                />
              </button>
            </div>
          </div>
          {deleteAccountModal && (
            <div className="w-full h-full fixed flex top-0 left-0 justify-center items-center z-[143] p-4 font-Inter">
              <div
                ref={dropdownRef}
                className="bg-white rounded-[10px] text-white relative flex flex-col justify-center items-center"
              >
                <h1 className="text-navyBlue font-semibold py-4 px-4 border-b-[1px] text-left w-full text-[13px] ss:text-[16px] leading-tight">
                  Confirm to DELETE YOUR ACCOUNT
                </h1>
                <h2 className="text-navyBlue border-b-[1px] text-left px-4 py-4 text-[12px] ss:text-[14px]">
                  Are you sure you want to delete your account? <br className="hidden md:flex"/> This
                  action cannot be undone.
                </h2>
                <div className="w-full flex gap-3 justify-start flex-row-reverse text-[12px] py-4 px-4">
                  <button
                    onClick={() => {
                      deleteUser();
                      setDeleteAccountModal(false);
                    }}
                    className="px-4 py-1 flex items-center gap-2 bg-red rounded-[10px]  "
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setScreen(false), setDeleteAccountModal(false);
                    }}
                    className="px-4 py-1 flex items-center gap-2 bg-none border text-navyBlue border-navyBlue rounded-[10px]  "
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Report setTab={setTab} />
      )}
    </>
  );
};

export default Account;
