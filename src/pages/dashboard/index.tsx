/* eslint-disable react-hooks/exhaustive-deps */
import Screen from "@/Layout/dashboard/Screen";
import Account from "@/Layout/dashboard/account/Account";
import Contact from "@/Layout/dashboard/account/Contact";
import Statistics from "@/Layout/dashboard/account/Statistics";
import Drugs from "@/Layout/dashboard/drugs/Drugs";
import AllergiesForm from "@/Layout/dashboard/forms/AllergiesForm";
import DrugHxForm from "@/Layout/dashboard/account/DrugHxForm";
import DrugsForm from "@/Layout/dashboard/forms/DrugsForm";
import EditForm from "@/Layout/dashboard/forms/EditForm";
import ProfileForm from "@/Layout/dashboard/forms/ProfileForm";
import AllDoses from "@/Layout/dashboard/home/AllDoses";
import Home from "@/Layout/dashboard/home/Home";
import Loader from "@/Layout/dashboard/shared/Loader";
import { format } from "date-fns";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "../../../store";
import { updateActive, updateSchedule } from "../../../store/stateSlice";
import { ScheduleItem } from "../../../types/dashboard";
import { uploadScheduleToServer } from "../../../utils/dashboard/schedule";
import AccountSettings from "@/Layout/dashboard/account/AccountSettings";
import { fetchData } from "../../../utils/fetchData";
import Tabs from "@/Layout/dashboard/shared/Tabs";
import MobileTabs from "@/Layout/dashboard/shared/MobileTabs";
import { logOut } from "../../../utils/Auth";
import { tabs } from "../../../utils/dashboard/dashboard";
import { LogOut, Menu, PowerOff } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface tabsMobileProps {
  name: string;
  logo: string;
  inactiveLogo: string;
}

interface tabsProps {
  name: string;
  icon: LucideIcon;
}

const Page = () => {
  const { userId, active, schedule, completedDrugs } = useSelector(
    (state: RootState) => state.app
  );
  const dispatch = useDispatch();
  const [nav, setNav] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [allergiesForm, setAllergiesForm] = useState(false);
  const [drugsForm, setDrugsForm] = useState(false);
  const [profileForm, setProfileForm] = useState(false);
  const [drugHxForm, setDrugHxForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [allDoses, setAllDoses] = useState(false);
  const [screen, setScreen] = useState(false);
  const [tracker, setTracker] = useState("Today");
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [allergyModal, setAllergyModal] = useState(false);
  const router = useRouter();
  const [add, setAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accountSettings, setAccountSettings] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);

  useEffect(() => {
    if (!userId) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    dispatch(updateActive("Home"));

    if (userId) {
      fetchData(dispatch, userId, setIsLoading);
    }
  }, [userId]);

  const renderedTabs = tabs.map((item: tabsProps, index: number) => {
    return (
      <div key={index}>
        <Tabs item={item} active={active} nav={nav} />
      </div>
    );
  });

  const renderedTabsMobile = tabs.map(
    (item: tabsProps, index: number) => {
      return (
        <div key={index}>
          <MobileTabs item={item} active={active} />
        </div>
      );
    }
  );

  const today = new Date();
  const yesterday = new Date(today.getTime() - 86400000);
  const formattedToday = format(today, "yyyy-MM-dd");
  const formattedYesterday = format(yesterday, "yyyy-MM-dd");
  const todaysDose: ScheduleItem[] = schedule
    ?.filter((drug: ScheduleItem) => {
      return drug?.date === formattedToday;
    })
    .sort((a: ScheduleItem, b: ScheduleItem) => {
      const timeA = a.time;
      const timeB = b.time;

      if (timeA < timeB) {
        return -1;
      } else if (timeA > timeB) {
        return 1;
      } else {
        return 0;
      }
    });

  const yesterdaysDose = schedule
    ?.filter((drug: ScheduleItem) => {
      return drug?.date === formattedYesterday;
    })
    .sort((a: ScheduleItem, b: ScheduleItem) => {
      const timeA = a.time;
      const timeB = b.time;

      if (timeA < timeB) {
        return -1;
      } else if (timeA > timeB) {
        return 1;
      } else {
        return 0;
      }
    });

  async function updateCompleted(item: ScheduleItem) {
    try {
      const updatedSchedule = schedule.map((dose) => {
        if (
          dose.date === item.date &&
          dose.time === item.time &&
          dose.drug === item.drug
        ) {
          return {
            ...dose,
            completed: !dose.completed,
          };
        }
        return dose;
      });

      dispatch(updateSchedule(updatedSchedule));

      await uploadScheduleToServer({ userId, schedule: updatedSchedule });

      const uncompletedDosesCount = todaysDose.filter(
        (dose: ScheduleItem) => !dose.completed
      ).length;
    } catch (error) {
      toast.error("An error occurred! Check Internet connection");
      const previousSchedule = schedule.map((dose) => {
        if (
          dose.date === item.date &&
          dose.time === item.time &&
          dose.drug === item.drug
        ) {
          return {
            ...dose,
            completed: !dose.completed,
          };
        }
        return dose;
      });
      dispatch(updateSchedule(previousSchedule));
    }
  }

  const dosesToRender = (tracker === "Today" ? todaysDose : yesterdaysDose)
    ?.slice()
    .sort((a, b) => {
      // Sort based on completion status (completed doses come last)
      if (a.completed && !b.completed) {
        return 1;
      } else if (!a.completed && b.completed) {
        return -1;
      } else {
        // If both completed or both not completed, maintain the original order
        return 0;
      }
    })
    .map((item: ScheduleItem, index: number) => {
      const [hourString, minutes] = item.time.split(":");
      const hour = parseInt(hourString);

      let timeSuffix = "";
      if (hour < 12) {
        timeSuffix = "AM";
      } else {
        timeSuffix = "PM";
      }

      let convertedHour = hour;
      if (convertedHour > 12) {
        convertedHour -= 12;
      }

      const formattedTime = `${convertedHour}:${minutes}${timeSuffix}`;

      return (
        <div
          key={index}
          className="p-5 md:p-4 border border-gray-300 rounded-[10px] items-center  flex justify-between
          bg-white w-full font-Inter text-[14px]"
        >
          <div className="flex gap-3 text-navyBlue items-center ">
            <Image
              src="/assets/shell.png"
              width={512}
              height={512}
              alt="pill"
              className="w-10 h-10 "
            />
            <div className="flex flex-col gap-0 items-start">
              <p className="capitalize font-semibold w-[125px] ss:w-auto">
                {item.drug}
              </p>
              <p>{formattedTime}</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <h2 className="font-karla">Taken:</h2>
            <button
              className={`${
                !item.completed
                  ? "bg-none text-white"
                  : "bg-navyBlue text-white"
              } border-[1px] border-navyBlue px-1 py-1 rounded-full`}
              onClick={() => updateCompleted(item)}
            >
              <FaCheck className="text-[12px]" />
            </button>
          </div>
        </div>
      );
    });

  return (
    <Suspense fallback={<Loader />}>
      <Head>
        <title>NoDoseOff | DashBoard</title>
      </Head>
      {userId && (
        <section
          className={`flex relative w-full bg-white ${
            isLoading ? "opacity-0 h-0" : "opacity-100 h-[100dvh]"
          } transition-all`}
        >
          {/* Sidebar */}
          <div
            className={` ${!nav ? "" : "lg:w-[300px]"} w-[86px] bg-navyBlue py-10 pl-6 hidden font-karla md:flex flex-col justify-between relative transition-all duration-300`}
          >
            <div>
              <div className="flex gap-5 items-center mb-12 cursor-pointer h-[60.81px] justify-start">
                <Link href="/" className="flex lg:hidden">
                  <Image
                    src="/assets/logo/logo-white.png"
                    alt="logo"
                    width={1084}
                    height={257}
                    className={`w-8 h-auto `}
                    quality={100}
                  />
                </Link>

                <button
                  onClick={() => {
                    setNav(!nav);
                  }}
                >
                  <Menu className="size-6 lg:flex hidden text-white" />
                </button>
                <Link
                  href={"/"}
                  className={`w-[140px] h-auto ${nav ? "lg:flex hidden" : "hidden"}`}
                >
                  <Image
                    src="/assets/logo/logo with name png - white color.png"
                    alt="logo"
                    width={1084}
                    height={257}
                    quality={100}
                  />
                </Link>
              </div>
              <div className="flex flex-col gap-6">{renderedTabs}</div>
            </div>

            <button
              onClick={() => {
                logOut({ dispatch, router });
              }}
              className="flex items-center gap-6 font-Inter"
            >
              <LogOut className="text-white size-6"/>
              <p
                className={`text-[16px] text-white ${nav ? " hidden lg:flex" : "hidden"}`}
              >
                Logout
              </p>
            </button>
          </div>
          {/* Main Dashboard */}
          <div className="w-full">
            {active === "Home" ? (
              <Home
                setDrugsForm={setDrugsForm}
                isLoading={isLoading}
                setAllDoses={setAllDoses}
                tracker={tracker}
                setTracker={setTracker}
                dosesToRender={dosesToRender}
              />
            ) : active === "Drugs" ? (
              <Drugs
                screen={screen}
                setScreen={setScreen}
                setDrugsForm={setDrugsForm}
                setEditForm={setEditForm}
                setEditModal={setEditModal}
                setDeleteModal={setDeleteModal}
                deleteModal={deleteModal}
                editModal={editModal}
                allergyModal={allergyModal}
                setAllergyModal={setAllergyModal}
                add={add}
                setAdd={setAdd}
                editForm={editForm}
                drugsForm={drugsForm}
                allergiesForm={allergiesForm}
                setAllergiesForm={setAllergiesForm}
              />
            ) : (
              <Account
                setDrugHxForm={setDrugHxForm}
                setProfileForm={setProfileForm}
                setShowStats={setShowStats}
                setShowContact={setShowContact}
                setAccountSettings={setAccountSettings}
                setScreen={setScreen}
                setDeleteAccountModal={setDeleteAccountModal}
                deleteAccountModal={deleteAccountModal}
              />
            )}
          </div>
          {!isLoading && (
            <>
              <DrugsForm drugsForm={drugsForm} setDrugsForm={setDrugsForm} />
              <EditForm editForm={editForm} setEditForm={setEditForm} />
              <AllergiesForm
                allergiesForm={allergiesForm}
                setAllergiesForm={setAllergiesForm}
              />
              <ProfileForm
                setProfileForm={setProfileForm}
                profileForm={profileForm}
              />
              <Statistics setShowStats={setShowStats} showStats={showStats} />
              <Contact
                showContact={showContact}
                setShowContact={setShowContact}
              />
              <DrugHxForm
                drugHxForm={drugHxForm}
                setDrugHxForm={setDrugHxForm}
              />
              <AccountSettings
                accountSettings={accountSettings}
                setAccountSettings={setAccountSettings}
                setDeleteAccountModal={setDeleteAccountModal}
                setScreen={setScreen}
              />
            </>
          )}
          <AllDoses
            allDoses={allDoses}
            setAllDoses={setAllDoses}
            dosesToRender={dosesToRender}
          />
          <Screen
            setDeleteModal={setDeleteModal}
            setAllergyModal={setAllergyModal}
            setEditModal={setEditModal}
            setProfileForm={setProfileForm}
            setScreen={setScreen}
            setAdd={setAdd}
            screen={screen}
            setShowStats={setShowStats}
            setDeleteAccountModal={setDeleteAccountModal}
          />
          <div className="fixed w-full h-[64px] bg-white shadow bottom-0 flex justify-between items-center md:hidden px-4 ss:px-8 ss:pr-12">
            {renderedTabsMobile}
          </div>
        </section>
      )}
      {isLoading && (
        <div className="w-full">
          {" "}
          <Loader />
        </div>
      )}
    </Suspense>
  );
};

export default Page;
