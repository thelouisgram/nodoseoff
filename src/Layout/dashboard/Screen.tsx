import React from "react";
import ProfileForm from "./forms/ProfileForm";

interface ScreenProps {
  setScreen: Function;
  setEditModal: Function;
  setDeleteModal: Function;
  screen: boolean;
  setAdd: Function;
  setAllergyModal: Function;
  setProfileForm: Function;
  setShowStats: Function;
  setDeleteAccountModal: Function;
  
}

const Screen: React.FC<ScreenProps> = ({
  setEditModal,
  setDeleteModal,
  setScreen,
  setAdd,
  setAllergyModal,
  setProfileForm,
  setShowStats,
  setDeleteAccountModal,
  screen
}) => {
  const handleClose = () => {
    setEditModal(false);
    setDeleteModal(false);
    setAdd(false);
    setAllergyModal(false);
    setProfileForm(false);
    setShowStats(false);
    setScreen(false);
    setDeleteAccountModal(false);
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
