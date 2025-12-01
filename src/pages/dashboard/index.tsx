/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Loader from "@/Layout/dashboard/shared/Loader";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react"; // Added useRef
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "../../../store";
import { updateActive, updateIsAuthenticated, updateUserId } from "../../../store/stateSlice";
import { fetchData } from "../../../utils/fetchData";
import { useAuth } from "../../../contexts/AuthContext";
import SideBar from "@/Layout/dashboard/shared/SideBar";
import MobileSidebar from "@/Layout/dashboard/shared/MobileSideBar";
import MainDashboard from "@/Layout/dashboard/MainDashboard";
import FormsContainer from "@/Layout/dashboard/shared/FormsContainer";

const Page = () => {
  // Use useAuth to get the true user state
  const { user, loading: authLoading, signOut } = useAuth();

  const { active } = useSelector((state: RootState) => state.app);

  const dispatch = useDispatch();
  const router = useRouter();

  // Local UI states
  const [tracker, setTracker] = useState("Today");
  const [add, setAdd] = useState(false);
  const [activeAction, setActiveAction] = useState("");
  const [nav, setNav] = useState(false);
  const [activeModal, setActiveModal] = useState("");

  // Loading state starts true to cover the initial auth check
  const [isLoading, setIsLoading] = useState(true);

  // useRef to prevent double-fetching in React Strict Mode or rapid re-renders
  // This ensures we fetch exactly once per page load/refresh
  const hasFetchedData = useRef(false);

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
      router.push("/login");
      dispatch(updateUserId(''));
      dispatch(updateIsAuthenticated(false));

    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to log out.");
    }
  };

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
          className={`bg-white py-10 pl-6 hidden md:flex flex-col justify-between relative font-karla transition-all duration-300
            border-r border-gray-200 ${nav ? "md:w-[84px] lg:w-[300px]" : "w-[86px]"}`}
        >
          <SideBar
            active={active}
            handleSignOut={handleSignOut}
            nav={nav}
            setNav={setNav}
          />
        </div>
        {/* Main Dashboard */}
        <MainDashboard
          active={active}
          isLoading={isLoading}
          setActiveModal={setActiveModal} // single state controlling all forms/modals
          activeModal={activeModal} // current active modal
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
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:hidden z-50 w-[90%] max-w-[450px] px-4">
          <div className="w-full h-[64px] bg-white border border-gray-200 flex justify-between items-center px-4 ss:px-8 ss:pr-12 rounded-xl shadow-lg">
            <MobileSidebar active={active} />
          </div>
        </div>
      </section>
    </Suspense>
  );
};

export default Page;
