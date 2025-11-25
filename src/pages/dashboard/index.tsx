/* eslint-disable react-hooks/exhaustive-deps */
import Screen from "@/Layout/dashboard/Screen";
import Account from "@/Layout/dashboard/account/Account";
import Contact from "@/Layout/dashboard/account/Contact";
import Statistics from "@/Layout/dashboard/account/Statistics";
import Drugs from "@/Layout/dashboard/drugs/Drugs";
import AllergiesForm from "@/Layout/dashboard/forms/AllergiesForm";
import DrugHxForm from "@/Layout/dashboard/forms/DrugHxForm";
import DrugsForm from "@/Layout/dashboard/forms/DrugsForm";
import EditForm from "@/Layout/dashboard/forms/EditForm";
import EffectsForm from "@/Layout/dashboard/forms/EffectsForm";
import ProfileForm from "@/Layout/dashboard/forms/ProfileForm";
import AllDoses from "@/Layout/dashboard/home/AllDoses";
import Home from "@/Layout/dashboard/home/Home";
import Loader from "@/Layout/dashboard/shared/Loader";
import { format } from "date-fns";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "../../../store";
import {
  setDrugs,
  setEffects,
  updateActive,
  updateAllergies,
  updateCompletedDrugs,
  updateInfo,
  updateProfilePicture,
  updateSchedule,
  updateUserId,
} from "../../../store/stateSlice";
import { DrugProps, ScheduleItem } from "../../../types/dashboard";
import { uploadScheduleToServer } from "../../../utils/schedule";
import supabase from "../../../utils/supabase";
import { tabs, tabsMobile } from "./../../../utils/dashboard";
import AccountSettings from "@/Layout/dashboard/account/AccountSettings";

interface tabsMobileProps {
  name: string;
  logo: string;
  inactiveLogo: string;
}

interface tabsProps {
  name: string;
  logo: string;
}

const Page = () => {
  const { userId, active, schedule, completedDrugs } = useSelector(
    (state: RootState) => state.app
  );
  const dispatch = useDispatch();
  const [nav, setNav] = useState(true);
  const [effectsForm, setEffectsForm] = useState(false);
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

    const fetchData = async () => {
      try {
        const [
          userData,
          profilePictureData,
          drugsData,
          completedDrugsData,
          effectsData,
          allergiesData,
          scheduleData,
        ] = await Promise.all([
          supabase
            .from("users")
            .select("name, phone, email, otcDrugs, herbs")
            .eq("userId", userId),
          supabase.storage
            .from("profile-picture")
            .list(userId + "/", { limit: 1, offset: 0 }),
          supabase.from("drugs").select("*").eq("userId", userId),
          supabase.from("users").select("completedDrugs").eq("userId", userId),
          supabase.from("effects").select("*").eq("userId", userId),
          supabase.from("allergies").select("*").eq("userId", userId),
          supabase.from("users").select("schedule").eq("userId", userId),
        ]);

        if (
          userData.error ||
          profilePictureData.error ||
          drugsData.error ||
          completedDrugsData.error ||
          effectsData.error ||
          allergiesData.error ||
          scheduleData.error
        ) {
          throw new Error("Error fetching data");
        }

        // Ensure user info is dispatched properly
        const userInfo = userData.data?.[0] ?? {};
        dispatch(updateInfo([userInfo]));

        // Profile picture update
        const profilePicture = profilePictureData.data?.[0]?.name ?? "";
        dispatch(updateProfilePicture(profilePicture));

        // Ensure completedDrugsData is loaded
        const completedDrugs =
          completedDrugsData.data?.[0]?.completedDrugs ?? [];
        dispatch(updateCompletedDrugs(completedDrugs));

        // Wait for drugs to load before proceeding
        if (!drugsData.data) return;

        const drugs = drugsData.data;
        const currentDate = new Date();
        const twoDaysPastDate = new Date();
        twoDaysPastDate.setDate(currentDate.getDate() - 2);

        // Filter active and expired drugs
        const activeDrugs = drugs.filter(
          (drug) => new Date(drug.end) > twoDaysPastDate
        );
        const expiredDrugs = drugs.filter(
          (drug) => new Date(drug.end) <= twoDaysPastDate
        );

        // Combine expired drugs with existing completed drugs
        const updatedCompletedDrugs = [...completedDrugs, ...expiredDrugs];

        console.log("Updated Completed Drugs:", updatedCompletedDrugs);

        // Dispatch the updated data
        dispatch(setDrugs(activeDrugs));
        dispatch(updateCompletedDrugs(updatedCompletedDrugs));

        // Update completed drugs in database asynchronously
        await supabase
          .from("users")
          .update({ completedDrugs: updatedCompletedDrugs })
          .eq("userId", userId);

        // Delete expired drugs from the database
        if (expiredDrugs.length > 0) {
          await Promise.all(
            expiredDrugs.map(async (drug) => {
              await supabase.from("drugs").delete().eq("drug", drug.drug);
            })
          );
        }

        // Update effects and allergies
        dispatch(setEffects(effectsData.data ?? []));
        dispatch(updateAllergies(allergiesData.data ?? []));

        // Ensure schedule is updated
        dispatch(updateSchedule(scheduleData?.data?.[0]?.schedule ?? []));

          setIsLoading(false);
      } catch (error) {
        toast.error("Error fetching data");
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const renderedTabs = tabs.map((item: tabsProps, index: number) => {
    return (
      <button
        key={index}
        onClick={() => dispatch(updateActive(item.name))}
        className={`
    flex items-center lg:gap-3 cursor-pointer h-10 lg:px-3 w-10 lg:w-auto max-lg:justify-center
    transition-all font-Inter rounded-full
    ${item.name === active ? "ring-1 ring-white lg:ring-0" : ""}
  `}
      >
        <Image
          src={item.logo}
          width={512}
          height={512}
          className="w-6 h-6"
          alt={item.name}
          quality={100}
        />

        {/* TEXT — only visible on lg */}
        <span
          className={`
       items-center text-[16px] rounded-md py-1 px-3
      ${nav ? "hidden lg:flex" : "hidden"}
      ${
        item.name === active
          ? "bg-white text-[#062863] font-medium"
          : "text-white"
      }
    `}
        >
          {item.name}
        </span>
      </button>
    );
  });

  const logOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error signing out");
      }
      router.push("/login");
      dispatch(updateUserId(""));
      dispatch(updateSchedule([]));
      dispatch(setDrugs([]));
    } catch (error) {
      toast.error("Error signing out: " + error);
    }
  };

  const renderedTabsMobile = tabsMobile.map(
    (item: tabsMobileProps, index: number) => {
      return (
        <div
          onClick={() => dispatch(updateActive(item.name))}
          key={index}
          className="flex items-center flex-col cursor-pointer w-full h-full justify-center relative font-Inter "
        >
          <Image
            src={active === item.name ? item.logo : item.inactiveLogo}
            width={1000}
            height={1000}
            className="w-[24px] h-[24px] transition"
            alt={item.name}
            quality={100}
          />
          <h2
            className={`${
              active === item.name
                ? "font-semibold"
                : "font-normal text-[#a7a7a7]"
            } text-[12px] text-[#062863]`}
          >
            {item.name}
          </h2>
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
                <Image
                  onClick={() => {
                    setNav(!nav);
                  }}
                  src="/assets/desktop-dashboard/menu.png"
                  width={512}
                  height={512}
                  className="size-6 lg:flex hidden"
                  alt="menu"
                  priority
                />
                <Link href={"/"}
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
              onClick={logOut}
              className="flex items-center gap-6 font-Inter"
            >
              <Image
                src="/assets/desktop-dashboard/power-off.png"
                width={512}
                height={512}
                className="w-[24px] h-[24px]"
                alt="menu"
                quality={100}
              />
              <p
                className={`text-[16px] text-white ${nav ? " hidden lg:flex" : "hidden"}`}
              >
                Logout
              </p>
            </button>
          </div>
          <div className="w-full">
            {active === "Home" ? (
              <Home
                setEffectsForm={setEffectsForm}
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
                setEffectsForm={setEffectsForm}
                editForm={editForm}
                drugsForm={drugsForm}
                effectsForm={effectsForm}
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
              <EffectsForm
                effectsForm={effectsForm}
                setEffectsForm={setEffectsForm}
              />
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
