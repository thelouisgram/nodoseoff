/* eslint-disable react-hooks/exhaustive-deps */
import Screen from "@/Layout/dashboard/Screen";
import Tips from "@/Layout/dashboard/Tips/Tips";
import Account from "@/Layout/dashboard/account/Account";
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
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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
  updateSchedule,
  updateUserId,
} from "../../../store/stateSlice";
import { DrugProps, ScheduleItem } from "../../../types/dashboard";
import { uploadScheduleToServer } from "../../../utils/schedule";
import supabase from "../../../utils/supabaseClient";
import { tabs, tabsMobile } from "./../../../utils/dashboard";
import Confetti from "react-confetti";

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
  const { userId, active, schedule, confetti } = useSelector(
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
  const [allDoses, setAllDoses] = useState(false);
  const [screen, setScreen] = useState(false);
  const [tracker, setTracker] = useState("Today");
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [allergyModal, setAllergyModal] = useState(false);
  const router = useRouter();
  const [add, setAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      router.push("/signIn");
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    const getInfo = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("name, phone, role, email, otcDrugs, herbs")
          .eq("userId", userId);
        if (error) {
          console.error("error:", error);
        } else if (data !== null) {
          dispatch(updateInfo([...data]));
        }
      } catch (error) {}
    };
    const getDrug = async () => {
      try {
        const { data, error } = await supabase
          .from("drugs")
          .select("*")
          .eq("userId", userId);
        if (error) {
          console.error("error:", error);
        } else if (data !== null) {
          dispatch(setDrugs(data));
        }
      } catch (error) {}
    };
    const getCompletedDrugs = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("completedDrugs")
          .eq("userId", userId);
        if (error) {
          console.error("error:", error);
        } else if (data !== null) {
          const transformedData = data?.map((item) => [...item.completedDrugs]);
          const flattenedData = transformedData?.flatMap(
            (innerArray: DrugProps[]) => innerArray
          );
          dispatch(updateCompletedDrugs(flattenedData));
        }
      } catch (error) {}
    };
    const getEffects = async () => {
      try {
        const { data, error } = await supabase
          .from("effects")
          .select("*")
          .eq("userId", userId);
        if (error) {
          console.error("error:", error);
        } else if (data !== null) {
          dispatch(setEffects(data));
        }
      } catch (error) {}
    };
    const getAllergies = async () => {
      try {
        const { data, error } = await supabase
          .from("allergies")
          .select("*")
          .eq("userId", userId);
        if (error) {
          console.error("error:", error);
        } else if (data !== null) {
          dispatch(updateAllergies(data));
        }
      } catch (error) {}
    };
    const getSchedule = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("schedule")
          .eq("userId", userId);
        if (error) {
          console.error("error:", error);
        }
        const transformedData = data?.map((item) => [...item.schedule]);
        const flattenedData =
          transformedData?.flatMap(
            (innerArray: ScheduleItem[]) => innerArray
          ) ?? []; // Provide an empty array as a default value if transformedData is undefined

        dispatch(updateSchedule(flattenedData));
      } catch (error) {}
    };

    if (userId) {
      getInfo();
      getDrug();
      getEffects();
      getAllergies();
      getSchedule();
      getCompletedDrugs();
    }
  }, [userId]);

  const renderedTabs = tabs.map((item: tabsProps, index: number) => {
    return (
      <button
        onClick={() => dispatch(updateActive(item.name))}
        key={index}
        className={` ${
          item.name === active && nav ? "pl-3" : ""
        } flex items-center gap-6 cursor-pointer h-[40px] transition-all`}
      >
        <Image
          src={item.logo}
          width={512}
          height={512}
          className="w-[24px] h-[24px]"
          alt={item.name}
          quality={100}
        />
        <div
          className={` ${
            nav ? "flex" : "hidden"
          } text-[16px]  rounded-[8px] py-1   
        ${
          active === item.name
            ? "bg-white text-[#062863] font-[500] w-[100px] pl-4"
            : "bg-none text-white font-normal w-auto"
        }`}
        >
          {item.name}
        </div>
      </button>
    );
  });

  const logOut = async () => {
    try {
      toast.loading("Signing Out");
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error signing out");
      }
      router.push("/signIn");
      dispatch(updateUserId(""));
      toast.success("Signed Out");
      dispatch(updateSchedule([]));
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
          className="flex items-center flex-col cursor-pointer h-full justify-center relative font-Karla"
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
    const updatedSchedule = schedule.map((dose) => {
      if (
        dose.date === item.date &&
        dose.time === item.time &&
        dose.drug === item.drug
      ) {
        // Create a new object to update completed property
        return {
          ...dose,
          completed: !dose.completed,
        };
      }
      return dose;
    });

    try {
      // Upload schedule to the server
      await uploadScheduleToServer({ userId, schedule: updatedSchedule });
      // If upload is successful, dispatch the updated schedule to Redux state
      dispatch(updateSchedule(updatedSchedule));
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle the error (e.g., show error message)
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
            <h2 className="font-montserrant">Taken:</h2>
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
    <>
      {!isLoading && userId ? (
        <section className="flex max-h-[100dvh] relative w-full bg-white">
          {confetti && (
            <div className="z-[2000]">
              <Confetti
                numberOfPieces={200}
              />
            </div>
          )}
          <div
            className={`${
              !nav ? "w-[86px]" : "w-[300px]"
            } max-h-[100dvh] bg-navyBlue py-10 pl-6 hidden font-montserrant md:flex flex-col justify-between relative transition-all duration-300`}
          >
            <div>
              <div className="flex gap-5 items-center mb-12 cursor-pointer h-[60.81px]">
                <Image
                  onClick={() => {
                    setNav(!nav);
                  }}
                  src="/assets/desktop-dashboard/menu.png"
                  width={512}
                  height={512}
                  className="w-[24px] h-[24px]"
                  alt="menu"
                  quality={100}
                />
                <Link href={"/"}>
                  <Image
                    src="/assets/pill perfect png2.png"
                    alt="logo"
                    width={4672}
                    height={1920}
                    className={`w-[148px] h-auto ${nav ? "flex" : "hidden"}`}
                    quality={100}
                  />
                </Link>
              </div>
              <div className="flex flex-col gap-6">{renderedTabs}</div>
            </div>

            <button onClick={logOut} className="flex items-center gap-6">
              <Image
                src="/assets/desktop-dashboard/power-off.png"
                width={512}
                height={512}
                className="w-[24px] h-[24px]"
                alt="menu"
                quality={100}
              />
              <p
                className={`text-[16px] text-white ${nav ? "flex" : "hidden"}`}
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
            ) : active === "Tips" ? (
              <Tips />
            ) : (
              <Account
                setDrugHxForm={setDrugHxForm}
                setProfileForm={setProfileForm}
                setShowStats={setShowStats}
              />
            )}
          </div>

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
          <DrugHxForm drugHxForm={drugHxForm} setDrugHxForm={setDrugHxForm} />
          <AllDoses
            allDoses={allDoses}
            setAllDoses={setAllDoses}
            dosesToRender={dosesToRender}
          />
          {screen && (
            <Screen
              setDeleteModal={setDeleteModal}
              setAllergyModal={setAllergyModal}
              setEditModal={setEditModal}
              setProfileForm={setProfileForm}
              setScreen={setScreen}
              setAdd={setAdd}
              screen={screen}
              setShowStats={setShowStats}
            />
          )}
          <div className="fixed w-full h-[64px] bg-white shadow bottom-0 flex justify-between items-center md:hidden px-4 ss:px-8 ss:pr-12">
            {renderedTabsMobile}
          </div>
        </section>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Page;
