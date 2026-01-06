import React, { Dispatch, SetStateAction } from "react";
import Home from "@/features/dashboard/HomeSections/Home";
import Drugs from "@/features/medications/drugs/Drugs";
import Account from "@/features/profile/Account";
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
    <div className="w-full h-full overflow-hidden">
      <AnimatePresence mode="wait">
        {activeTab === "Home" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Home
              isLoading={isLoading}
              setActiveModal={setActiveModal}
              tracker={tracker}
              setTracker={setTracker}
            />
          </motion.div>
        ) : activeTab === "Drugs" ? (
          <motion.div
            key="drugs"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Drugs
              setActiveModal={setActiveModal}
              activeModal={activeModal}
              add={add}
              setAdd={setAdd}
              activeAction={activeAction}
              setActiveAction={setActiveAction}
            />
          </motion.div>
        ) : (
          <motion.div
            key="account"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Account setActiveModal={setActiveModal} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainDashboard;
