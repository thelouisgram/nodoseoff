/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use-client";
import React, {
  useEffect,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "../../../../../store";
import {
  setDrugs,
  updateAllergies,
  updateCompletedDrugs,
  updateSchedule,
} from "../../../../../store/stateSlice";
import { ScheduleItem } from "../../../../../types/dashboard/dashboard";
import { uploadScheduleToServer } from "../../../../../utils/dashboard/schedule";
import { createClient } from "../../../../../lib/supabase/client";
import DrugDetails from "../drugDetails/DrugDetails";
import { generateDrugAllergyEmail } from "../../../../../emails/drugAllergy";
import { sendMail } from "../../../../../utils/sendEmail";
import DrugActionModals from "../DrugActionModals";
import FloatingAddActions from "./FloatingAddActions";
import DrugsHeader from "./DrugsHeader";
import DrugsTab from "./DrugsTab";
import DrugsList from "./DrugsListContainer";

type RefObject<T> = React.RefObject<T>;

interface DrugsProps {
  setScreen: Dispatch<SetStateAction<boolean>>;
  add: boolean;
  setAdd: Dispatch<SetStateAction<boolean>>;
  setActiveForm: Dispatch<SetStateAction<string>>;
  activeForm: string;
  activeAction: string;
  setActiveAction: Dispatch<SetStateAction<string>>;
}

const Drugs: React.FC<DrugsProps> = ({
  setScreen,
  add,
  setAdd,
  setActiveForm,
  activeForm,
  activeAction,
  setActiveAction,
}) => {
  const { drugs, completedDrugs, allergies, schedule, userId, info } =
    useSelector((state: RootState) => state.app);

  const [tab, setTab] = useState<string>("ongoing");
  const [activeView, setActiveView] = useState<"list" | "details">("list");
  const [options, setOptions] = useState(false);

  const dispatch = useDispatch();
  const dropdownRef: RefObject<HTMLDivElement> = useRef(null);
  const supabase = createClient();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setScreen(false);
        setActiveAction("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const removeDrugFromSchedule = (drug: string): ScheduleItem[] => {
    const updated = schedule.filter((s) => s.drug !== drug);
    dispatch(updateSchedule(updated));
    if (userId) uploadScheduleToServer({ userId, schedule: updated });
    return updated;
  };

  const deleteOngoingDrug = async (drug: string): Promise<void> => {
    if (!drug) {
      toast.error("No drug selected");
      return;
    }

    toast.loading("Deleting drug...", { id: "delete-drug" });

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

    toast.loading("Deleting completed drug...", { id: "delete-completed" });

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

    const target = drugs.find((d) => d.drug === drug);
    if (!target) {
      toast.error("Drug not found");
      return;
    }

    if (allergies.some((a) => a.drug === drug)) {
      toast.error("Already an allergy");
      return;
    }

    toast.loading("Marking allergy...", { id: "allergy" });

    try {
      await supabase.from("drugs").delete().eq("drug", drug);

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

      const updatedSchedule = schedule.filter((s) => s.drug !== drug);
      dispatch(updateSchedule(updatedSchedule));
      if (userId)
        await uploadScheduleToServer({ userId, schedule: updatedSchedule });

      dispatch(setDrugs(drugs.filter((d) => d.drug !== drug)));
      dispatch(updateAllergies([...allergies, target]));

      toast.success(`${drug.toUpperCase()} marked as allergy`, {
        id: "allergy",
      });

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

    toast.loading("Deleting allergy...", { id: "delete-allergy" });

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
      className="h-[100dvh] overflow-y-scroll w-full md:py-16 md:px-12 px-4 pt-10 pb-48 ss:p-10 ss:pb-24  mb-28 text-navyBlue font-karla relative"
    >
      {activeView === "list" ? (
        <>
          <DrugsHeader />
          <DrugsTab tab={tab} setTab={setTab} />
          <DrugsList
            tab={tab}
            options={options}
            setOptions={setOptions}
            setScreen={setScreen}
            dropdownRef={dropdownRef}
            activeAction={activeAction}
            setActiveAction={setActiveAction}
            setActiveView={setActiveView}
            activeView={activeView}
          />
          <FloatingAddActions
            add={add}
            setAdd={setAdd}
            activeForm={activeForm}
            setScreen={setScreen}
            setActiveForm={setActiveForm}
          />
        </>
      ) : (
        <DrugDetails
          activeView={activeView}
          setActiveView={setActiveView}
          setScreen={setScreen}
          tab={tab}
          options={options}
          setOptions={setOptions}
          setActiveForm={setActiveForm}
          activeAction={activeAction}
          setActiveAction={setActiveAction}
        />
      )}

      <DrugActionModals
        setScreen={setScreen}
        dropdownRef={dropdownRef}
        deleteOngoingDrug={deleteOngoingDrug}
        deleteCompletedDrug={deleteCompletedDrug}
        deleteAllergy={deleteAllergy}
        handleAllergies={handleAllergies}
        tab={tab}
        setActiveForm={setActiveForm}
        activeAction={activeAction}
        setActiveAction={setActiveAction}
        setActiveView={setActiveView}
      />
    </div>
  );
};

export default Drugs;
