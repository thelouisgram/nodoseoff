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
import {
  ChevronRight,
  Cog,
  FileText,
  FolderDown,
  Headset,
  LogOut,
  Pencil,
  Shield,
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

  const router = useRouter();
  const { signOut } = useAuth();

  const logOut = async () => {
    try {
      await signOut();
      dispatch(setActiveTab("Home"));
      router.push("/login");
      dispatch(setIsAuthenticated(false));
      dispatch(setUserId(""));
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  if (tab === "Report") {
    return <Report setTab={setTab} />;
  }

  return (
    <div className="h-full w-full overflow-y-scroll bg-soft-canvas px-4 pb-24 pt-10 font-jakarta text-soft-ink ss:px-8 md:px-12 md:py-14 md:pb-10">
      <div className="mb-7">
        <h1 className="truncate font-jakarta text-[28px] font-bold tracking-tight text-soft-ink ss:text-[32px]">
          Account
        </h1>
        <p className="mt-1 text-[14px] text-soft-muted ss:text-[15px]">
          Profile, reports, and preferences
        </p>
      </div>

      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        {/* Profile hero */}
        <section className="overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-soft-sm">
          <div className="h-20 bg-gradient-to-r from-soft-primary via-[#0a3a6e] to-[#1a5f7a] ss:h-24" />
          <div className="relative px-5 pb-5 ss:px-6 ss:pb-6">
            <div className="-mt-12 flex flex-col items-start gap-4 ss:-mt-14">
              <div className="relative shrink-0">
                <div className="flex size-[88px] items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-soft-canvas shadow-soft-sm ss:size-24">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      width={192}
                      height={192}
                      alt="Your profile photo"
                      className="size-full object-cover"
                      priority
                    />
                  ) : (
                    <UserRound
                      className="size-10 text-soft-muted ss:size-12"
                      strokeWidth={1.25}
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal("profile")}
                  className="absolute bottom-0.5 right-0.5 flex size-8 items-center justify-center rounded-full border border-black/[0.06] bg-white text-soft-primary shadow-soft-sm transition hover:bg-soft-canvas"
                  aria-label="Edit profile"
                >
                  <Pencil className="size-3.5" strokeWidth={2} />
                </button>
              </div>

              <div className="flex w-full min-w-0 flex-col gap-3 ss:flex-row ss:items-end ss:justify-between">
                <div className="min-w-0">
                  <h2 className="break-words text-[22px] font-bold capitalize tracking-tight text-soft-ink ss:text-[24px]">
                    {name || "Your name"}
                  </h2>
                  <p className="mt-1 break-all text-[14px] text-soft-muted">
                    {email || "No email on file"}
                  </p>
                  {phone ? (
                    <p className="mt-0.5 text-[14px] text-soft-muted">{phone}</p>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal("profile")}
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-black/[0.06] bg-soft-canvas px-3.5 py-2 text-[13px] font-semibold text-soft-ink transition hover:bg-white"
                >
                  Edit profile
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-2 ss:grid-cols-2">
              <InfoChip label="Email" value={email || "—"} />
              <InfoChip label="Phone" value={phone || "—"} />
            </div>
          </div>
        </section>

        {/* Health records */}
        <section>
          <SectionLabel>Health records</SectionLabel>
          <div className="overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-soft-sm">
            <AccountRow
              icon={<FileText className="size-[18px]" strokeWidth={1.75} />}
              label="Drug history"
              hint="OTC, herbs, and past courses"
              onClick={() => setActiveModal("drugHx")}
            />
            <AccountRow
              icon={<FolderDown className="size-[18px]" strokeWidth={1.75} />}
              label="Medication report"
              hint="Download a PDF for your clinician"
              onClick={() => setTab("Report")}
              last
            />
          </div>
        </section>

        {/* Preferences */}
        <section>
          <SectionLabel>Preferences</SectionLabel>
          <div className="overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-soft-sm">
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
          </div>
        </section>

        {/* Sign out */}
        <section>
          <button
            type="button"
            onClick={logOut}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#f0c9d4] bg-white px-4 py-3.5 text-[14px] font-semibold text-[#8a3d5a] shadow-soft-sm transition hover:bg-[#fff7fa]"
          >
            <LogOut className="size-4" strokeWidth={1.75} />
            Log out
          </button>
        </section>
      </div>
    </div>
  );
};

export default Account;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-soft-muted">
      {children}
    </p>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-soft-canvas/80 px-3.5 py-3">
      <p className="text-[11px] font-medium text-soft-muted">{label}</p>
      <p className="mt-0.5 truncate text-[14px] font-semibold text-soft-ink">
        {value}
      </p>
    </div>
  );
}

function AccountRow({
  icon,
  label,
  hint,
  onClick,
  last = false,
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  onClick: () => void;
  last?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-soft-canvas/70 ss:px-5 ${
        last ? "" : "border-b border-black/[0.05]"
      }`}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-soft-primary-soft text-soft-primary">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-soft-ink">
          {label}
        </span>
        {hint ? (
          <span className="mt-0.5 block text-[12px] text-soft-muted">{hint}</span>
        ) : null}
      </span>
      <ChevronRight className="size-4 shrink-0 text-soft-muted" strokeWidth={1.75} />
    </button>
  );
}
