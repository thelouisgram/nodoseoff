import React, { Dispatch,
  SetStateAction,} from "react";
import Home from "./home/HomeSections/Home";
import Drugs from "./drugs/drugs/Drugs";
import Account from "./account/Account";

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
    <div className="w-full">
      {activeTab === "Home" ? (
        <Home
          isLoading={isLoading}
          setActiveModal={setActiveModal}
          tracker={tracker}
          setTracker={setTracker}
        />
      ) : activeTab === "Drugs" ? (
        <Drugs
          setActiveModal={setActiveModal}
          activeModal={activeModal}
          add={add}
          setAdd={setAdd}
          activeAction={activeAction}
          setActiveAction={setActiveAction}
        />
      ) : (
        <Account
          setActiveModal={setActiveModal}
        />
      )}
    </div>
  );
};

export default MainDashboard;
