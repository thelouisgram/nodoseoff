import React from "react";
import ProfileForm from "./forms/ProfileForm";

interface ScreenProps {
  setScreen: Function;
  screen: boolean;
  setAdd: Function;
  setProfileForm: Function;
  setShowStats: Function;
  setDeleteAccountModal: Function;
  setActiveAction: (value:string) => void;
}

const Screen: React.FC<ScreenProps> = ({
  setScreen,
  setAdd,
  setActiveAction,
  setProfileForm,
  setShowStats,
  setDeleteAccountModal,
  screen
}) => {
  const handleClose = () => {
    setAdd(false);
    setProfileForm(false);
    setShowStats(false);
    setScreen(false);
    setDeleteAccountModal(false);
    setActiveAction('')
  };

  return (
    <div
      onClick={handleClose}
      className={`${
        screen
          ? " w-full h-full opacity-100"
          : "w-0 h-0 opacity-0"
      }   bg-grey fixed transition-opacity duration-500 right-0 bottom-0 z-[3]`}
    />
  );
};

export default Screen;
