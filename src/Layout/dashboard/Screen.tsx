import React from "react";

interface ScreenProps {
  setScreen: Function;
  setEditModal: Function;
  setDeleteModal: Function;
  screen: boolean;
  setAdd: Function;
  setAllergyModal: Function;
  setProfileForm: Function;
  setShowStats: Function;
}

const Screen: React.FC<ScreenProps> = ({
  setEditModal,
  setDeleteModal,
  setScreen,
  setAdd,
  setAllergyModal,
  setProfileForm,
  setShowStats,
}) => {
  const handleClose = () => {
    setEditModal(false);
    setDeleteModal(false);
    setAdd(false);
    setAllergyModal(false);
    setProfileForm(false);
    setShowStats(false);
    setScreen(false);
  };

  return (
    <div className="fixed w-full h-full z-[3]">
      <div
        onClick={handleClose}
        className="absolute w-full h-full bg-grey opacity-[40]"
      />
    </div>
  );
};

export default Screen;
