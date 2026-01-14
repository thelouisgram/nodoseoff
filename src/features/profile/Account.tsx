/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";

import { useUserInfo, useProfilePicture } from "@/hooks/useDashboardData";
import Image from "next/image";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Report from "./Report";
import { useAppStore } from "@/store/useAppStore";

import {
  ChevronRight,
  Cog,
  FileText,
  FolderDown,
  Headset,
  LogOut,
  UserRound,
} from "lucide-react";

interface AccountProps {
  setActiveModal: (value: string) => void;
}

const CDNURL =
  "https://opshqmqagtfidynwftzk.supabase.co/storage/v1/object/public/profile-picture/";

const Account: React.FC<AccountProps> = ({ setActiveModal }) => {
  const { userId, setActiveTab, setIsAuthenticated, setUserId } = useAppStore(
    (state) => state
  );
  const { data: info = [] } = useUserInfo(userId);
  const { data: profilePicture = "" } = useProfilePicture(userId);

  const userInfo = info?.[0] || { name: "", phone: "", email: "" };
  const { name, phone, email } = userInfo;
  const [tab, setTab] = useState<"Account" | "Report">("Account");

  const router = useRouter();

  const { signOut } = useAuth();

  const logOut = async () => {
    try {
      await signOut();
      setActiveTab("Home");
      router.push("/login");
      setIsAuthenticated(false);
      setUserId("");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  if (tab === "Report") {
    return <Report setTab={setTab} />;
  }

  return (
    <div className="h-[100dvh] overflow-y-scroll md:py-16 md:px-12 pt-10 pb-24 md:pb-10 w-full px-4 ss:px-8 text-slate-800 dark:text-slate-100 font-karla">
      <div className="mb-7">
        <h1 className="text-2xl ss:text-3xl font-semibold font-karla text-slate-800 dark:text-slate-100">
          My Account
        </h1>
        <p className="text-base text-gray-500 dark:text-slate-400">{name}</p>
      </div>

      <div className="grid md:grid-cols-[1fr_600px] gap-8">
        {/* ===== Profile Section ===== */}
        <div className="flex flex-col gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center text-center">
            <div className="w-36 h-36 rounded-full border border-gray-300 overflow-hidden flex items-center justify-center">
              {profilePicture ? (
                <Image
                  src={`${CDNURL}${userId}/${profilePicture}`}
                  width={300}
                  height={300}
                  alt="Profile photo"
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <UserRound className="size-20 text-gray-400" strokeWidth={1} />
              )}
            </div>

            <h2 className="mt-4 text-xl font-semibold capitalize dark:text-slate-100">
              {name}
            </h2>
          </div>

          {/* User Info Boxes */}
          <div className="flex flex-col gap-3">
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl px-4 py-3 flex justify-between items-center shadow-sm">
              <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Email
              </span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {email}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl px-4 py-3 flex justify-between items-center shadow-sm">
              <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Phone Number
              </span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {phone}
              </span>
            </div>
          </div>
        </div>

        {/* ===== Actions (Individual Boxes) ===== */}
        <div className="flex flex-col gap-4">
          <AccountRow
            icon={<UserRound className="size-6 text-indigo-600" />}
            label="Profile Settings"
            onClick={() => setActiveModal("profile")}
          />

          <AccountRow
            icon={<FileText className="size-6 text-blue-600" />}
            label="Drug History"
            onClick={() => setActiveModal("drugHx")}
          />

          <AccountRow
            icon={<FolderDown className="size-6 text-green-600" />}
            label="Drug Report"
            onClick={() => setTab("Report")}
          />

          <AccountRow
            icon={<Headset className="size-6 text-teal-600" />}
            label="Contact Us"
            onClick={() => setActiveModal("contact")}
          />

          <AccountRow
            icon={<Cog className="size-6 text-orange-500" />}
            label="Account Settings"
            onClick={() => setActiveModal("accountSettings")}
          />

          <AccountRow
            icon={<LogOut className="size-6 text-red-600" />}
            label="Log out"
            danger
            onClick={logOut}
          />
        </div>
      </div>
    </div>
  );
};

export default Account;

interface RowProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

const AccountRow: React.FC<RowProps> = ({
  icon,
  label,
  onClick,
  danger = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full p-4 border rounded-xl shadow-sm
        flex justify-between items-center
        transition-colors
        ${
          danger
            ? "border-red-100 dark:border-red-900/40 bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-900/10"
            : "border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800"
        }
      `}
    >
      <div
        className={`flex gap-3 items-center ${danger ? "text-red-600" : "text-slate-800 dark:text-slate-100"}`}
      >
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>

      <ChevronRight className="size-5 text-gray-400" />
    </button>
  );
};
