/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { Dispatch, SetStateAction, useState, useEffect, useRef } from "react";

import { toast } from "sonner";
import { generateDrugAllergyEmail } from "@/emails/drugAllergy";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
// Redux actions removed from imports as they are no longer needed for dispatching
import {
  useDrugs,
  useCompletedDrugs,
  useAllergies,
  useSchedule,
  useUserInfo,
} from "@/hooks/useDashboardData";
import { uploadScheduleToServer } from "@/utils/dashboard/schedule";
import { sendMail } from "@/utils/sendEmail";
import DrugActionModals from "../DrugActionModals";
import DrugDetails from "../drugDetails/DrugDetails";
import DrugsHeader from "./DrugsHeader";
import DrugsList from "./DrugsListContainer";
import DrugsTab from "./DrugsTab";
import FloatingAddActions from "./FloatingAddActions";
import { useAppStore } from "@/store/useAppStore";
import { AnimatePresence, motion } from "framer-motion";

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
  const { userId } = useAppStore((state) => state);

  const { data: drugs = [] } = useDrugs(userId);
  const { data: completedDrugs = [] } = useCompletedDrugs(userId);
  const { data: allergies = [] } = useAllergies(userId);
  const { data: schedule = [] } = useSchedule(userId);
  const { data: info = [] } = useUserInfo(userId);

  const [tab, setTab] = useState<string>("ongoing");
  const [activeView, setActiveView] = useState<"list" | "details">("list");
  const [options, setOptions] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();
  const supabase = createClient();

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
      await supabase.from("drugs").delete().eq("drug", drug);

      const updatedSchedule = schedule.filter((s) => s.drug !== drug);
      if (userId)
        await uploadScheduleToServer({ userId, schedule: updatedSchedule }); // This might be redundant if the server handles cascade delete, but we keep it for now

      queryClient.invalidateQueries({ queryKey: ["dashboardData", userId] });

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
      await supabase
        .from("completedDrugs")
        .update({ completedDrugs: updated })
        .eq("userId", userId);

      queryClient.invalidateQueries({ queryKey: ["dashboardData", userId] });

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

    const target = sourceList.find((d) => d.drug === drug);
    if (!target) {
      toast.error("Drug not found");
      return;
    }

    if (allergies.some((a) => a.drug === drug)) {
      toast.error("Already an allergy");
      return;
    }

    try {
      if (tab === "ongoing") {
        await supabase
          .from("drugs")
          .delete()
          .eq("drug", drug)
          .eq("userId", userId);
      } else if (tab === "completed") {
        await supabase
          .from("completedDrugs")
          .delete()
          .eq("drug", drug)
          .eq("userId", userId);
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
      const updatedSchedule = schedule.filter((s) => s.drug !== drug);
      if (userId) {
        await uploadScheduleToServer({ userId, schedule: updatedSchedule });
      }

      queryClient.invalidateQueries({ queryKey: ["dashboardData", userId] });

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
      queryClient.invalidateQueries({ queryKey: ["dashboardData", userId] });
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
      className="h-[100dvh] overflow-y-scroll w-full md:py-16 md:px-12 px-4 pt-10 ss:p-10 ss:pb-24 text-navyBlue dark:text-slate-100 font-karla relative"
    >
      <AnimatePresence mode="wait">
        {activeView === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
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
            <FloatingAddActions
              add={add}
              setAdd={setAdd}
              activeModal={activeModal}
              setActiveModal={setActiveModal}
            />
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
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