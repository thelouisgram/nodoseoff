import React from "react";
import Contact from "../account/Contact";
import AccountSettings from "../account/AccountSettings";
import ChangePassword from "../account/AccountSettings/ChangePassword";
import DrugHxForm from "../account/DrugHxForm";
import AllergiesForm from "../forms/AllergiesForm";
import DrugsForm from "../forms/DrugsForm";
import EditForm from "../forms/EditForm";
import ProfileForm from "../forms/ProfileForm";

interface FormContainerProps {
  activeModal: string;
  setActiveModal: (value: string) => void;
}

const FormsContainer: React.FC<FormContainerProps> = ({
  activeModal,
  setActiveModal,
 
}) => {
  return (
    <>
      <DrugsForm setActiveModal={setActiveModal} activeModal={activeModal} />
      <EditForm setActiveModal={setActiveModal} activeModal={activeModal} />
      <AllergiesForm
        setActiveModal={setActiveModal}
        activeModal={activeModal}
      />
      <ProfileForm setActiveModal={setActiveModal} activeModal={activeModal} />
      <Contact activeModal={activeModal} setActiveModal={setActiveModal} />
      <DrugHxForm activeModal={activeModal} setActiveModal={setActiveModal} />
      <AccountSettings
        activeModal={activeModal}
        setActiveModal={setActiveModal}
      />
      <ChangePassword
        activeModal={activeModal}
        setActiveModal={setActiveModal}
      />
    </>
  );
};

export default FormsContainer;
