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
}

const Account: React.FC<AccountProps> = ({
  setProfileForm,
  setDrugHxForm,
  setShowStats,
}) => {
  const { drugs, info, effects, schedule } = useSelector(
    (state: RootState) => state.app
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const { name, phone, email, otcDrugs, herbs } = info[0];

  const [tab, setTab] = useState("Account");

  const logOut = async () => {
    try {
      toast.loading("Signing Out");
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error signing out");
      }
      dispatch(updateUserId(""));
      toast.success("Signed Out");
      dispatch(updateIsAuthenticated(false));
      router.push("/signIn");
      dispatch(updateSchedule([]));
    } catch (error) {
      toast.error("Error signing out: " + error);
    }
  };

  return (
    <div className="w-full">
      {tab === "Account" ? (
        <div className="h-[100dvh] overflow-y-scroll w-full md:py-16 md:px-12 px-4 pt-10 pb-24 ss:p-10 ss:pb-24  mb-10 text-navyBlue font-karla relative">
          <div className="mb-[28px]">
            <h1 className="text-[24px] ss:text-[32px] font-semibold font-montserrant ">
              My Account
            </h1>
          </div>
          <div className="w-full flex-col flex md:flex-row-reverse gap-8 ss:gap-20 ">
            <div className="w-full">
              <div className="w-full items-center flex flex-col  mb-8">
                <Image
                  src="/assets/icons8-user-100.png"
                  width={100}
                  height={100}
                  alt="user"
                  quality={100}
                />
                <h1 className=" text-[20px] ss:text-[32px] font-semibold font-montserrant text-center capitalize">
                  {name}
                </h1>
              </div>
              <div className="w-full grid ss:grid-cols-2 gap-4 mb-10">
                <div className="w-full border border-gray-300 rounded-lg rounded-bl-none py-4 px-4 flex gap-2">
                  <h2 className="font-semibold">Email:</h2>
                  <p>{email}</p>
                </div>
                <div className="w-full border border-gray-300 rounded-lg rounded-bl-none py-4 px-4 flex gap-2">
                  <h2 className="font-semibold">Phone Number:</h2>
                  <p>{phone}</p>
                </div>
                <div className="w-full border border-gray-300 rounded-lg rounded-bl-none py-4 px-4 flex gap-2 capitalize">
                  <h2 className="font-semibold">OTC Drugs:</h2>
                  <p>{otcDrugs || '--'}</p>

                </div>
                <div className="w-full border border-gray-300 rounded-lg rounded-bl-none py-4 px-4 flex gap-2 capitalize">
                  <h2 className="font-semibold">Herbs:</h2>
                  <p>{herbs || '--'}</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-[600px] flex flex-col gap-4">
              <div
                onClick={() => {
                  setProfileForm(true);
                }}
                className="w-full border border-gray-300 rounded-lg rounded-bl-none py-4 px-4 flex justify-between gap-2 cursor-pointer"
              >
                <h2 className="font-semibold">Profile Settings</h2>
                <Image
                  src="/assets/down.png"
                  width={512}
                  height={512}
                  alt="download"
                  quality={100}
                  className="w-[20px] h-auto -rotate-90"
                />
              </div>
              <div
                onClick={() => {
                  setDrugHxForm(true);
                }}
                className="w-full border border-gray-300 rounded-lg rounded-bl-none py-4 px-4 flex justify-between gap-2 cursor-pointer"
              >
                <h2 className="font-semibold">Drug History</h2>
                <Image
                  src="/assets/down.png"
                  width={512}
                  height={512}
                  alt="download"
                  quality={100}
                  className="w-[20px] h-auto -rotate-90"
                />
              </div>
              <div
                onClick={() => {
                  setShowStats(true);
                }}
                className="w-full border border-gray-300 rounded-lg rounded-bl-none py-4 px-4 flex justify-between gap-2 cursor-pointer"
              >
                <h2 className="font-semibold">Statistics</h2>
                <Image
                  src="/assets/down.png"
                  width={512}
                  height={512}
                  alt="download"
                  quality={100}
                  className="w-[20px] h-auto -rotate-90"
                />
              </div>
              <div
                onClick={() => {
                  setTab("Report");
                }}
                className="w-full border border-gray-300 rounded-lg rounded-bl-none py-4 px-4 flex justify-between gap-2 cursor-pointer"
              >
                <h2 className="font-semibold">Drug Report</h2>
                <Image
                  src="/assets/down.png"
                  width={512}
                  height={512}
                  alt="download"
                  quality={100}
                  className="w-[20px] h-auto -rotate-90"
                />
              </div>

              <button
                onClick={logOut}
                className="flex flex-row-reverse justify-between border-[1px] ss:w-[1/2] text-red w-full rounded-[10px] rounded-bl-none px-4 py-4 items-center font-semibold gap-2"
              >
                <Image
                  src="/assets/exit.png"
                  width={18}
                  height={18}
                  alt="logout"
                />
                Log out
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Report setTab={setTab} />
      )}
    </div>
  );
};

export default Account;
