"use client";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import {
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { tabs } from "@/utils/dashboard/dashboard";
import Tabs from "./Tabs";
import InteractiveLogo from "@/components/ui/InteractiveLogo";
import { useAppDispatch, useAppSelector } from "@/store";
import { setActiveTab } from "@/store/appSlice";
import { useProfilePicture, useUserInfo } from "@/hooks/useDashboardData";
import { resolveProfileImageUrl } from "@/utils/profilePicture";
import { ndoEase } from "@/components/landing/motion";
import { isDashboardTabActive } from "@/utils/dashboard/nav";

interface TabItem {
  name: string;
  icon: LucideIcon;
}

interface SideBarProps {
  activeTab: string;
  handleSignOut: () => void;
  nav: boolean;
  setNav: (value: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({
  activeTab,
  handleSignOut,
  nav,
  setNav,
}) => {
  const dispatch = useAppDispatch();
  const reduce = useReducedMotion();
  const { userId } = useAppSelector((state) => state.app);
  const { data: info = [] } = useUserInfo(userId);
  const { data: profilePicture = "" } = useProfilePicture(userId);

  const userInfo = info?.[0] || { name: "", phone: "", email: "" };
  const { name, email } = userInfo;
  const photoUrl = resolveProfileImageUrl(profilePicture);
  const accountActive = isDashboardTabActive("Account", activeTab);

  return (
    <div className="relative z-[1] flex h-full flex-col">
      {/* Brand + collapse — mark stays visible in the narrow rail */}
      <div
        className={`mb-6 flex flex-col items-center gap-2.5 ${
          nav ? "lg:mb-7 lg:flex-row lg:justify-between lg:gap-2" : ""
        }`}
      >
        <div className={`flex shrink-0 ${nav ? "lg:hidden" : ""}`}>
          <InteractiveLogo
            variant="mark-blue"
            priority
            width={205}
            height={212}
            imgClassName="h-7 w-auto"
          />
        </div>

        {/* Wordmark — expanded desktop only */}
        <div
          className={`hidden overflow-hidden transition-all duration-300 lg:block ${
            nav ? "w-[132px] pl-1.5 opacity-100" : "w-0 opacity-0"
          }`}
        >
          <InteractiveLogo
            variant="blue"
            priority
            width={1084}
            height={257}
            imgClassName="h-auto w-[132px]"
          />
        </div>

        <button
          type="button"
          onClick={() => setNav(!nav)}
          className="ndo-press hidden size-9 shrink-0 place-items-center rounded-xl text-soft-muted hover:bg-soft-primary-soft hover:text-soft-primary lg:grid"
          aria-label={nav ? "Collapse sidebar" : "Expand sidebar"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={nav ? "collapse" : "expand"}
              className="grid place-items-center"
              initial={reduce ? false : { rotate: -70, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { rotate: 70, opacity: 0 }}
              transition={{ duration: 0.2, ease: ndoEase }}
            >
              {nav ? (
                <PanelLeftClose
                  className="size-5"
                  strokeWidth={1.75}
                  absoluteStrokeWidth
                />
              ) : (
                <PanelLeftOpen
                  className="size-5"
                  strokeWidth={1.75}
                  absoluteStrokeWidth
                />
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <p
        className={`mb-2.5 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-soft-muted/75 ${
          nav ? "hidden lg:block" : "hidden"
        }`}
      >
        Navigate
      </p>

      <LayoutGroup id="desktop-rail">
        <motion.nav
          className="flex flex-1 flex-col gap-1"
          aria-label="Main"
          initial={reduce ? false : "hidden"}
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } },
          }}
        >
          {tabs.map((item: TabItem) => (
            <motion.div
              key={item.name}
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { duration: 0.3, ease: ndoEase } },
              }}
            >
              <Tabs item={item} activeTab={activeTab} nav={nav} />
            </motion.div>
          ))}
        </motion.nav>
      </LayoutGroup>

      {/* Footer — identity first, then the exit */}
      <div className="mt-auto pt-4">
        <div className="mb-3 h-px bg-black/[0.06]" />

        <button
          type="button"
          onClick={() => dispatch(setActiveTab("Account"))}
          className={`ndo-press group flex w-full items-center justify-center rounded-2xl py-1.5 ${
            nav ? "lg:justify-start lg:gap-3 lg:pl-1.5 lg:pr-2.5" : ""
          } ${accountActive ? "" : "hover:bg-soft-primary-soft/70"}`}
          aria-label="Open your account"
          title={!nav ? name || "Account" : undefined}
        >
          <span className="grid size-10 shrink-0 place-items-center">
            <span
              className={`grid size-9 place-items-center overflow-hidden rounded-xl bg-soft-primary-soft text-soft-primary ring-1 transition-colors ${
                accountActive
                  ? "ring-soft-primary/35"
                  : "ring-soft-line group-hover:ring-soft-primary/25"
              }`}
            >
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  width={96}
                  height={96}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <UserRound className="size-[18px]" strokeWidth={1.6} />
              )}
            </span>
          </span>

          <span
            className={`min-w-0 flex-1 text-left ${
              nav ? "hidden lg:block" : "hidden"
            }`}
          >
            <span className="block truncate text-[13px] font-semibold capitalize text-soft-ink">
              {name || "Your profile"}
            </span>
            <span className="block truncate text-[11px] text-soft-muted">
              {email || "View account"}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={handleSignOut}
          className={`ndo-press group mt-1 flex w-full items-center justify-center rounded-2xl py-1.5 text-soft-muted hover:bg-soft-pink/60 hover:text-soft-pink-ink ${
            nav ? "lg:justify-start lg:gap-3 lg:pl-1.5 lg:pr-3" : ""
          }`}
          title={!nav ? "Log out" : undefined}
        >
          <span className="grid size-10 shrink-0 place-items-center">
            <LogOut
              className="ndo-arrow size-[19px]"
              strokeWidth={1.75}
              absoluteStrokeWidth
            />
          </span>
          <span
            className={`whitespace-nowrap text-[13.5px] font-medium ${
              nav ? "hidden lg:inline" : "hidden"
            }`}
          >
            Log out
          </span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
