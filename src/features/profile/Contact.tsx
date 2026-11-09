/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import CopyableContent from "./CopyContent";
import { X, Mail } from "lucide-react";

interface ContactProps {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

const Contact: React.FC<ContactProps> = ({ activeModal, setActiveModal }) => {
  const contactInfo = [{ label: "Email:", content: "nodoseoff@gmail.com" }];

  const handleClose = () => {
    setActiveModal("");
  };

  if (activeModal !== "contact") return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-soft-ink/25 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          activeModal === "contact"
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0"
        } w-full max-w-md rounded-2xl border border-black/[0.05] bg-white shadow-soft-md transition-all duration-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.04]">
          <h2 className="text-xl font-semibold text-soft-ink">
            Contact Us
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 text-soft-muted hover:text-soft-ink hover:bg-soft-canvas rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {contactInfo.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-soft-ink ">
                  <Mail
                    size={16}
                    className="text-blue-600"
                  />
                  <span>{item.label}</span>
                </div>
                <CopyableContent content={item.content} />
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
            <p className="text-sm text-soft-ink ">
              <span className="font-medium text-blue-900">
                Need help?
              </span>{" "}
              We typically respond within 24-48 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
