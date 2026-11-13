/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";

import { useUserInfo, useProfilePicture } from "@/hooks/useDashboardData";
import Image from "next/image";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Report from "./Report";
import { useAppSelector, useAppDispatch } from "@/store";
import { setActiveTab, setIsAuthenticated, setUserId } from "@/store/appSlice";

import { resolveProfileImageUrl } from "@/utils/profilePicture";
import { motion } from "framer-motion";
import { useDashboardSectionMotion } from "@/components/landing/motion";
import {
  ChevronRight,
  Cog,
  FileText,
  FolderDown,
  Headset,
  LogOut,
  Pencil,
  Shield,
  Trash2,
  UserRound,
} from "lucide-react";
import { isAdminEmail } from "@/lib/admin-emails";

interface AccountProps {
  setActiveModal: (value: string) => void;
}

const Account: React.FC<AccountProps> = ({ setActiveModal }) => {
  const { userId } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const { data: info = [] } = useUserInfo(userId);
  const { data: profilePicture = "" } = useProfilePicture(userId);

  const userInfo = info?.[0] || { name: "", phone: "", email: "" };
  const { name, phone, email } = userInfo;
  const [tab, setTab] = useState<"Account" | "Report">("Account");
  const photoUrl = resolveProfileImageUrl(profilePicture);
  const { stagger, rise } = useDashboardSectionMotion();

  const router = useRouter();
  const { signOut } = useAuth();

  const logOut = async () => {
    try {
      await signOut();
      dispatch(setActiveTab("Home"));
      router.push("/login");
      dispatch(setIsAuthenticated(false));
      dispatch(setUserId(""));
    } catch {
      toast.error("Error signing out");
    }
  };

  if (tab === "Report") {
    return <Report setTab={setTab} />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="h-full w-full overflow-y-scroll bg-soft-canvas px-4 pb-28 pt-10 font-jakarta text-soft-ink ss:px-8 md:px-12 md:py-14 md:pb-12"
    >
      <div className="mx-auto max-w-3xl">
        <motion.header variants={rise} className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-soft-muted">
            Account
          </p>
          <h1 className="mt-1 text-[28px] font-bold tracking-tight text-soft-ink ss:text-[32px]">
            Profile &amp; settings
          </h1>
        </motion.header>

        {/* Identity */}
        <motion.section
          variants={rise}
          className="mb-6 border-b border-black/[0.06] pb-7"
        >
          <div className="flex flex-col gap-5 ss:flex-row ss:items-center ss:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative shrink-0">
                <div className="grid size-[72px] place-items-center overflow-hidden rounded-2xl bg-soft-primary-soft text-soft-primary ss:size-20">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      width={160}
                      height={160}
                      alt="Your profile photo"
                      className="size-full object-cover"
                      priority
                    />
                  ) : (
                    <UserRound className="size-9" strokeWidth={1.4} />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal("profile")}
                  className="ndo-press absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-xl border border-black/[0.06] bg-white text-soft-primary shadow-soft-sm hover:bg-soft-canvas"
                  aria-label="Edit profile photo"
                >
                  <Pencil className="size-3.5" strokeWidth={2} />
                </button>
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-[22px] font-bold capitalize tracking-tight text-soft-ink ss:text-[24px]">
                  {name || "Your name"}
                </h2>
                <p className="mt-1 break-all text-[14px] text-soft-muted">
                  {email || "No email on file"}
                </p>
                {phone ? (
                  <p className="mt-0.5 text-[14px] text-soft-muted">{phone}</p>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal("profile")}
              className="ndo-press inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-xl border border-black/[0.06] bg-white px-3.5 py-2.5 text-[13px] font-semibold text-soft-ink shadow-soft-sm hover:bg-soft-canvas ss:self-center"
            >
              <Pencil className="size-3.5" strokeWidth={2} />
              Edit profile
            </button>
          </div>
        </motion.section>

        <div className="flex flex-col gap-7">
          <motion.section variants={rise}>
            <SectionLabel>Health records</SectionLabel>
            <Surface>
              <AccountRow
                icon={<FileText className="size-[18px]" strokeWidth={1.75} />}
                label="Drug history"
                hint="OTC, herbs, and past courses"
                onClick={() => setActiveModal("drugHx")}
              />
              <AccountRow
                icon={<FolderDown className="size-[18px]" strokeWidth={1.75} />}
                label="Medication report"
                hint="PDF for your clinician"
                onClick={() => setTab("Report")}
                last
              />
            </Surface>
          </motion.section>

          <motion.section variants={rise}>
            <SectionLabel>Settings</SectionLabel>
            <Surface>
              <AccountRow
                icon={<UserRound className="size-[18px]" strokeWidth={1.75} />}
                label="Profile settings"
                hint="Name, phone, and photo"
                onClick={() => setActiveModal("profile")}
              />
              <AccountRow
                icon={<Cog className="size-[18px]" strokeWidth={1.75} />}
                label="Account settings"
                hint="Password and security"
                onClick={() => setActiveModal("accountSettings")}
              />
              <AccountRow
                icon={<Headset className="size-[18px]" strokeWidth={1.75} />}
                label="Contact us"
                hint="Questions or support"
                onClick={() => setActiveModal("contact")}
                last={!isAdminEmail(email)}
              />
              {isAdminEmail(email) ? (
                <AccountRow
                  icon={<Shield className="size-[18px]" strokeWidth={1.75} />}
                  label="Admin"
                  hint="Internal tools"
                  onClick={() => router.push("/admin")}
                  last
                />
              ) : null}
            </Surface>
          </motion.section>

          <motion.section variants={rise}>
            <button
              type="button"
              onClick={logOut}
              className="ndo-press flex w-full items-center justify-center gap-2 rounded-2xl border border-black/[0.06] bg-white px-4 py-3.5 text-[14px] font-semibold text-soft-ink shadow-soft-sm hover:bg-soft-canvas"
            >
              <LogOut className="size-4" strokeWidth={1.75} />
              Log out
            </button>
          </motion.section>

          <motion.section variants={rise}>
            <SectionLabel tone="danger">Danger zone</SectionLabel>
            <Surface className="border-[#f0c9d4]">
              <AccountRow
                icon={<Trash2 className="size-[18px]" strokeWidth={1.75} />}
                label="Delete account"
                hint="Removes profile, meds, and reports"
                danger
                onClick={() => setActiveModal("deleteAccount")}
                last
              />
            </Surface>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
};

export default Account;

function SectionLabel({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <p
      className={`mb-2.5 px-0.5 text-[12px] font-semibold uppercase tracking-[0.14em] ${
        tone === "danger" ? "text-[#8a3d5a]" : "text-soft-muted"
      }`}
    >
      {children}
    </p>
  );
}

function Surface({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-soft-sm ${className}`}
    >
      {children}
    </div>
  );
}

function AccountRow({
  icon,
  label,
  hint,
  onClick,
  danger = false,
  last = false,
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  onClick: () => void;
  danger?: boolean;
  last?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`ndo-press flex w-full items-center gap-3 px-4 py-3.5 text-left ss:px-5 ${
        last ? "" : "border-b border-black/[0.05]"
      } ${danger ? "hover:bg-[#fff7fa]" : "hover:bg-soft-canvas/80"}`}
    >
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-xl ${
          danger
            ? "bg-soft-pink text-soft-pink-ink"
            : "bg-soft-primary-soft text-soft-primary"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block text-[15px] font-semibold ${
            danger ? "text-[#8a3d5a]" : "text-soft-ink"
          }`}
        >
          {label}
        </span>
        {hint ? (
          <span className="mt-0.5 block text-[12px] text-soft-muted">{hint}</span>
        ) : null}
      </span>
      <ChevronRight
        className="size-4 shrink-0 text-soft-muted"
        strokeWidth={1.75}
      />
    </button>
  );
}
