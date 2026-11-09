import React, { Dispatch, SetStateAction } from "react";
import Home from "@/features/dashboard/HomeSections/Home";
import Drugs from "@/features/medications/drugs/Drugs";
import AiAssistant from "@/features/ai/AiAssistant";
import Account from "@/features/profile/Account";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { AnimatePresence, motion } from "framer-motion";

interface MainDashboardProps {
  activeTab: string;
  isLoading: boolean;
  setActiveModal: Dispatch<SetStateAction<string>>;
  tracker: string;
  setTracker: Dispatch<SetStateAction<string>>;
  activeModal: string;
  activeAction: string;
  setActiveAction: Dispatch<SetStateAction<string>>;
  add: boolean;
  setAdd: Dispatch<SetStateAction<boolean>>;
}

const MainDashboard: React.FC<MainDashboardProps> = ({
  activeTab,
  isLoading,
  tracker,
  setTracker,
  activeModal,
  activeAction,
  setActiveAction,
  add,
  setAdd,
  setActiveModal,
}) => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-soft-canvas">
      <AnimatePresence mode="wait">
        {activeTab === "Home" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            <ErrorBoundary label="home">
              <Home
                isLoading={isLoading}
                setActiveModal={setActiveModal}
                tracker={tracker}
                setTracker={setTracker}
                add={add}
                setAdd={setAdd}
                activeModal={activeModal}
              />
            </ErrorBoundary>
          </motion.div>
        ) : activeTab === "Drugs" ? (
          <motion.div
            key="drugs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            <ErrorBoundary label="drugs">
              <Drugs
                setActiveModal={setActiveModal}
                activeModal={activeModal}
                add={add}
                setAdd={setAdd}
                activeAction={activeAction}
                setActiveAction={setActiveAction}
              />
            </ErrorBoundary>
          </motion.div>
        ) : activeTab === "Account" ? (
          <motion.div
            key="account"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            <ErrorBoundary label="account">
              <Account setActiveModal={setActiveModal} />
            </ErrorBoundary>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Keep AI mounted so chat history stays in memory across tab switches */}
      <div
        className={`absolute inset-0 h-full w-full ${
          activeTab === "AMANDA 6" ||
          activeTab === "AMANDA" ||
          activeTab === "AI"
            ? "z-10"
            : "pointer-events-none invisible z-0"
        }`}
        aria-hidden={
          activeTab !== "AMANDA 6" &&
          activeTab !== "AMANDA" &&
          activeTab !== "AI"
        }
      >
        <ErrorBoundary label="ai">
          <AiAssistant />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default MainDashboard;
