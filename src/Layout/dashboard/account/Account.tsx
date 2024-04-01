import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import Image from "next/image";
import { toast } from "sonner";
import supabase from "../../../../utils/supabaseClient";
import {
  updateIsAuthenticated,
  updateUserId,
  updateSchedule,
} from "../../../../store/stateSlice";
import { useRouter } from "next/router";
import Report from "./Report";

interface AccountProps {
  setDrugHxForm: Function;
  setProfileForm: Function;
  setShowStats: Function;
  setShowContact: Function;
}

const Account: React.FC<AccountProps> = ({
  setProfileForm,
  setDrugHxForm,
  setShowStats,
  setShowContact,
}) => {
  const { info, userId } = useSelector((state: RootState) => state.app);
  const router = useRouter();
  const dispatch = useDispatch();
  const { name, phone, email, otcDrugs, herbs } = info[0];

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

  const CDNURL =
    "https://opshqmqagtfidynwftzk.supabase.co/storage/v1/object/public/profile-picture/";

  return (
    <>
      {tab === "Account" ? (
        <div className="h-[100dvh] overflow-y-scroll w-full md:py-16 md:px-12 px-4 pt-10 pb-24 ss:p-10 ss:pb-24  mb-10 text-navyBlue font-karla relative">
          <div className="mb-[28px]">
            <h1 className="text-[24px] ss:text-[32px] font-semibold font-montserrant ">
              My Account
            </h1>
            <p className="text-[16px] text-blackII capitalize">{name}</p>
          </div>
          <div className="w-full flex-col flex md:flex-row-reverse gap-8 ss:gap-30 ">
            <div className="w-full">
              <div className="w-full items-center flex flex-col mb-8">
                <div className="w-[150px] h-[150px] rounded-full overflow-hidden">
                  <Image
                    src={
                      CDNURL + userId + "/avatar.png" ||
                      "/assets/icons8-user-100.png"
                    }
                    width={100}
                    height={100}
                    alt="user"
                    quality={100}
                    className="w-auto h-[150px] object-cover"
                    priority
                  />
                </div>
                <h1 className=" text-[20px] ss:text-[32px] mt-4 font-semibold font-montserrant text-center capitalize">
                  {name}
                </h1>
              </div>
              <div className="w-full grid ss:grid-cols-2 gap-4 mb-10">
                <div className="w-full border border-gray-300 rounded-lg  py-4 px-4 flex gap-3">
                  <h2 className="font-semibold">Email:</h2>
                  <p>{email}</p>
                </div>
                <div className="w-full border border-gray-300 rounded-lg  py-4 px-4 flex gap-3">
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
                    src="/assets/account/medical-report.png"
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
                  setShowContact("Report");
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
        </div>
      ) : (
        <Report setTab={setTab} />
      )}
    </>
  );
};

export default Account;
