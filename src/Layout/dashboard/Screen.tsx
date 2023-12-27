import React from 'react'

interface ScreenProps {
  setScreen: Function;
  setEditModal: Function;
  setDeleteModal: Function;
  setAdd: Function
}

const Screen: React.FC<ScreenProps> = ({ setEditModal, setDeleteModal, setScreen, setAdd }) => {
  return (
    <div className="fixed w-full h-full z-[3]">
      <div
        onClick={() => {
          setEditModal(false),
            setDeleteModal(false),
            setScreen(false),
            setAdd(false);
        }}
        className="absolute w-full h-full bg-blackII opacity-[40] "
      />
    </div>
  );
};

export default Screen;
