import React from "react";
import Contact from "../../features/profile/Contact";
import AccountSettings from "../../features/profile/AccountSettings";
import ChangePassword from "../../features/profile/AccountSettings/ChangePassword";
import DrugHxForm from "../../features/profile/DrugHxForm";
import AllergiesForm from "../../features/forms/AllergiesForm";
import DrugsForm from "../../features/forms/DrugsForm";
import EditForm from "../../features/forms/EditForm";
import ProfileForm from "../../features/forms/ProfileForm";

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
