/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use-client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "../../../../store";
import {
  setDrugs,
  updateActiveDrug,
  updateAllergies,
  updateCompletedDrugs,
  updateSchedule,
} from "../../../../store/stateSlice";
import { DrugProps, ScheduleItem } from "../../../../types/dashboard";
import { drugsTab } from "../../../../utils/drugs";
import {
  removePastDoses,
  uploadScheduleToServer,
} from "../../../../utils/schedule";
import supabase from "../../../../utils/supabase";
import DrugDetails from "./DrugDetails";
import Allergies from "./tabs/Allergies";
import Completed from "./tabs/Completed";
import Ongoing from "./tabs/Ongoing";
import Loader from "../shared/Loader";

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
  setDrugsLoading: Function;
  setAdd: Function;
  deleteModal: boolean;
  drugsLoading: boolean;
  editModal: boolean;
  allergyModal: boolean;
  add: boolean;
  effectsForm: boolean;
  drugsForm: boolean;
  editForm: boolean;
  allergiesForm: boolean;
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
  drugsLoading,
  setDrugsLoading,
}) => {
  const {
    drugs,
    schedule,
    userId,
    allergies,
    activeDrug,
    completedDrugs,
    activeDrugId,
  } = useSelector((state: RootState) => state.app);

  const [tab, setTab] = useState<string>("Ongoing");
  const [displayDrugs, setDisplayDrugs] = useState(true);
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
    if (drugsLoading) {
      setTimeout(() => {
        setDrugsLoading(false);
      }, 1200);
    }
  }, []);

  useEffect(() => {
    dispatch(updateActiveDrug(activeDrug));
  }, [activeDrug]);

  const handleDeleteExpiredDrugs = async (drugName: string) => {
    try {
      const { error } = await supabase
        .from("drugs")
        .delete()
        .eq("drug", drugName);

      if (error) {
        console.error("Error deleting drug:", error);
      }
    } catch (error) {
      console.error("Error deleting drug:", error);
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const twoDaysPastDate = new Date();
    twoDaysPastDate.setDate(currentDate.getDate() - 2);

    const justCompletedDrugs = drugs.filter(
      (drug) => new Date(drug.end) <= twoDaysPastDate
    );

    const nonCompletedDrugs = drugs.filter(
      (drug) => new Date(drug.end) > twoDaysPastDate
    );

    const newCompletedDrugs = [...completedDrugs, ...justCompletedDrugs];

    // Dispatch nonCompletedDrugs immediately
    dispatch(setDrugs(nonCompletedDrugs));
    dispatch(updateCompletedDrugs(newCompletedDrugs));

    // Upload newCompletedDrugs to the database
    uploadCompletedDrugs(newCompletedDrugs);

    // Delete each non-completed drug
    justCompletedDrugs.forEach(async (drug) => {
      await handleDeleteExpiredDrugs(drug.drug);
    });
  }, []);

  const uploadCompletedDrugs = async (newCompletedDrugs: DrugProps[]) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({
          completedDrugs: newCompletedDrugs,
        })
        .eq("userId", userId);

      if (error) {
        console.error("Error updating completed drugs:", error);
      }
    } catch (error) {
      console.error("Error updating completed drugs:", error);
    }
  };

  const handleDelete = async () => {
    toast.loading("Deleting drug", { duration: 2000 });

    if (tab === "Ongoing") {
      try {
        const { error } = await supabase
          .from("drugs")
          .delete()
          .eq("drugId", activeDrugId);

        if (error) {
          toast.error("Failed to delete Drug");
          return;
        }

        toast.success(`${activeDrug.toUpperCase()} deleted Successfully!`);
        const updatedSchedule: ScheduleItem[] = removePastDoses({
          activeDrugId,
          schedule,
        });

        // Make the uploadScheduleToServer asynchronous
        await uploadScheduleToServer({
          userId: userId,
          schedule: updatedSchedule,
        });

        // Update the Redux state after deleting and uploading the schedule
        dispatch(
          setDrugs(drugs.filter((drug) => drug.drugId !== activeDrugId))
        );
        dispatch(updateSchedule(updatedSchedule));
      } catch (error) {
        console.error("Error deleting drug:", error);
      }
    } else if (tab === "Completed") {
      const newCompletedDrugs = completedDrugs.filter(
        (drug) => drug.drugId !== activeDrugId
      );
      dispatch(updateCompletedDrugs(newCompletedDrugs));
      uploadCompletedDrugs(newCompletedDrugs);
    }
  };

  const handleDeleteAllergy = async (drug: string) => {
    // Show loading toast while uploading the schedule
    toast.loading("Deleting drug", { duration: 2000 });

    try {
      const { error } = await supabase
        .from("allergies")
        .delete()
        .eq("drug", drug);

      if (error) {
        toast.error("Failed to delete Allergy");
        return;
      }

      toast.success(`${drug.toUpperCase()} deleted Successfully!`);

      const newAllergies = allergies.filter(
        (allergyItem: DrugProps) => allergyItem.drug !== drug
      );
      dispatch(updateAllergies(newAllergies));
    } catch (error) {
      console.error("Error deleting drug:", error);
    }
  };

  const handleAllergies = async () => {
    if (allergies.some((drug: DrugProps) => drug.drugId === activeDrugId)) {
      toast.error("Drug is already marked as an allergy");
      return null;
    } else {
      // Show loading toast while uploading the schedule
      toast.loading("Marking Drug as allergy");

      try {
        const { error: deleteError } = await supabase
          .from("drugs")
          .delete()
          .eq("drug", activeDrug);

        const { error: insertError } = await supabase.from("allergies").insert({
          userId: userId,
          drug: activeDrug,
          frequency: "",
          route: "",
          start: "",
          end: "",
          time: [""],
          reminder: true,
        });

        if (deleteError || insertError) {
          toast.error("Failed to delete Drug or insert Allergy");
          return;
        }

        const updatedSchedule: ScheduleItem[] = removePastDoses({
          activeDrugId,
          schedule,
        });

        toast.success(`${activeDrug.toUpperCase()}  marked as an allergy!`);
        // Make the uploadScheduleToServer asynchronous
        await uploadScheduleToServer({
          userId: userId,
          schedule: updatedSchedule,
        });
 
        const drugsToBeUsed = tab === 'Ongoing' ? drugs : completedDrugs

        const allergicDrug = drugsToBeUsed?.find(
          (drug) => drug.drug === activeDrug
        );
        if (allergicDrug) {
          dispatch(updateAllergies([...allergies, allergicDrug]));
        }

        // Update the Redux state after deleting and uploading the schedule
        dispatch(setDrugs(drugs.filter((drug) => drug.drug !== activeDrug)));
        dispatch(updateSchedule(updatedSchedule));
      } catch (error) {
        console.error("Error handling allergies:", error);
      }
    }
  };

  const renderedTabs = drugsTab.map((item: string, index: number) => {
    return (
      <button
        key={index}
        onClick={() => {
          setTab(item);
        }}
        className={`${
          item === tab
            ? "text-blue-700 bg-white rounded-[6px] border shadow-sm"
            : "text-grey"
        } px-3 py-2 ss:px-4 text-[14px] font-Inter w-full font-[500]`}
      >
        {item}
      </button>
    );
  });

  return (
    <>
      {drugsLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <Loader />
        </div>
      )}
      {displayDrugs ? (
        <div
          className={`${
            drugsLoading ? "opacity-0" : "opacity-100"
          } transition-all h-[100dvh] ss:pb-28 overflow-y-scroll w-full md:py-16 md:px-12 md:pb-28 px-4 pt-10 pb-28 ss:p-10 text-navyBlue font-karla relative`}
        >
          <div className="mb-[28px]">
            <h1 className="text-[24px] ss:text-[32px] font-semibold font-karla ">
              Drugs
            </h1>
            <p className="text-[16px] text-grey">Manage medications wisely!</p>
          </div>
          <div className="mb-8 bg-lightGrey border p-1 rounded-[6px] flex justify-between w-full ss:w-[450px]">
            {renderedTabs}
          </div>
          {tab === "Ongoing" ? (
            <Ongoing
              setScreen={setScreen}
              setDeleteModal={setDeleteModal}
              setEditModal={setEditModal}
              setAllergyModal={setAllergyModal}
              displayDrugs={displayDrugs}
              setDisplayDrugs={setDisplayDrugs}
            />
          ) : tab === "Completed" ? (
            <Completed
              setScreen={setScreen}
              setDeleteModal={setDeleteModal}
              setEditModal={setEditModal}
              setAllergyModal={setAllergyModal}
              displayDrugs={displayDrugs}
              setDisplayDrugs={setDisplayDrugs}
            />
          ) : (
            <Allergies
              setScreen={setScreen}
              setDeleteModal={setDeleteModal}
              setEditModal={setEditModal}
              setAllergyModal={setAllergyModal}
              displayDrugs={displayDrugs}
              setDisplayDrugs={setDisplayDrugs}
            />
          )}
          {deleteModal && (
            <div className="w-full h-full fixed flex top-0 left-0 justify-center items-center z-[143] p-4 font-Inter">
              <div
                ref={dropdownRef}
                className="bg-white rounded-[10px] text-white relative flex flex-col justify-center items-center"
              >
                <h1 className="text-navyBlue font-semibold py-4 px-4 border-b-[1px] text-left w-full text-[13px] ss:text-[16px] leading-tight">
                  Confirm to delete {activeDrug.toUpperCase()} ?
                </h1>
                <h2 className="text-navyBlue border-b-[1px] text-left px-4 py-4 text-[12px] ss:text-[14px]">
                  Are you sure you want to delete the selected drug? <br /> This
                  action cannot be undone.
                </h2>
                <div className="w-full flex gap-3 justify-start flex-row-reverse text-[12px] py-4 px-4">
                  <button
                    onClick={() => {
                      tab !== "Allergies"
                        ? handleDelete()
                        : handleDeleteAllergy(activeDrug),
                        setScreen(false),
                        dispatch(updateActiveDrug(""));
                      setDeleteModal(false);
                    }}
                    className="px-4 py-1 flex items-center gap-2 bg-navyBlue rounded-[10px]  "
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      dispatch(updateActiveDrug("")),
                        setScreen(false),
                        setDeleteModal(false);
                    }}
                    className="px-4 py-1 flex items-center gap-2 bg-none border text-navyBlue border-navyBlue rounded-[10px]  "
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
                  Confirm to add {activeDrug.toUpperCase()} to Allergies?
                </h1>
                <h2 className="text-navyBlue border-b-[1px] text-left px-4 py-4 text-[12px] ss:text-[14px]">
                  Are you sure you want to mark the selected drug as Allergy?{" "}
                  <br /> This action cannot be undone.
                </h2>
                <div className="w-full flex gap-3 justify-start flex-row-reverse text-[12px] py-4 px-4">
                  <button
                    onClick={() => {
                      setScreen(false), dispatch(updateActiveDrug(""));
                      setAllergyModal(false), handleAllergies();
                    }}
                    className="px-4 py-1 flex items-center gap-2 bg-navyBlue rounded-[10px]  "
                  >
                    Add to Allergies
                  </button>
                  <button
                    onClick={() => {
                      dispatch(updateActiveDrug(""));
                      setScreen(false), setAllergyModal(false);
                    }}
                    className="px-4 py-1 flex items-center gap-2 bg-none border text-navyBlue border-navyBlue rounded-[10px]  "
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
                  Continue to Edit {activeDrug.toUpperCase()} ?
                </h1>
                <h2 className="text-navyBlue border-b-[1px] text-left px-4 py-4 text-[12px] ss:text-[14px]">
                  Proceed to edit the selected drug. Changes apply only
                  <br className="hidden ss:flex" />
                  to doses from Today forward.
                </h2>
                <div className="w-full flex gap-3 justify-start flex-row-reverse text-[12px] py-4 px-4">
                  <button
                    onClick={() => {
                      setEditForm(true), setScreen(false), setEditModal(false);
                    }}
                    className="px-4 py-1 flex items-center gap-2 bg-navyBlue rounded-[10px]  "
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      dispatch(updateActiveDrug(""));
                      setScreen(false), setEditForm(false), setEditModal(false);
                    }}
                    className="px-4 py-1 flex items-center gap-2 bg-none border text-navyBlue border-navyBlue rounded-[10px]  "
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          <div
            className={`fixed right-4 ss:right-10 md:right-16 bottom-20 md:bottom-6 z-[144] font-karla`}
          >
            {add ? (
              <div className="flex flex-col fixed right-6 ss:right-12 md:right-[72px] bottom-36 md:bottom-24 gap-4 items-end">
                <button
                  onClick={() => {
                    setAdd(false);
                    setDrugsForm(true);
                    setScreen(false);
                  }}
                  className="bg-white py-2 w-[124px] rounded-[8px] font-semibold justify-center flex gap-2 ss:gap-3 items-center "
                >
                  + Add a Drug
                </button>
                <button
                  onClick={() => {
                    setAdd(false);
                    setAllergiesForm(true);
                    setScreen(false);
                  }}
                  className="bg-white py-2 w-[148px] rounded-[8px] font-semibold justify-center flex gap-2 ss:gap-3 items-center"
                >
                  + Add an Allergy
                </button>
                <button
                  onClick={() => {
                    setAdd(false);
                    setEffectsForm(true);
                    setScreen(false);
                  }}
                  className="bg-white py-2 w-[160px] rounded-[8px] font-semibold justify-center flex gap-2 ss:gap-3 items-center"
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
                width={20}
                height={20}
                alt="add"
                src="/assets/x.png"
                className={` ${
                  screen ? "rotate-180" : "rotate-45"
                }  transition-all`}
              />
            </button>
          </div>
        </div>
      ) : (
        <DrugDetails
          setDisplayDrugs={setDisplayDrugs}
          setScreen={setScreen}
          setAllergyModal={setAllergyModal}
          setDeleteModal={setDeleteModal}
          setEditModal={setEditModal}
          tab={tab}
          handleAllergies={handleAllergies}
          deleteModal={deleteModal}
          editModal={editModal}
          allergyModal={allergyModal}
          setEditForm={setEditForm}
          handleDeleteAllergy={handleDeleteAllergy}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
};

export default Drugs;
