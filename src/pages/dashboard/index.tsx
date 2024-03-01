/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { tabs, tabsMobile } from "./../../../utils/dashboard";
import Home from "@/Layout/dashboard/home/Home";
import EffectsForm from "@/Layout/dashboard/forms/EffectsForm";
import DrugsForm from "@/Layout/dashboard/forms/DrugsForm";
import Drugs from "@/Layout/dashboard/drugs/Drugs";
import Screen from "@/Layout/dashboard/Screen";
import EditForm from "@/Layout/dashboard/forms/EditForm";
import Account from "@/Layout/dashboard/account/Account";
import Link from "next/link";
import supabase from "../../../utils/supabaseClient";
import { useRouter } from "next/router";
import { toast } from "sonner";
import {
  setDrugs,
  setEffects,
  updateAllergies,
  updateInfo,
  updateSchedule,
  updateUserId,
  updateActive,
  updateCompletedDrugs,
} from "../../../store/stateSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import Search from "@/Layout/dashboard/search/Search";
import AllergiesForm from "@/Layout/dashboard/forms/AllergiesForm";
import Loader from "@/Layout/dashboard/shared/Loader";

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
  const { userId, active } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  const [nav, setNav] = useState(true);
  const [effectsForm, setEffectsForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [allergiesForm, setAllergiesForm] = useState(false);
  const [drugsForm, setDrugsForm] = useState(false);
  const [screen, setScreen] = useState(false);
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
          .select("name, phone, role, email")
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
            (innerArray: any) => innerArray
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
          .select("drug")
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
        const flattenedData = transformedData?.flatMap(
          (innerArray: any) => innerArray
        );
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
          } text-[16px] rounded-bl-none rounded-[8px] py-1   
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

  return (
    <>
      {!isLoading && userId ? (
        <section className="flex max-h-[100dvh] relative w-full bg-white">
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
            ) : active === "Search" ? (
              <Search />
            ) : (
              <Account />
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
          {screen && (
            <Screen
              setDeleteModal={setDeleteModal}
              setAllergyModal={setAllergyModal}
              setEditModal={setEditModal}
              setScreen={setScreen}
              setAdd={setAdd}
              screen={screen}
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
