import React from 'react';
import { Trash2, MoreVertical, Pencil, ShieldOff, Eye, LucideIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { SetStateAction } from 'react';
import { useAppStore } from '../../../../store/useAppStore';

interface OptionModal {
  options: boolean;
  setOptions: React.Dispatch<React.SetStateAction<boolean>>;
  tab: string;
  drug: string;
  activeAction: string;
  setActiveAction: (value: string) => void;
  activeView: string;
  setActiveView:  React.Dispatch<SetStateAction<"details" | "list">>
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
  setActiveAction,
  activeView,
  setActiveView
}) => {
  const dispatch = useDispatch();

  const { setActiveDrug } = useAppStore((state) => state);

  // Helper function to handle actions
  const handleAction = (action: string) => {
    setActiveDrug(drug);    
    setActiveAction(action);
    setOptions(false);
    
    // Set screen and activeView based on action
    if (action === "edit") {
    } else if (action === "view") {
      setActiveView('details');
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
      showCondition: (tab === "ongoing" || tab === "completed") && activeView !== 'details',
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
          e.stopPropagation()
        }}
        className="size-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
        aria-label="Drug options"
      >
        <MoreVertical className="size-6" />
      </button>

      {/* Dropdown Menu */}
      {options && (
        <div className="absolute right-0 z-[200] top-12 text-gray-700 flex flex-col items-start rounded-lg bg-white shadow-xl w-56 py-2 border border-gray-200 divide-y divide-gray-100">
          {/* Automatically render all visible buttons */}
          {visibleButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <button
                key={index}
                onClick={() => handleAction(button.action)}
                className={`flex items-center gap-3 w-full px-4 py-2 text-sm ${button.hoverBg} transition-colors text-slate-800`}
              >
                <Icon className={`size-4 ${button.iconColor}`} />
                {button.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OptionModal;