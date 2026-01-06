import React from "react";
import {
  Trash2,
  MoreVertical,
  Pencil,
  ShieldOff,
  Eye,
  LucideIcon,
} from "lucide-react";
import { SetStateAction } from "react";
import { useAppStore } from "@/store/useAppStore";
import { AnimatePresence, motion } from "framer-motion";
interface OptionModal {
  options: boolean;
  setOptions: React.Dispatch<React.SetStateAction<boolean>>;
  tab: string;
  drug: string;
  drugId: string;
  activeAction: string;
  setActiveAction: (value: string) => void;
  activeView: string;
  setActiveView: React.Dispatch<SetStateAction<"details" | "list">>;
}

interface DropdownButton {
  label: string;
  icon: LucideIcon;
  iconColor: string;
  hoverBg: string;
  action: string;
  showCondition?: boolean;
}

const OptionModal: React.FC<OptionModal> = ({
  options,
  setOptions,
  tab,
  drug,
  drugId,
  setActiveAction,
  activeView,
  setActiveView,
}) => {
  const { setActiveDrug, setActiveDrugId } = useAppStore((state) => state);

  // Helper function to handle actions
  const handleAction = (action: string) => {
    setActiveDrug(drug);
    setActiveDrugId(drugId);
    setActiveAction(action);
    setOptions(false);

    // Set screen and activeView based on action
    if (action === "edit") {
    } else if (action === "view") {
      setActiveView("details");
    } else {
    }
  };

  // Define all dropdown buttons
  const dropdownButtons: DropdownButton[] = [
    {
      label: "View Details",
      icon: Eye,
      iconColor: "text-green-500",
      hoverBg: "hover:bg-green-50",
      action: "view",
      showCondition:
        (tab === "ongoing" || tab === "completed") && activeView !== "details",
    },
    {
      label: "Edit Drug",
      icon: Pencil,
      iconColor: "text-blue-500",
      hoverBg: "hover:bg-blue-50",
      action: "edit",
      showCondition: tab !== "completed" && tab !== "allergies",
    },
    {
      label: "Delete Drug",
      icon: Trash2,
      iconColor: "text-red-500",
      hoverBg: "hover:bg-red-50",
      action: "delete",
      showCondition: true,
    },
    {
      label: "Add to Allergies",
      icon: ShieldOff,
      iconColor: "text-yellow-500",
      hoverBg: "hover:bg-yellow-50",
      action: "allergy",
      showCondition: tab !== "allergies",
    },
  ];

  // Filter buttons based on showCondition
  const visibleButtons = dropdownButtons.filter(
    (button) => button.showCondition !== false
  );

  return (
    <div className="relative">
      {/* Options Toggle Button */}
      <button
        onClick={(e) => {
          setOptions((prev) => !prev);
          setActiveDrug(drug);
          setActiveDrugId(drugId); // ✅ Added this line to fix the modal not showing
          e.stopPropagation();
        }}
        className="size-8 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-900 transition-colors"
        aria-label="Drug options"
      >
        <MoreVertical className="size-6" />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {options && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, originX: 1, originY: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 z-[200] top-12 text-gray-700 dark:text-gray-200 flex flex-col items-start rounded-lg bg-white dark:bg-slate-900 shadow-xl w-56 py-2 border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800"
          >
            {/* Automatically render all visible buttons */}
            {visibleButtons.map((button, index) => {
              const Icon = button.icon;
              // Clean hover mapping: if light is bg-X-50, dark should be bg-gray-800/50
              const finalHoverClass = `${button.hoverBg} dark:hover:bg-slate-800`;

              return (
                <button
                  key={index}
                  onClick={() => handleAction(button.action)}
                  className={`flex items-center gap-3 w-full px-4 py-2 text-sm ${finalHoverClass} transition-colors text-gray-800 dark:text-gray-200`}
                >
                  <Icon className={`size-4 ${button.iconColor}`} />
                  {button.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OptionModal;
