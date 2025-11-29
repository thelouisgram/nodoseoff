import React from "react";

interface ScreenProps {
  setScreen: Function;
  screen: boolean;
  setAdd: Function;
 setActiveModal: (value: string) => void
  setActiveAction: (value:string) => void;
  activeModal: string;
}

const Screen: React.FC<ScreenProps> = ({
  setScreen,
  setAdd,
  setActiveAction,
 setActiveModal,
 activeModal,
  screen
}) => {
  const handleClose = () => {
    setAdd(false);
    setActiveModal("")
    setScreen(false);
    setActiveAction('')
  };

  return (
    <div
      onClick={handleClose}
      className={`${
        screen || activeModal !== ''
          ? " w-full h-full opacity-100"
          : "w-0 h-0 opacity-0"
      }   bg-grey fixed transition-opacity duration-500 right-0 bottom-0 z-[3]`}
    />
  );
};

export default Screen;
