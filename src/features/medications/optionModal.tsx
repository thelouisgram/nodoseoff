import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [openUpward, setOpenUpward] = useState(false);

  // Update position when modal opens or window resizes
  useEffect(() => {
    const updatePosition = () => {
      if (options && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const modalHeight = 250; // Approximate modal height
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const shouldOpenUpward = spaceBelow < modalHeight && rect.top > modalHeight;
        
        setOpenUpward(shouldOpenUpward);
        setPosition({
          top: shouldOpenUpward ? rect.top - 8 : rect.bottom + 8,
          left: rect.right - 224, // 224px = w-56 (14rem)
        });
      }
    };

    updatePosition();
    
    if (options) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [options]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOptions(false);
      }
    };

    if (options) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [options, setOptions]);

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

  const modalContent = (
    <AnimatePresence>
      {options && (
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="fixed z-[9999] text-gray-700 dark:text-gray-200 flex flex-col items-start rounded-lg bg-white dark:bg-slate-900 shadow-xl w-56 border border-gray-200 dark:border-gray-700 overflow-hidden"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            maxHeight: openUpward 
              ? `${position.top - 16}px` 
              : `calc(100vh - ${position.top + 16}px)`,
            overflowY: 'auto',
            transformOrigin: openUpward ? 'bottom right' : 'top right',
          }}
        >
          {/* Automatically render all visible buttons */}
          {visibleButtons.map((button, index) => {
            const Icon = button.icon;
            const isFirst = index === 0;
            const isLast = index === visibleButtons.length - 1;
            const finalHoverClass = `${button.hoverBg} dark:hover:bg-slate-800`;
            
            // Add rounded corners and proper padding for first/last items
            const borderRadiusClass = isFirst 
              ? "rounded-t-lg" 
              : isLast 
              ? "rounded-b-lg" 
              : "";
            
            const paddingClass = isFirst 
              ? "pt-3 pb-2" 
              : isLast 
              ? "pt-2 pb-3" 
              : "py-2";

            return (
              <button
                key={index}
                onClick={() => handleAction(button.action)}
                className={`flex items-center gap-3 w-full px-4 ${paddingClass} text-sm ${finalHoverClass} ${borderRadiusClass} transition-colors text-gray-800 dark:text-gray-200`}
              >
                <Icon className={`size-4 ${button.iconColor}`} />
                {button.label}
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Options Toggle Button */}
      <button
        ref={buttonRef}
        onClick={(e) => {
          setOptions((prev) => !prev);
          setActiveDrug(drug);
          setActiveDrugId(drugId);
          e.stopPropagation();
        }}
        className="size-8 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-900 transition-colors"
        aria-label="Drug options"
      >
        <MoreVertical className="size-6" />
      </button>

      {/* Portal the dropdown to document.body */}
      {typeof document !== 'undefined' && createPortal(modalContent, document.body)}
    </>
  );
};

export default OptionModal;