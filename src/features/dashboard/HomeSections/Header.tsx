import React from "react";
import Image from "next/image";

import { useProfilePicture, useUserInfo } from "@/hooks/useDashboardData";
import { UserRound } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store";
import { setActiveTab } from "@/store/appSlice";
import { resolveProfileImageUrl } from "@/utils/profilePicture";

const Header = () => {
  const { userId } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  const { data: profilePicture = "" } = useProfilePicture(userId);
  const { data: info = [] } = useUserInfo(userId);
  const firstName = info[0]?.name?.split(" ")[0];

  return (
    <div className="mb-7 flex w-full items-center justify-between gap-4 px-4 ss:px-8 md:px-0">
      <div className="min-w-0">
        <h1 className="truncate font-jakarta text-[28px] font-bold tracking-tight text-soft-ink ss:text-[32px]">
          Hi {firstName},
        </h1>
        <p className="mt-1 text-[14px] text-soft-muted ss:text-[15px]">
          Plan doses, stay on track, and feel better day by day.
        </p>
      </div>
      <button
        onClick={() => dispatch(setActiveTab("Account"))}
        className="flex size-14 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-black/[0.06] bg-white shadow-soft-sm"
        aria-label="View account"
      >
        {resolveProfileImageUrl(profilePicture) ? (
          <Image
            key={profilePicture}
            src={resolveProfileImageUrl(profilePicture)!}
            width={112}
            height={112}
            alt={firstName ? `${firstName}'s profile photo` : "Your profile photo"}
            quality={80}
            className="size-full rounded-full object-cover"
            priority
          />
        ) : (
          <UserRound className="size-8 text-soft-muted" strokeWidth={1.5} />
        )}
      </button>
    </div>
  );
};

export default Header;
