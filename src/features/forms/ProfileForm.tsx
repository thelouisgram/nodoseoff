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
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileFormProps {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  setActiveModal,
  activeModal,
}) => {
  const { userId } = useAppStore((state) => state);
  const { data: info = [] } = useUserInfo(userId);
  const { data: profilePicture = "" } = useProfilePicture(userId);

  const { name = "", phone = "", email = "" } = info[0] || {};
  const updateProfileMutation = useUpdateProfileMutation();
  const uploadPictureMutation = useUploadProfilePictureMutation();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({ name, phone, email });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarURL, setAvatarURL] = useState<string | null>(null);

  useEffect(() => {
    if (profilePicture) {
      setAvatarURL(CDNURL + userId + "/" + profilePicture);
    } else {
      setAvatarURL(null);
    }
  }, [profilePicture, userId]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setAvatarFile(file);
    setAvatarURL(URL.createObjectURL(file));
  };

  const handleClose = () => {
    if (!loading) {
      setActiveModal("");
      setAvatarFile(null);
      if (profilePicture) {
        setAvatarURL(CDNURL + userId + "/" + profilePicture);
      } else {
        setAvatarURL(null);
      }
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
      setAvatarFile(null);
      if (profilePicture) {
        setAvatarURL(CDNURL + userId + "/" + profilePicture);
      } else {
        setAvatarURL(null);
      }
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

  const CDNURL =
    "https://opshqmqagtfidynwftzk.supabase.co/storage/v1/object/public/profile-picture/";

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
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 flex-shrink-0">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Edit Profile
              </h2>
              <button
                onClick={handleClose}
                disabled={loading}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
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
                    <div className="size-28 rounded-full border-4 border-gray-50 dark:border-slate-800 overflow-hidden bg-gray-100 dark:bg-slate-800 shadow-inner">
                      {avatarURL ? (
                        <Image
                          src={avatarURL}
                          alt="Avatar Preview"
                          fill
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <User size={48} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg cursor-pointer transition-transform hover:scale-110 active:scale-95">
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
                  <p className="mt-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                    JPG, PNG or GIF. Max 5MB
                  </p>
                </div>

                {/* Form Fields */}
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50/50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your name"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50/50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="+234 000 000 0000"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={info[0]?.email}
                      className="w-full px-4 py-3 border border-gray-100 dark:border-slate-800 rounded-xl bg-gray-100/50 dark:bg-slate-900/50 text-gray-500 dark:text-slate-500 cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </form>
            {/* Footer */}
            <div className="px-6 py-5 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
              <button
                type="submit"
                onClick={handleClick}
                disabled={loading}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 active:scale-[0.98]"
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
