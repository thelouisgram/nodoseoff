import React from 'react'

interface ScreenProps {
  setScreen: Function;
  setEditModal: Function;
  setDeleteModal: Function;
}

const Screen: React.FC<ScreenProps> = ({ setEditModal, setDeleteModal, setScreen }) => {
  return (
    <div className="fixed w-full h-full z-[3]">
      <div
        onClick={() => {
          setEditModal(false), setDeleteModal(false), setScreen(false);
        }}
        className="absolute w-full h-full bg-blackII opacity-[40] "
      />
    </div>
  );
};

export default Screen;
