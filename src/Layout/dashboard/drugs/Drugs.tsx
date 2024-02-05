/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use-client";
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { frequencyToPlaceholder } from "../../../../utils/dashboard";
import {
  setDrugs,
  updateAllergies,
  updateActiveDrug,
  updateSchedule,
  updateActiveAllergy,
} from "../../../../store/stateSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Drug } from "./../../../../types";
import RenderedDrugs from "./RenderedDrugs";
import supabase from "../../../../utils/supabaseClient";
import {
  uploadScheduleToServer,
  removeActiveDrugFromSchedule,
} from "../../../../utils/schedule";
import { drugsTab } from "../../../../utils/drugs";
import Ongoing from "./tabs/Ongoing";
import Completed from "./tabs/Completed";
import Allergies from "./tabs/Allergies";
import Image from "next/image";
import DrugDetails from "./DrugDetails";

interface DrugsProps {
  screen: boolean;
  setScreen: Function;
  setDrugsForm: Function;
  setEditForm: Function;
  setEditModal: Function;
  setDeleteModal: Function;
  setAllergyModal: Function;
  setEffectsForm: Function;
  setAllergiesForm: Function;
  setAdd: Function;
  deleteModal: boolean;
  editModal: boolean;
  allergyModal: boolean;
  add: boolean;
  effectsForm: boolean;
  drugsForm: boolean;
  editForm: boolean;
  allergiesForm: boolean;
  setDeleteAllergyModal: Function;
  deleteAllergyModal: boolean;
}

type RefObject<T> = React.RefObject<T>;

const Drugs: React.FC<DrugsProps> = ({
  setScreen,
  setDrugsForm,
  setEditForm,
  setEditModal,
  setDeleteModal,
  setAllergiesForm,
  allergiesForm,
  deleteModal,
  editModal,
  screen,
  add,
  setAdd,
  setEffectsForm,
  editForm,
  effectsForm,
  drugsForm,
  setAllergyModal,
  allergyModal,
  deleteAllergyModal,
  setDeleteAllergyModal,
}) => {
  const { drugs, schedule, userId, allergies, activeAllergy, activeDrug } = useSelector(
    (state: RootState) => state.app
  );

  const [tab, setTab] = useState<string>("Ongoing");
  const [displayDrugs, setDisplayDrugs] = useState(true)
  const dispatch = useDispatch();
  const dropdownRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent): void => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setScreen(false);
      setEditModal(false);
      setDeleteModal(false);
      setAllergyModal(false);
    }
  };
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      handleClickOutside(event);
    };

    // add event listener for clicks outside of dropdown
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      // remove event listener when component unmounts
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    dispatch(updateActiveDrug(activeDrug));
  }, [activeDrug]);

  const handleDelete = async () => {
    // Show loading toast while uploading the schedule
    toast.loading("Deleting drug", { duration: 2000 });

    try {
      const { error } = await supabase
        .from("drugs")
        .delete()
        .eq("drug", activeDrug);

      if (error) {
        toast.error("Failed to delete Drug");
        return;
      }

      toast.success(`'${activeDrug}' deleted Successfully!`);

      const updatedSchedule = removeActiveDrugFromSchedule({
        activeDrug,
        schedule,
      });

      // Make the uploadScheduleToServer asynchronous
      await uploadScheduleToServer({
        userId: userId,
        schedule: updatedSchedule,
      });

      // Update the Redux state after deleting and uploading the schedule
      dispatch(
        setDrugs(drugs.filter((drug: Drug) => drug.drug !== activeDrug))
      );
      dispatch(updateSchedule(updatedSchedule));
    } catch (error) {
      console.error("Error deleting drug:", error);
    }
  };

  const handleDeleteAllergy = async (allergy: string) => {
    // Show loading toast while uploading the schedule
    toast.loading("Deleting drug", { duration: 2000 });

    try {
      const { error } = await supabase
        .from("allergies")
        .delete()
        .eq("allergy", allergy);

      if (error) {
        toast.error("Failed to delete Allergy");
        return;
      }

      toast.success(`'${allergy}' deleted Successfully!`);

      const newAllergies = allergies.filter(
        (allergyItem: any) => allergyItem.allergy !== allergy
      );
      dispatch(updateAllergies(newAllergies));
    } catch (error) {
      console.error("Error deleting allergy:", error);
    }
  };

  const handleAllergies = async () => {
    // Show loading toast while uploading the schedule

    toast.loading("Marking Drug as allergy");

    try {
      const { error: deleteError } = await supabase
        .from("drugs")
        .delete()
        .eq("drug", activeDrug);

      const { error: insertError } = await supabase.from("allergies").insert({
        userId: userId,
        allergy: activeDrug,
      });

      if (deleteError || insertError) {
        toast.error("Failed to delete Drug or insert Allergy");
        return;
      }

      const updatedSchedule = removeActiveDrugFromSchedule({
        activeDrug,
        schedule,
      });

      toast.success(`'${activeDrug}' has been marked as an allergy!`);

      // Make the uploadScheduleToServer asynchronous
      await uploadScheduleToServer({
        userId: userId,
        schedule: updatedSchedule,
      });

      dispatch(updateAllergies([...allergies, { allergy: activeDrug }]));

      // Update the Redux state after deleting and uploading the schedule
      dispatch(
        setDrugs(drugs.filter((drug: Drug) => drug.drug !== activeDrug))
      );
      dispatch(updateSchedule(updatedSchedule));
    } catch (error) {
      console.error("Error handling allergies:", error);
    }
  };

  const renderedDrugs = drugs?.map((drug: any, index: number) => {
    const startDate: any = new Date(drug.start);
    const endDate: any = new Date(drug.end);
    const durationInDays = Math.floor(
      (endDate - startDate) / (1000 * 60 * 60 * 24)
    );
    const durationInYears = Math.floor(durationInDays / 365);
    const remainingDaysAfterYears = durationInDays % 365;

    const durationInMonths = Math.floor(remainingDaysAfterYears / 30);
    const remainingDaysAfterMonths = remainingDaysAfterYears % 30;

    const durationInWeeks = Math.floor(remainingDaysAfterMonths / 7);
    const remainingDaysAfterWeeks = remainingDaysAfterMonths % 7;

    const accurateDurationText = [];

    if (durationInYears > 0) {
      accurateDurationText.push(
        `${durationInYears} year${durationInYears > 1 ? "s" : ""}`
      );
    }

    if (durationInMonths > 0) {
      accurateDurationText.push(
        `${durationInMonths} month${durationInMonths > 1 ? "s" : ""}`
      );
    }

    if (durationInWeeks > 0) {
      accurateDurationText.push(
        `${durationInWeeks} week${durationInWeeks > 1 ? "s" : ""}`
      );
    }

    if (remainingDaysAfterWeeks > 0) {
      accurateDurationText.push(
        `${remainingDaysAfterWeeks} day${
          remainingDaysAfterWeeks > 1 ? "s" : ""
        }`
      );
    }

    const finalDurationText =
      accurateDurationText.length > 0
        ? `${accurateDurationText.join(", ")} `
        : "Less than a day";

    return (
      <RenderedDrugs
        key={index}
        id={index}
        drug={drug}
        frequencyToPlaceholder={frequencyToPlaceholder}
        finalDurationText={finalDurationText}
        setScreen={setScreen}
        setDeleteModal={setDeleteModal}
        setEditModal={setEditModal}
        setAllergyModal={setAllergyModal}
        displayDrugs={displayDrugs}
        setDisplayDrugs={setDisplayDrugs}
      />
    );
  });

  const renderedTabs = drugsTab.map((item: string, index: number) => {
    return (
      <button
        key={index}
        onClick={() => {
          setTab(item);
        }}
        className={`${
          item === tab
            ? "border-b-[2px] border-darkBlue text-navyBlue font-semibold"
            : "bg-white text-gray-600"
        } px-3 py-2 ss:px-4 text-[14px] ss:text-[16px] w-full ss:w-auto`}
      >
        {item}
      </button>
    );
  });

  return (
    <div className="h-[100dvh] ss:pb-28 overflow-y-scroll w-full md:py-16 md:px-12 px-4 pt-10 pb-24 ss:p-10 text-navyBlue font-karla relative">
      {displayDrugs ? (
        <>
          <div className="mb-[28px]">
            <h1 className="text-[24px] ss:text-[32px] font-semibold font-montserrant ">
              Drugs
            </h1>
            <p className="text-[16px] text-[#718096]">
              Manage medications wisely!
            </p>
          </div>
          <div className="flex mb-8 border-b-[1px] w-auto">
            {renderedTabs}
          </div>
          {tab === "Ongoing" ? (
            <Ongoing renderedDrugs={renderedDrugs} drugs={drugs} />
          ) : tab === "Completed" ? (
            <Completed />
          ) : (
            <Allergies
              deleteAllergyModal={deleteAllergyModal}
              setDeleteAllergyModal={setDeleteAllergyModal}
              setScreen={setScreen}
            />
          )}
          {deleteModal && (
            <div className="w-full h-full fixed flex top-0 left-0 justify-center items-center z-[143] p-4 font-Inter">
              <div
                ref={dropdownRef}
                className="bg-white rounded-[10px] text-white relative flex flex-col justify-center items-center"
              >
                <h1 className="text-navyBlue font-semibold py-4 px-4 border-b-[1px] text-left w-full text-[13px] ss:text-[16px] leading-tight">
                  Confirm to delete '{activeDrug.toUpperCase()}' ?
                </h1>
                <h2 className="text-navyBlue border-b-[1px] text-left px-4 py-4 text-[12px] ss:text-[14px]">
                  Are you sure you want to delete the selected drug? <br /> This
                  action cannot be undone.
                </h2>
                <div className="w-full flex gap-3 justify-start flex-row-reverse text-[12px] py-4 px-4">
                  <button
                    onClick={() => {
                      handleDelete(),
                        setScreen(false),
                        dispatch(updateActiveDrug(''))
                        setDeleteModal(false);
                    }}
                    className="px-4 py-1 flex items-center gap-2 bg-navyBlue rounded-[10px] rounded-bl-none "
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      dispatch(updateActiveDrug("")),
                        setScreen(false),
                        setDeleteModal(false);
                    }}
                    className="px-4 py-1 flex items-center gap-2 bg-none border text-navyBlue border-navyBlue rounded-[10px] rounded-bl-none "
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {allergyModal && (
            <div className="w-full h-full fixed flex top-0 left-0 justify-center items-center z-[143] p-4 font-Inter">
              <div
                ref={dropdownRef}
                className="bg-white rounded-[10px] text-white relative flex flex-col justify-center items-center"
              >
                <h1 className="text-navyBlue font-semibold py-4 px-4 border-b-[1px] text-left w-full text-[13px] ss:text-[16px] leading-tight">
                  Confirm to add '{activeDrug}' to Allergies?
                </h1>
                <h2 className="text-navyBlue border-b-[1px] text-left px-4 py-4 text-[12px] ss:text-[14px]">
                  Are you sure you want to mark the selected drug as Allergy?{" "}
                  <br /> This action cannot be undone.
                </h2>
                <div className="w-full flex gap-3 justify-start flex-row-reverse text-[12px] py-4 px-4">
                  <button
                    onClick={() => {
                      setScreen(false), dispatch(updateActiveDrug(""));
                        setAllergyModal(false),
                        handleAllergies();
                    }}
                    className="px-4 py-1 flex items-center gap-2 bg-navyBlue rounded-[10px] rounded-bl-none "
                  >
                    Add to Allergies
                  </button>
                  <button
                    onClick={() => {
                     dispatch(updateActiveDrug(""));
                        setScreen(false),
                        setAllergyModal(false);
                    }}
                    className="px-4 py-1 flex items-center gap-2 bg-none border text-navyBlue border-navyBlue rounded-[10px] rounded-bl-none "
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {editModal && (
            <div className="w-full h-full fixed flex top-0 left-0 justify-center items-center z-[143] p-4 font-Inter">
              <div
                ref={dropdownRef}
                className="bg-white rounded-[10px] text-white relative flex flex-col justify-center items-center"
              >
                <h1 className="text-navyBlue font-semibold py-4 px-4 border-b-[1px] text-left w-full text-[13px] ss:text-[16px] leading-tight">
                  Continue to Edit '{activeDrug}' ?
                </h1>
                <h2 className="text-navyBlue border-b-[1px] text-left px-4 py-4 text-[12px] ss:text-[14px]">
                  Editing clears past history of the selected drug? <br /> This
                  action cannot be undone.
                </h2>
                <div className="w-full flex gap-3 justify-start flex-row-reverse text-[12px] py-4 px-4">
                  <button
                    onClick={() => {
                      setEditForm(true), setScreen(false), setEditModal(false);
                    }}
                    className="px-4 py-1 flex items-center gap-2 bg-navyBlue rounded-[10px] rounded-bl-none "
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                     dispatch(updateActiveDrug(""));
                        setScreen(false),
                        setEditForm(false),
                        setEditModal(false);
                    }}
                    className="px-4 py-1 flex items-center gap-2 bg-none border text-navyBlue border-navyBlue rounded-[10px] rounded-bl-none "
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {deleteAllergyModal && (
            <div className="w-full h-full fixed flex top-0 left-0 justify-center items-center z-[143] p-4 font-Inter">
              <div
                ref={dropdownRef}
                className="bg-white rounded-[10px] text-white relative flex flex-col justify-center items-center"
              >
                <h1 className="text-navyBlue font-semibold py-4 px-4 border-b-[1px] text-left w-full text-[13px] ss:text-[16px] leading-tight">
                  Confirm to delete '{activeAllergy.toUpperCase()}' ?
                </h1>
                <h2 className="text-navyBlue border-b-[1px] text-left px-4 py-4 text-[12px] ss:text-[14px]">
                  Are you sure you want to delete the selected allergy? <br />{" "}
                  This action cannot be undone.
                </h2>
                <div className="w-full flex gap-3 justify-start flex-row-reverse text-[12px] py-4 px-4">
                  <button
                    onClick={() => {
                      handleDeleteAllergy(activeAllergy),
                        setScreen(false),
                        dispatch(updateActiveAllergy("")),
                        setDeleteAllergyModal(false);
                    }}
                    className="px-4 py-1 flex items-center gap-2 bg-navyBlue rounded-[10px] rounded-bl-none "
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      dispatch(updateActiveAllergy("")),
                        setScreen(false),
                        setDeleteAllergyModal(false);
                    }}
                    className="px-4 py-1 flex items-center gap-2 bg-none border text-navyBlue border-navyBlue rounded-[10px] rounded-bl-none "
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          <div
            className={`fixed right-4 ss:right-10 md:right-16 bottom-20 md:bottom-6 z-[144]`}
          >
            {add ? (
              <div className="flex flex-col fixed right-4 ss:right-16 bottom-36 md:bottom-24 gap-4">
                <button
                  onClick={() => {
                    setAdd(false);
                    setDrugsForm(true);
                    setScreen(false);
                  }}
                  className="rounded-[10px] rounded-bl-none text-white font-semibold justify-end flex"
                >
                  + Add drug
                </button>
                <button
                  onClick={() => {
                    setAdd(false);
                    setAllergiesForm(true);
                    setScreen(false);
                  }}
                  className="rounded-[10px] rounded-bl-none text-white font-semibold justify-end flex"
                >
                  + Add Allergies
                </button>
                <button
                  onClick={() => {
                    setAdd(false);
                    setEffectsForm(true);
                    setScreen(false);
                  }}
                  className="rounded-[10px] rounded-bl-none text-white font-semibold justify-end flex"
                >
                  + Add Side Effect
                </button>
              </div>
            ) : (
              ""
            )}
            <button
              onClick={() => {
                setScreen((prev: boolean) => !prev);
                setAdd((prev: boolean) => !prev);
              }}
              className={`rounded-full p-4 bg-navyBlue ${
                editForm ||
                drugsForm ||
                effectsForm ||
                deleteModal ||
                editModal ||
                allergiesForm ||
                allergyModal
                  ? "hidden"
                  : "flex"
              }`}
            >
              <Image
                src={`/assets/x.png`}
                alt="plus"
                width={512}
                height={512}
                className={`w-4 ss:w-5 ${
                  screen ? "rotate-0" : "rotate-45"
                }  transition-all`}
              />
            </button>
          </div>
        </>
      ) : (
        <DrugDetails
          displayDrugs={displayDrugs}
          setDisplayDrugs={setDisplayDrugs}
        />
      )}
    </div>
  );
};

export default Drugs;
