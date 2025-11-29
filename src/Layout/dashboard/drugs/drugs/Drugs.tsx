/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use-client";
import React, {
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { generateDrugAllergyEmail } from "../../../../../emails/drugAllergy";
import { createClient } from "../../../../../lib/supabase/client";
import { RootState } from "../../../../../store";
import {
  setDrugs,
  updateAllergies,
  updateCompletedDrugs,
  updateSchedule,
} from "../../../../../store/stateSlice";
import { uploadScheduleToServer } from "../../../../../utils/dashboard/schedule";
import { sendMail } from "../../../../../utils/sendEmail";
import DrugActionModals from "../DrugActionModals";
import DrugDetails from "../drugDetails/DrugDetails";
import DrugsHeader from "./DrugsHeader";
import DrugsList from "./DrugsListContainer";
import DrugsTab from "./DrugsTab";
import FloatingAddActions from "./FloatingAddActions";


interface DrugsProps {
  add: boolean;
  setAdd: Dispatch<SetStateAction<boolean>>;
  setActiveModal: Dispatch<SetStateAction<string>>;
  activeModal: string;
  activeAction: string;
  setActiveAction: Dispatch<SetStateAction<string>>;
}

const Drugs: React.FC<DrugsProps> = ({
  add,
  setAdd,
  setActiveModal,
  activeModal,
  activeAction,
  setActiveAction,
}) => {
  const { drugs, completedDrugs, allergies, schedule, userId, info } =
    useSelector((state: RootState) => state.app);

  const [tab, setTab] = useState<string>("ongoing");
  const [activeView, setActiveView] = useState<"list" | "details">("list");
  const [options, setOptions] = useState(false);

  const dispatch = useDispatch();
  const supabase = createClient();

  const deleteOngoingDrug = async (drug: string): Promise<void> => {
    if (!drug) {
      toast.error("No drug selected");
      return;
    }


    try {
      await supabase.from("drugs").delete().eq("drug", drug);

      const updatedSchedule = schedule.filter((s) => s.drug !== drug);
      dispatch(updateSchedule(updatedSchedule));
      if (userId)
        await uploadScheduleToServer({ userId, schedule: updatedSchedule });

      dispatch(setDrugs(drugs.filter((d) => d.drug !== drug)));

      toast.success(`${drug.toUpperCase()} deleted`, { id: "delete-drug" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete drug", { id: "delete-drug" });
    }
  };

  const deleteCompletedDrug = async (drug: string): Promise<void> => {
    if (!drug) {
      toast.error("No drug selected");
      return;
    }


    try {
      const updated = completedDrugs.filter((d) => d.drug !== drug);
      dispatch(updateCompletedDrugs(updated));

      await supabase
        .from("completedDrugs")
        .update({ completedDrugs: updated })
        .eq("userId", userId);

      toast.success(`${drug.toUpperCase()} deleted`, {
        id: "delete-completed",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed", { id: "delete-completed" });
    }
  };

  const handleAllergies = async (drug: string): Promise<void> => {
  if (!drug) {
    toast.error("No drug selected");
    return;
  }

  // choose source list based on tab
  const sourceList = tab === "completed" ? completedDrugs : drugs;

  const target = sourceList.find(d => d.drug === drug);
  if (!target) {
    toast.error("Drug not found");
    return;
  }

  if (allergies.some(a => a.drug === drug)) {
    toast.error("Already an allergy");
    return;
  }


  try {
    // remove from ongoing or completed locally and on server
    if (tab === "ongoing") {
      await supabase.from("drugs").delete().eq("drug", drug).eq("userId", userId);
      dispatch(setDrugs(drugs.filter(d => d.drug !== drug)));
    } else if (tab === "completed") {
      await supabase.from("completedDrugs").delete().eq("drug", drug).eq("userId", userId);
      dispatch(updateCompletedDrugs(completedDrugs.filter(d => d.drug !== drug)));
    }

    // insert into allergies
    await supabase.from("allergies").insert({
      userId,
      drug,
      frequency: target.frequency || "",
      route: target.route || "",
      start: target.start || "",
      end: target.end || "",
      time: target.time || [""],
      reminder: true,
    });

    // update schedule
    const updatedSchedule = schedule.filter(s => s.drug !== drug);
    dispatch(updateSchedule(updatedSchedule));
    if (userId) {
      await uploadScheduleToServer({ userId, schedule: updatedSchedule });
    }

    // update allergies state
    dispatch(updateAllergies([...allergies, target]));

    toast.success(`${drug.toUpperCase()} marked as allergy`, {
      id: "allergy",
    });

    // notify user
    if (info?.[0]?.email) {
      const { html, subject } = generateDrugAllergyEmail(info[0].name, drug);
      sendMail(info[0].email, html, subject).catch(console.error);
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed", { id: "allergy" });
  }
};


  const deleteAllergy = async (drug: string): Promise<void> => {
    if (!drug) {
      toast.error("No allergy selected");
      return;
    }

    try {
      await supabase.from("allergies").delete().eq("drug", drug);
      dispatch(updateAllergies(allergies.filter((a) => a.drug !== drug)));

      toast.success(`${drug.toUpperCase()} deleted`, { id: "delete-allergy" });
    } catch (err) {
      console.error(err);
      toast.error("Failed", { id: "delete-allergy" });
    }
  };

  return (
    <div
      onClick={() => {
        setOptions(false);
      }}
      className="h-[100dvh] overflow-y-scroll w-full md:py-16 md:px-12 px-4 pt-10 ss:p-10 ss:pb-24 text-navyBlue font-karla relative"
    >
      {activeView === "list" ? (
        <>
          <DrugsHeader />
          <DrugsTab tab={tab} setTab={setTab} />
          <DrugsList
            tab={tab}
            options={options}
            setOptions={setOptions}
            activeAction={activeAction}
            setActiveAction={setActiveAction}
            setActiveView={setActiveView}
            activeView={activeView}
          />
          <FloatingAddActions
            add={add}
            setAdd={setAdd}
            activeModal={activeModal}
            setActiveModal={setActiveModal}
          />
        </>
      ) : (
        <DrugDetails
          activeView={activeView}
          setActiveView={setActiveView}
          tab={tab}
          options={options}
          setOptions={setOptions}
          setActiveModal={setActiveModal}
          activeAction={activeAction}
          setActiveAction={setActiveAction}
        />
      )}
      <DrugActionModals
        deleteOngoingDrug={deleteOngoingDrug}
        deleteCompletedDrug={deleteCompletedDrug}
        deleteAllergy={deleteAllergy}
        handleAllergies={handleAllergies}
        tab={tab}
        setActiveModal={setActiveModal}
        activeAction={activeAction}
        setActiveAction={setActiveAction}
        setActiveView={setActiveView}
      />
    </div>
  );
};

export default Drugs;
