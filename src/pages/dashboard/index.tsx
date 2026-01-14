/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Loader from "@/components/dashboard/Loader";
import Head from "next/head";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import SideBar from "@/components/dashboard/SideBar";
import MobileSidebar from "@/components/dashboard/MobileSideBar";
import MainDashboard from "@/components/dashboard/MainDashboard";
import FormsContainer from "@/components/dashboard/FormsContainer";
import { useAppStore } from "@/store/useAppStore";
import { useDashboardData } from "@/hooks/useDashboardData";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

const Page = () => {
  // Use useAuth to get the true user state
  const { user, loading: authLoading, signOut } = useAuth();
  const { activeTab, setActiveTab, setIsAuthenticated, setUserId } =
    useAppStore((state) => state);
  const router = useRouter();

  // Local UI states
  const [tracker, setTracker] = useState("Today");
  const [add, setAdd] = useState(false);
  const [activeAction, setActiveAction] = useState("");
  const [nav, setNav] = useState(false);
  const [activeModal, setActiveModal] = useState("");

  const { isLoading: dashboardLoading, isError } = useDashboardData(user?.id);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    }
  }, [user, setUserId]);

  useEffect(() => {
    if (isError) {
      toast.error("Could not load your data. Please refresh.");
    }
  }, [isError]);

  const isLoading = authLoading || (user ? dashboardLoading : true);

  const handleSignOut = async () => {
    try {
      await signOut();
      setActiveTab("Home");
      router.push("/login");
      setIsAuthenticated(false);
      setUserId("");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to log out.");
    }
  };

  if (authLoading || isLoading) {
    return <Loader />;
  }

  return (
    <ThemeProvider>
      <Suspense fallback={<Loader />}>
        <Head>
          <title>NoDoseOff | DashBoard</title>
        </Head>
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`flex relative w-full bg-white dark:bg-slate-950 h-[100dvh] transition-colors duration-300 overflow-hidden`}
        >
          <div
            className={`bg-white dark:bg-slate-950 py-10 pl-6 hidden md:flex flex-col justify-between relative font-karla transition-all duration-300
              border-r border-gray-200 dark:border-slate-900 ${nav ? "md:w-[84px] lg:w-[300px]" : "w-[86px]"}`}
          >
            <SideBar
              activeTab={activeTab}
              handleSignOut={handleSignOut}
              nav={nav}
              setNav={setNav}
            />
          </div>
          {/* Main Dashboard */}
          <MainDashboard
            activeTab={activeTab}
            isLoading={isLoading}
            setActiveModal={setActiveModal}
            activeModal={activeModal}
            tracker={tracker}
            setTracker={setTracker}
            add={add}
            setAdd={setAdd}
            activeAction={activeAction}
            setActiveAction={setActiveAction}
          />
          <FormsContainer
            activeModal={activeModal}
            setActiveModal={setActiveModal}
          />
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:hidden z-40 w-[90%] max-w-[450px] px-4">
            <div className="w-full h-[64px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex justify-between items-center px-4 ss:px-8 ss:pr-12 rounded-xl shadow-lg">
              <MobileSidebar activeTab={activeTab} />
            </div>
          </div>
        </motion.section>
      </Suspense>
    </ThemeProvider>
  );
};

export default Page;
