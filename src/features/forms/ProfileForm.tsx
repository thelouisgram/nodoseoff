/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import Image from "next/image";

import { toast } from "sonner";
import {
  useUserInfo,
  useProfilePicture,
  useUpdateProfileMutation,
  useUploadProfilePictureMutation,
} from "@/hooks/useDashboardData";
import { X, Loader2, Camera, User } from "lucide-react";
import { useAppSelector } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import { resolveProfileImageUrl } from "@/utils/profilePicture";

interface ProfileFormProps {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  setActiveModal,
  activeModal,
}) => {
  const { userId } = useAppSelector((state) => state.app);
  const { data: info = [] } = useUserInfo(userId);
  const { data: profilePicture = "" } = useProfilePicture(userId);

  const { name = "", phone = "", email = "" } = info[0] || {};
  const updateProfileMutation = useUpdateProfileMutation();
  const uploadPictureMutation = useUploadProfilePictureMutation();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({ name, phone, email });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarURL, setAvatarURL] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const savedAvatarURL = resolveProfileImageUrl(profilePicture, userId);
  const displayURL = localPreview || avatarURL || savedAvatarURL;

  useEffect(() => {
    setAvatarURL(savedAvatarURL);
  }, [savedAvatarURL]);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setAvatarFile(file);
    setLocalPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const resetAvatarPreview = () => {
    setAvatarFile(null);
    setLocalPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setAvatarURL(savedAvatarURL);
  };

  const handleClose = () => {
    if (!loading) {
      setActiveModal("");
      resetAvatarPreview();
      setFormData({ name, phone, email });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement> | undefined) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      // Update Name and Phone
      if (formData.name !== name || formData.phone !== phone) {
        await updateProfileMutation.mutateAsync({
          userId: userId!,
          name: formData.name,
          phone: formData.phone,
        });
      }

      // Upload New Profile Picture
      if (avatarFile) {
        await uploadPictureMutation.mutateAsync({
          userId: userId!,
          file: avatarFile,
          currentPicture: profilePicture || "",
        });
      }

      toast.success("Profile updated!");
      setActiveModal("");
      resetAvatarPreview();
    } catch (error) {
      toast.error("An error occurred, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    const syntheticEvent = new Event(
      "submit"
    ) as unknown as FormEvent<HTMLFormElement>;
    handleSubmit(syntheticEvent);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AnimatePresence>
      {activeModal === "profile" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-soft-md"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white flex-shrink-0">
              <h2 className="text-xl font-bold text-slate-800">
                Edit Profile
              </h2>
              <button
                onClick={handleClose}
                disabled={loading}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto flex flex-col"
            >
              <div className="p-6 space-y-8 flex-1">
                {/* Avatar Section */}
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="relative size-28 overflow-hidden rounded-full border-4 border-gray-50 bg-gray-100 shadow-inner">
                      {displayURL ? (
                        <Image
                          key={displayURL}
                          src={displayURL}
                          alt="Preview of your profile photo"
                          width={224}
                          height={224}
                          unoptimized={displayURL.startsWith("blob:")}
                          className="size-full object-cover"
                          priority
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-gray-400">
                          <User size={48} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-soft-primary p-2 text-white shadow-soft-sm transition-transform hover:scale-110 hover:bg-soft-primary/90 active:scale-95">
                      <Camera size={18} />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={loading}
                      />
                    </label>
                  </div>
                  <p className="mt-3 text-xs font-medium text-gray-500">
                    JPG, PNG or GIF. Max 5MB
                  </p>
                </div>

                {/* Form Fields */}
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Full Name
                    </label>
                    <div className="w-full h-[47px] px-4 border border-gray-200 rounded-xl bg-gray-50/50 focus-within:ring-2 focus-within:ring-blue-500 transition-all flex items-center">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full h-full bg-transparent border-none outline-none p-0 text-slate-800"
                        placeholder="Enter your name"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Phone Number
                    </label>
                    <div className="w-full h-[47px] px-4 border border-gray-200 rounded-xl bg-gray-50/50 focus-within:ring-2 focus-within:ring-blue-500 transition-all flex items-center">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full h-full bg-transparent border-none outline-none p-0 text-slate-800"
                        placeholder="+234 000 000 0000"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Email Address
                    </label>
                    <div className="w-full h-[47px] px-4 border border-gray-100 rounded-xl bg-gray-100/50 flex items-center">
                      <input
                        type="email"
                        value={info[0]?.email}
                        className="w-full h-full bg-transparent border-none outline-none p-0 text-gray-500 cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
            {/* Footer */}
            <div className="px-6 py-5 border-t border-gray-100 bg-white flex-shrink-0">
              <button
                type="submit"
                onClick={handleClick}
                disabled={loading}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-soft-primary shadow-soft-sm hover:bg-soft-primary/90 active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Updating Profile...</span>
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileForm;
