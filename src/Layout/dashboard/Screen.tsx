import React from "react";

interface ScreenProps {
  setScreen: Function;
  setEditModal: Function;
  setDeleteModal: Function;
  screen: boolean;
  setAdd: Function;
  setAllergyModal: Function;
}

const Screen: React.FC<ScreenProps> = ({
  setEditModal,
  setDeleteModal,
  setScreen,
  setAdd,
  setAllergyModal,
}) => {
  const handleClose = () => {
    setEditModal(false);
    setDeleteModal(false);
    setScreen(false);
    setAdd(false);
    setAllergyModal(false);
  };

  return (
    <div className="fixed w-full h-full z-[3]">
      <div
        onClick={handleClose}
        className="absolute w-full h-full bg-blackII opacity-[40]"
      />
    </div>
  );
};

export default Screen;
