/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useRef,
} from "react";

import { toast } from "sonner";
import {
  useDrugs,
  useCompletedDrugs,
  useAllergies,
  useSchedule,
  useUserInfo,
  useDeleteDrugMutation,
  useDeleteCompletedDrugMutation,
  useDeleteAllergyMutation,
  useMarkAsAllergyMutation,
} from "@/hooks/useDashboardData";
import DrugActionModals from "../DrugActionModals";
import DrugDetails from "../drugDetails/DrugDetails";
import DrugsHeader from "./DrugsHeader";
import DrugsList from "./DrugsListContainer";
import DrugsTab from "./DrugsTab";
import FloatingAddActions from "./FloatingAddActions";
import { useAppSelector } from "@/store";
import { AnimatePresence, motion } from "framer-motion";
import { useDashboardSectionMotion } from "@/components/landing/motion";
import { sameDrugName } from "@/utils/drugs";

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
  /* Redux Replacement with React Query Hooks */
  const { userId } = useAppSelector((state) => state.app);

  const { data: drugs = [] } = useDrugs(userId);
  const { data: completedDrugs = [] } = useCompletedDrugs(userId);
  const { data: allergies = [] } = useAllergies(userId);
  const { data: schedule = [] } = useSchedule(userId);
  const { data: info = [] } = useUserInfo(userId);

  const [tab, setTab] = useState<string>("ongoing");
  const [activeView, setActiveView] = useState<"list" | "details">("list");
  const [options, setOptions] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const { panel } = useDashboardSectionMotion();

  const deleteDrugMutation = useDeleteDrugMutation();
  const deleteCompletedDrugMutation = useDeleteCompletedDrugMutation();
  const deleteAllergyMutation = useDeleteAllergyMutation();
  const markAsAllergyMutation = useMarkAsAllergyMutation();

  /* ----------------------------------------
     Scroll to top when activeView changes
  ----------------------------------------- */
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeView]);

  const deleteOngoingDrug = async (drug: string): Promise<void> => {
    if (!drug) {
      toast.error("No drug selected");
      return;
    }

    try {
      await deleteDrugMutation.mutateAsync({ userId: userId!, drug });
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
      await deleteCompletedDrugMutation.mutateAsync({ userId: userId!, drug });
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

    const sourceList = tab === "completed" ? completedDrugs : drugs;
    const target = sourceList.find((d) => d.drug === drug);
    if (!target) {
      toast.error("Drug not found");
      return;
    }

    if (allergies.some((a) => sameDrugName(a.drug, drug))) {
      toast.error("Already an allergy");
      return;
    }

    try {
      await markAsAllergyMutation.mutateAsync({
        userId: userId!,
        drug,
        tab,
        target,
        userInfo: {
          name: info[0]?.name || "",
          email: info[0]?.email || "",
        },
      });

      toast.success(`${drug.toUpperCase()} marked as allergy`, {
        id: "allergy",
      });
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
      await deleteAllergyMutation.mutateAsync({ userId: userId!, drug });
      toast.success(`${drug.toUpperCase()} deleted`, { id: "delete-allergy" });
    } catch (err) {
      console.error(err);
      toast.error("Failed", { id: "delete-allergy" });
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={() => {
        setOptions(false);
      }}
      className="relative h-[100dvh] w-full overflow-y-scroll bg-soft-canvas px-4 pb-24 pt-10 font-jakarta text-soft-ink ss:px-8 md:px-12 md:py-14 md:pb-20"
    >
      <AnimatePresence mode="wait">
        {activeView === "list" ? (
          <motion.div
            key="list"
            initial={panel.initial}
            animate={panel.animate}
            exit={panel.exit}
            transition={panel.transition}
          >
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
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={panel.initial}
            animate={panel.animate}
            exit={panel.exit}
            transition={panel.transition}
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Outside panel motion so fixed positioning isn’t warped by transforms */}
      {activeView === "list" ? (
        <FloatingAddActions
          add={add}
          setAdd={setAdd}
          activeModal={activeModal}
          setActiveModal={setActiveModal}
        />
      ) : null}

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
