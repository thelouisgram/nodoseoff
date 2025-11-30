import React, { Dispatch, SetStateAction, RefObject, useState } from "react";
import { useDispatch } from "react-redux";
import { updateActiveDrugId, updateActiveDrug } from "../../../../store/stateSlice";
import { ShieldOff, Trash2, Pencil, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

type DivRef = RefObject<HTMLDivElement>;

interface DrugActionModalsProps {
  deleteCompletedDrug: (drugName: string) => Promise<void>;
  deleteOngoingDrug: (drugName: string) => Promise<void>;
  deleteAllergy: (drugName: string) => Promise<void>;
  tab: string;
  handleAllergies: (drugName: string) => Promise<void>;
  setActiveModal: (value: string) => void;
  activeAction: string;
  setActiveAction: (value: string) => void;
  setActiveView: React.Dispatch<SetStateAction<"details" | "list">>
}

const DrugActionModals: React.FC<DrugActionModalsProps> = ({
  deleteCompletedDrug,
  deleteOngoingDrug,
  deleteAllergy,
  tab,
  handleAllergies,
  setActiveModal,
  activeAction,
  setActiveAction,
  setActiveView
}) => {
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const {activeDrug } =
      useSelector((state: RootState) => state.app);
  

  // Modal configuration based on activeAction
  const modalConfig = {
    delete: {
      title: `Confirm Deletion of ${activeDrug.toUpperCase()}`,
      message:
        "Are you sure you want to delete the selected drug? This action cannot be undone and will permanently remove it from your schedule.",
      confirmText: "Delete",
      confirmIcon: Trash2,
      confirmClass: "bg-red-500 hover:bg-red-800",
      onConfirm: async () => {
        setIsProcessing(true);
        try {
          if (tab === 'ongoing') {
            await deleteOngoingDrug(activeDrug);
          } else if (tab === 'completed') {
            await deleteCompletedDrug(activeDrug);
          } else {
            await deleteAllergy(activeDrug);
          }
          
          // Only cleanup after successful completion
          setActiveAction(""); 
          setActiveView('list');
          
          // Clear Redux state
          dispatch(updateActiveDrug(""));
          dispatch(updateActiveDrugId(""));
        } catch (error) {
          console.error("Error in modal delete operation:", error);
          // Don't close modal on error so user can see what happened
        } finally {
          setIsProcessing(false);
        }
      },
    },
    allergy: {
      title: `Add '${activeDrug}' to Allergies`,
      message:
        "Are you sure you want to mark the selected drug as an Allergy? This will move it from your active list.",
      confirmText: "Add to Allergies",
      confirmIcon: ShieldOff,
      confirmClass: "bg-yellow-500 hover:bg-yellow-600",
      onConfirm: async () => {
        setIsProcessing(true);
        try {
          await handleAllergies(activeDrug);
          
          // Clean up state *after* the async handler is complete
          setActiveAction("");
          setActiveView('list');
          
          // Redux cleanup
          if (tab !== "allergies") {
            dispatch(updateActiveDrug(""));
            dispatch(updateActiveDrugId(""));
          }
        } catch (error) {
          console.error("Error in modal allergy operation:", error);
          // Don't close modal on error
        } finally {
          setIsProcessing(false);
        }
      },
    },
    edit: {
      title: `Edit ${activeDrug.toUpperCase()} Schedule`,
      message:
        "Proceed to edit the selected drug. Note that changes will only apply to doses from today forward.",
      confirmText: "Edit",
      confirmIcon: Pencil,
      confirmClass: "bg-blue-600 hover:bg-blue-600",
      onConfirm: async () => {
        setActiveModal('edit');
        setActiveAction("");
      },
    },
  };

  const config = modalConfig[activeAction as keyof typeof modalConfig];

  if (!config || !activeAction) return null;

  const ConfirmIcon = config.confirmIcon;

  const handleClose = () => {
    if (!isProcessing) {
      setActiveAction("");
    }
  };

  const handleConfirmClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProcessing) return;
    await config.onConfirm();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[143] p-4 transition-opacity duration-300"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl max-w-sm w-full relative transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-lg font-bold text-slate-800">{config.title}</h1>
        </div>

        {/* Modal content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">{config.message}</p>

          {/* Action buttons */}
          <div className="flex gap-3 justify-end">
            {/* Cancel button */}
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="px-4 py-2 text-sm font-semibold border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            {/* Confirm button */}
            <button
              onClick={handleConfirmClick}
              disabled={isProcessing}
              className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed ${config.confirmClass}`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="inline size-4 mr-1 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ConfirmIcon className="inline size-4 mr-1" /> {config.confirmText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrugActionModals;