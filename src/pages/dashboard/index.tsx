/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Loader from "@/components/dashboard/Loader";
import SeoHead from "@/components/seo/SeoHead";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import SideBar from "@/components/dashboard/SideBar";
import MobileSidebar from "@/components/dashboard/MobileSideBar";
import MainDashboard from "@/components/dashboard/MainDashboard";
import FormsContainer from "@/components/dashboard/FormsContainer";
import { useAppSelector, useAppDispatch } from "@/store";
import { setActiveTab, setIsAuthenticated, setUserId } from "@/store/appSlice";
import { useDashboardBootstrap } from "@/hooks/useDashboardData";
import { SoftErrorState } from "@/components/ui/soft";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { motion } from "framer-motion";
import AppMotion from "@/components/motion/AppMotion";
import { ndoEase, ndoSpring } from "@/components/landing/motion";

const Page = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { activeTab } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [tracker, setTracker] = useState("Today");
  const [add, setAdd] = useState(false);
  const [activeAction, setActiveAction] = useState("");
  const [nav, setNav] = useState(true);
  const [activeModal, setActiveModal] = useState("");

  const {
    isLoading: dashboardLoading,
    isError,
    error,
    refetch,
  } = useDashboardBootstrap(user?.id);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.id) {
      dispatch(setUserId(user.id));
    }
  }, [user, dispatch]);

  const isLoading = authLoading || (user ? dashboardLoading : true);

  const handleSignOut = async () => {
    try {
      await signOut();
      dispatch(setActiveTab("Home"));
      router.push("/login");
      dispatch(setIsAuthenticated(false));
      dispatch(setUserId(""));
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to log out.");
    }
  };

  if (authLoading || (isLoading && !isError)) {
    return <Loader />;
  }

  if (isError) {
    const profileMissing = error?.includes("User profile not found");
    return (
      <SoftErrorState
        title={profileMissing ? "Profile setup incomplete" : "Could not load your data"}
        description={
          profileMissing
            ? "Finish signup setup, then try again."
            : "Check your connection and retry."
        }
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <AppMotion>
      <SeoHead
        title="Dashboard"
        description="Your NoDoseOff dashboard for medications, dose tracking, and adherence."
        path="/dashboard"
        noIndex
      />
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: ndoEase }}
        className="relative flex h-[100dvh] w-full overflow-hidden bg-soft-canvas font-jakarta text-soft-ink"
      >
        <aside
          className={`relative hidden shrink-0 flex-col border-r border-black/[0.05] bg-white px-2.5 py-5 transition-all duration-300 md:flex ${
            nav ? "md:w-[88px] lg:w-[240px]" : "w-[88px]"
          }`}
        >
          <SideBar
            activeTab={activeTab}
            handleSignOut={handleSignOut}
            nav={nav}
            setNav={setNav}
          />
        </aside>

        <div className="relative min-w-0 flex-1 overflow-hidden bg-soft-canvas">
          <ErrorBoundary
            label="dashboard"
            onReset={() => dispatch(setActiveTab("Home"))}
          >
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
          </ErrorBoundary>
        </div>

        <ErrorBoundary
          label="forms"
          onReset={() => setActiveModal("")}
        >
          <FormsContainer
            activeModal={activeModal}
            setActiveModal={setActiveModal}
          />
        </ErrorBoundary>

        {/* Mobile / tablet dock */}
        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
        >
          <div className="pointer-events-auto mx-auto w-full max-w-[440px]">
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...ndoSpring, delay: 0.08 }}
              className="flex h-[68px] items-center rounded-[22px] border border-black/[0.06] bg-white/90 px-1.5 shadow-soft-float backdrop-blur-xl"
            >
              <MobileSidebar activeTab={activeTab} />
            </motion.div>
          </div>
        </div>
      </motion.section>
    </AppMotion>
  );
};

export default Page;
