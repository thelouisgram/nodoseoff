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
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          activeModal === "contact"
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0"
        } transition-all duration-200 w-full max-w-md bg-white rounded-2xl shadow-2xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Contact Us</h2>
          <button
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Mail size={16} className="text-blue-600" />
                  <span>{item.label}</span>
                </div>
                <CopyableContent content={item.content} />
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Need help?</span> We typically respond within 24-48 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;