import React from 'react'

interface ScreenProps {
  setModal: Function;
  setScreen: Function;
}

const Screen: React.FC<ScreenProps> = ({ setModal, setScreen }) => {
  return (
    <div className="fixed w-full h-full z-[3]">
      <div
        onClick={() => {
          setModal(false);
          setScreen(false)
        }}
        className="absolute w-full h-full bg-blackII opacity-[40] "
      />
    </div>
  );
};

export default Screen;
