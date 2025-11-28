/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import Screen from "@/Layout/dashboard/Screen";
import Account from "@/Layout/dashboard/account/Account";
import Contact from "@/Layout/dashboard/account/Contact";
import Statistics from "@/Layout/dashboard/account/Statistics";
import Drugs from "@/Layout/dashboard/drugs/drugs/Drugs";
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
import { Suspense, useEffect, useState, useRef } from "react"; // Added useRef
import { FaCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "../../../store";
import { updateActive, updateSchedule, updateUserId } from "../../../store/stateSlice";
import { ScheduleItem } from "../../../types/dashboard/dashboard";
import { uploadScheduleToServer } from "../../../utils/dashboard/schedule";
import AccountSettings from "@/Layout/dashboard/account/AccountSettings";
import { fetchData } from "../../../utils/fetchData";
import Tabs from "@/Layout/dashboard/shared/Tabs";
import MobileTabs from "@/Layout/dashboard/shared/MobileTabs";
import { tabs } from "../../../utils/dashboard/dashboard";
import { LogOut, Menu } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

interface tabsProps {
  name: string;
  icon: LucideIcon;
}

const Page = () => {
  // Use useAuth to get the true user state
  const { user, loading: authLoading, signOut } = useAuth(); 

  const { active, schedule } = useSelector((state: RootState) => state.app);
  
  const dispatch = useDispatch();
  const router = useRouter();
  
  // Local UI states
  const [nav, setNav] = useState(true);
  const [profileForm, setProfileForm] = useState(false);
  const [drugHxForm, setDrugHxForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [allDoses, setAllDoses] = useState(false);
  const [screen, setScreen] = useState(false);
  const [tracker, setTracker] = useState("Today");
  const [add, setAdd] = useState(false);
  const [activeAction, setActiveAction] = useState("")
  const [activeForm, setActiveForm] = useState('')
  
  // Loading state starts true to cover the initial auth check
  const [isLoading, setIsLoading] = useState(true); 
  const [accountSettings, setAccountSettings] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);

  // useRef to prevent double-fetching in React Strict Mode or rapid re-renders
  // This ensures we fetch exactly once per page load/refresh
  const hasFetchedData = useRef(false);

  // Set the initial active tab only once
  useEffect(() => {
    dispatch(updateActive("Home"));
  }, []); 

  // =========================================================
  // SMART DATA SYNC & AUTH LOGIC
  // =========================================================
  useEffect(() => {
    // 1. Wait for Auth to Initialize
    if (authLoading) return;

    // 2. No User? Redirect.
    if (!user) {
      router.push("/login");
      return;
    }

    // 3. User is present. Check if we have already fetched in this session.
    // On a page refresh, hasFetchedData.current will be false.
    if (user && !hasFetchedData.current) {
      
      const initializeDashboard = async () => {
        setIsLoading(true);
        try {
            // A. SYNC AUTH TO REDUX IMMEDIATELY
            // This ensures the ID is available in Redux for other components
            dispatch(updateUserId(user.id));
            
            // B. FETCH DATABASE DATA
            // Pass the user.id explicitly to ensure we fetch for the correct user
            await fetchData(dispatch, user.id, setIsLoading);
            
            // Mark as fetched so we don't loop
            hasFetchedData.current = true;
            
        } catch (error) {
            console.error("Dashboard initialization failed", error);
            toast.error("Could not load your data. Please refresh.");
        } finally {
            // Stop loading only when everything is done
            setIsLoading(false);
        }
      };

      initializeDashboard();
    }
  }, [user, authLoading, dispatch, router]); 
  // ^ Depending on 'user' ensures this runs as soon as useAuth resolves the user object.

  const handleSignOut = async () => {
    try {
        await signOut();
        dispatch(updateActive("Home")); 
        router.push('/login');
    } catch (error) {
        console.error('Error signing out:', error);
        toast.error('Failed to log out.');
    }
  }

  async function updateCompleted(item: ScheduleItem) {
    if (!user) {
      toast.error("Authentication required to update dose.");
      return;
    }
    
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
      await uploadScheduleToServer({ userId: user.id, schedule: updatedSchedule });

    } catch (error) {
      toast.error("Failed to update dose. Please check your network connection.");
      // Rollback logic...
      const previousSchedule = schedule.map((dose) => {
        if (
            dose.date === item.date &&
            dose.time === item.time &&
            dose.drug === item.drug
        ) {
            return { ...dose, completed: !dose.completed };
        }
        return dose;
      });
      dispatch(updateSchedule(previousSchedule));
    }
  }


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
      // Comparison logic
      const timeA = a.time;
      const timeB = b.time;
      return timeA < timeB ? -1 : timeA > timeB ? 1 : 0;
    });

  const yesterdaysDose = schedule
    ?.filter((drug: ScheduleItem) => {
      return drug?.date === formattedYesterday;
    })
    .sort((a: ScheduleItem, b: ScheduleItem) => {
       const timeA = a.time;
       const timeB = b.time;
       return timeA < timeB ? -1 : timeA > timeB ? 1 : 0;
    });


  const dosesToRender = (tracker === "Today" ? todaysDose : yesterdaysDose)
    ?.slice()
    .sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      else if (!a.completed && b.completed) return -1;
      else return 0;
    })
    .map((item: ScheduleItem, index: number) => {
      const [hourString, minutes] = item.time.split(":");
      const hour = parseInt(hourString);
      let timeSuffix = hour < 12 ? "AM" : "PM";
      let convertedHour = hour > 12 ? hour - 12 : hour;
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

  // Guard Clause: Block rendering until we are authenticated AND data is fetched
  // This prevents the UI from trying to read profile pictures that aren't loaded yet
  if (authLoading || isLoading) {
    return <Loader />;
  }

  return (
    <Suspense fallback={<Loader />}>
      <Head>
        <title>NoDoseOff | DashBoard</title>
      </Head>
      
      <section
        className={`flex relative w-full bg-white opacity-100 h-[100dvh] transition-all`}
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
                  src="/assets/logo/logo-with-name-white.png"
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
            onClick={handleSignOut}
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
              isLoading={isLoading} 
              setAllDoses={setAllDoses}
              tracker={tracker}
              setTracker={setTracker}
              dosesToRender={dosesToRender}
            />
          ) : active === "Drugs" ? (
            <Drugs
              setScreen={setScreen}
              setActiveForm={setActiveForm} 
              activeForm={activeForm}
              add={add}
              setAdd={setAdd}
              activeAction={activeAction}
              setActiveAction={setActiveAction}
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

        {/* DrugActionModals and Forms - Only rendered when not loading to ensure data exists */}
        {!isLoading && (
          <>
            <DrugsForm setActiveForm={setActiveForm} activeForm={activeForm} />
            <EditForm setActiveForm={setActiveForm} activeForm={activeForm} />
            <AllergiesForm
              setActiveForm={setActiveForm} activeForm={activeForm}
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
         setActiveAction={setActiveAction}
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
    </Suspense>
  );
};

export default Page;