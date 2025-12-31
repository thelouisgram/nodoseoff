/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import { RootState } from "../../../../store";
import { useSelector, useDispatch } from "react-redux";
import { createClient } from "../../../../lib/supabase/client";
import { toast } from "sonner";
import { updateInfo, updateProfilePicture } from "../../../../store/stateSlice";
import { UserRoundPen, X, Loader2 } from "lucide-react";
import { useAppStore } from "../../../../store/useAppStore";

interface ProfileFormProps {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  setActiveModal,
  activeModal,
}) => {
  const { info, profilePicture } = useSelector((state: RootState) => state.app);
  const { userId } = useAppStore((state) => state);

  const { name, phone, email } = info[0];
  const supabase = createClient();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({ name, phone, email });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setSelectedImage(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const handleClose = () => {
    if (!loading) {
      setActiveModal("");
      setSelectedImage(null);
      setPreviewURL(null);
      setFormData({ name, phone, email });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement> | undefined) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      // Update Name
      if (formData.name !== name) {
        const { error } = await supabase
          .from("users")
          .update({ name: formData.name })
          .eq("userId", userId);

        if (error) {
          toast.error("Failed to update name");
          return;
        }

        dispatch(updateInfo([{ ...info[0], name: formData.name }]));
      }

      // Upload New Profile Picture
      if (selectedImage) {
        const bucket = "profile-picture";
        const newFileName = `${Date.now()}-${selectedImage.name}`;
        const filePath = `${userId}/${newFileName}`;

        // Delete old file
        if (profilePicture) {
          await supabase.storage
            .from(bucket)
            .remove([`${userId}/${profilePicture}`]);
        }

        // Upload new picture
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, selectedImage);

        if (uploadError) {
          toast.error("Failed to upload profile picture");
          return;
        }

        dispatch(updateProfilePicture(newFileName));
      }

      toast.success("Profile updated!");
      setActiveModal("");
      setSelectedImage(null);
      setPreviewURL(null);
    } catch (error) {
      toast.error("An error occurred, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const CDNURL =
    "https://opshqmqagtfidynwftzk.supabase.co/storage/v1/object/public/profile-picture/";

  if (activeModal !== "profile") return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          activeModal === "profile"
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0"
        } transition-all duration-200 w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Profile Picture
              </label>
              <label
                htmlFor="avatarInput"
                className={`flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer ${
                  loading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <input
                  type="file"
                  id="avatarInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                  disabled={loading}
                />
                <div className="w-20 h-20 rounded-full overflow-hidden flex justify-center items-center bg-gray-100 flex-shrink-0">
                  {previewURL ? (
                    <Image
                      src={previewURL}
                      alt="preview"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : profilePicture ? (
                    <Image
                      key={profilePicture}
                      src={CDNURL + userId + "/" + profilePicture}
                      width={80}
                      height={80}
                      alt="user"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserRoundPen
                      className="w-10 h-10 text-gray-400"
                      strokeWidth={1.5}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedImage ? selectedImage.name : "Change photo"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Click to upload a new picture
                  </p>
                </div>
              </label>
            </div>

            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                required
                onChange={handleInputChange}
                disabled={loading}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-900 placeholder-gray-400 capitalize"
              />
            </div>
          </div>
        </form>

        {/* Footer with Submit Button */}
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              const syntheticEvent = new Event(
                "submit"
              ) as unknown as FormEvent<HTMLFormElement>;
              handleSubmit(syntheticEvent);
            }}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;