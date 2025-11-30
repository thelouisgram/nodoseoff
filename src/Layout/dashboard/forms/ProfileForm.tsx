/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import { RootState } from "../../../../store";
import { useSelector, useDispatch } from "react-redux";
import { createClient } from "../../../../lib/supabase/client";
import { toast } from "sonner";
import { updateInfo, updateProfilePicture } from "../../../../store/stateSlice";
import { UserRoundPen, X, Loader2 } from "lucide-react";

interface ProfileFormProps {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  setActiveModal,
  activeModal,
}) => {
  const { info, userId, profilePicture } = useSelector(
    (state: RootState) => state.app
  );
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
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-[100] transition-opacity duration-300"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          activeModal === "profile" ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 w-full ss:w-[450px] bg-white h-full`}
      >
        <div className="h-full flex flex-col w-full justify-between gap-8 p-8 pt-0 overflow-y-scroll bg-white">
          <div>
            <div className="w-full flex justify-end mb-10">
              <button
                onClick={handleClose}
                disabled={loading}
                id="top-profile"
                className="cursor-pointer pt-8 hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="size-6 text-gray-600" />
              </button>
            </div>
            <div className="mb-10">
              <h1 className="text-[24px] text-blue-700 font-bold">
                Basic Data
              </h1>
            </div>
            <form
              onSubmit={handleSubmit}
              className="h-auto flex flex-col justify-between w-full"
            >
              <div className="mb-8 text-navyBlue">
                <div className="text-[14px] mb-1 font-semibold">
                  Change your Profile Picture
                </div>
                <div className="flex items-center h-full gap-4">
                  <label
                    htmlFor="avatarInput"
                    className={`cursor-pointer flex gap-2 items-center ${
                      loading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <input
                      type="file"
                      id="avatarInput"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageSelect}
                      disabled={loading}
                    />
                    <div className="size-20 rounded-full overflow-hidden flex justify-center items-center">
                      {previewURL ? (
                        <Image
                          src={previewURL}
                          alt="preview"
                          width={100}
                          height={100}
                          className="w-[100px] h-[100px] object-cover"
                        />
                      ) : profilePicture ? (
                        <Image
                          key={profilePicture}
                          src={CDNURL + userId + "/" + profilePicture}
                          width={100}
                          height={100}
                          alt="user"
                          className="w-[100px] h-[100px] object-cover"
                        />
                      ) : (
                        <UserRoundPen
                          className="size-full text-navyBlue"
                          strokeWidth={1}
                        />
                      )}
                    </div>
                    <p>Tap to change</p>
                  </label>
                </div>
              </div>

              {/* NAME INPUT */}
              <div className="w-full">
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor="name"
                    className="text-[14px] mb-1 font-semibold text-navyBlue"
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
                    className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 mb-4 capitalize h-[56px]"
                    placeholder="Enter your Full Name"
                  />
                </div>
              </div>

              {/* PROCEED BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className={`font-semibold text-white rounded-[10px] w-full items-center justify-center flex transition duration-300 ${
                  loading ? "bg-navyBlue opacity-85" : "bg-blue-700 h-14"
                }`}
              >
                {loading ? (
                  <div className="h-14 flex items-center">
                    <Loader2 className="size-5 animate-spin" />
                  </div>
                ) : (
                  "PROCEED"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;