/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import Image from "next/image";
import { toast } from "sonner";
import { useAuth } from "../../../../contexts/AuthContext";

import {
  updateIsAuthenticated,
  updateUserId,
  updateSchedule,
} from "../../../../store/stateSlice";
import { useRouter } from "next/router";
import Report from "./Report";
import {
  ChevronRight,
  Cog,
  FileText,
  FolderDown,
  Headset,
  LogOut,
  UserRound,
} from "lucide-react";

type RefObject<T> = React.RefObject<T>;

interface AccountProps {
  setActiveModal: (value: string) => void;
}

const Account: React.FC<AccountProps> = ({ setActiveModal }) => {
  const { info, userId, profilePicture } = useSelector(
    (state: RootState) => state.app
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const { name, phone, email } = info[0];

  const [tab, setTab] = useState("Account");

  const { signOut } = useAuth();

  const logOut = async () => {
    try {
      signOut();
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
      const response = await fetch("/api/deleteUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account Deleted Successfully");
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
                <div className="w-[150px] h-[150px] flex justify-center items-center rounded-full overflow-hidden ring ring-navyBlue p-0.5">
                  {profilePicture === "" ? (
                    <>
                      <UserRound
                        className="size-24 text-navyBlue"
                        strokeWidth={1}
                      />
                    </>
                  ) : (
                    <Image
                      key={profilePicture}
                      src={CDNURL + userId + "/" + profilePicture}
                      width={3000}
                      height={3000}
                      alt="user"
                      quality={100}
                      className="size-full object-cover rounded-full"
                      priority
                    />
                  )}
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
                  setActiveModal("profile");
                }}
                className="w-full border h-full border-gray-300 rounded-lg  py-4 px-4 flex justify-between gap-3 cursor-pointer"
              >
                <div className="flex gap-3 h-full w-full">
                  <UserRound
                    className="size-6 text-navyBlue"
                    strokeWidth={1.5}
                  />
                  <h2 className="">Profile Settings</h2>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveModal("drugHx");
                }}
                className="w-full border border-gray-300 rounded-lg  py-4 px-4 flex cursor-pointer"
              >
                <div className="flex gap-3">
                  <FileText
                    className="size-6 text-navyBlue"
                    strokeWidth={1.5}
                  />
                  <h2 className="">Drug History</h2>
                </div>
              </button>
              <button
                onClick={() => {
                  setTab("Report");
                }}
                className="w-full border border-gray-300 rounded-lg  py-4 px-4 flex justify-between gap-3 cursor-pointer"
              >
                <div className="flex gap-3">
                  <FolderDown
                    className="size-6 text-navyBlue"
                    strokeWidth={1.5}
                  />
                  <h2 className="">Drug Report</h2>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveModal("contact");
                }}
                className="w-full border border-gray-300 rounded-lg  py-4 px-4 flex justify-between gap-3 cursor-pointer"
              >
                <div className="flex gap-3">
                  <Headset className="size-6 text-navyBlue" strokeWidth={1.5} />
                  <h2 className="">Contact Us</h2>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveModal("accountSettings");
                  console.log("clicked");
                }}
                className="w-full border border-gray-300 rounded-lg  py-4 px-4 flex justify-between gap-3 cursor-pointer"
              >
                <div className="flex gap-3">
                  <Cog className="size-6 text-navyBlue" strokeWidth={1.5} />
                  <h2 className="">Account Settings</h2>
                </div>
              </button>

              <button
                onClick={logOut}
                className="flex justify-between border-[1px] ss:w-[1/2] text-red-600 w-full rounded-[10px]  px-4 py-4 items-center  gap-3"
              >
                <div className="flex gap-3 items-center h-full">
                  <LogOut className="size-6 " strokeWidth={1.5} />
                  Log out
                </div>
                <ChevronRight className="text-navyBlue size-5" />
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
