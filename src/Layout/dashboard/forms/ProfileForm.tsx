/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useRef,
  useEffect,
  useState,
  FormEvent,
  ChangeEvent,
} from "react";
import Image from "next/image";
import { RootState } from "../../../../store";
import { useSelector, useDispatch } from "react-redux";
import supabase from "../../../../utils/supabase";

import { toast } from "sonner";
import { updateInfo } from "../../../../store/stateSlice";

interface ProfileFormProps {
  setProfileForm: Function;
  profileForm: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  setProfileForm,
  profileForm,
}) => {
  const { info, userId, profilePicture } = useSelector(
    (state: RootState) => state.app
  );

  const { name, phone, email, otcDrugs, herbs } = info[0];
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: name,
    phone: phone,
    email: email,
    otcDrugs: otcDrugs,
    herbs: herbs,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: formData.name,
          phone: formData.phone,
        })
        .eq("userId", userId);

      if (error) {
        toast.error("Failed to update profile, Check Internet Connection and Try again!");
        setLoading(false);
        return;
      }

      dispatch(updateInfo([formData]));
      setProfileForm(false);
      setLoading(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(
        "Failed to update profile, Check Internet Connection and Try again!"
      );
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.toLowerCase(),
    });
  };

  const avatar = `/${profilePicture}`;

  async function updateImage(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      console.error("No files selected");
      return;
    }

    let file = e.target.files[0];

    const { data, error } = await supabase.storage
      .from("profile-picture")
      .update(userId + avatar, file, {
        upsert: true,
      });

    if (data) {
    } else {
      console.error("Error uploading image:", error);
      toast.error("error");
    }
  }

  const CDNURL =
    "https://opshqmqagtfidynwftzk.supabase.co/storage/v1/object/public/profile-picture/";

  const handleClick = () => {
    const syntheticEvent = new Event(
      "submit"
    ) as unknown as FormEvent<HTMLFormElement>;
    handleSubmit(syntheticEvent);
  };

  useEffect(() => {
    const formElement = document.getElementById("top-profile");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [profileForm]);

  return (
    <div
      className={` ${
        profileForm ? "w-full" : "w-0"
      } right-0 bg-none fixed z-[2] h-[100dvh]`}
    >
      <div
        className={` ${
          profileForm ? "right-0 ss:w-[450px]" : "-right-[450px] ss:w-[450px] "
        } transition-all duration-300 absolute w-full bg-white h-full z-[4] `}
      >
        <div
          className={`h-full flex flex-col w-full justify-between gap-8 p-8 pt-0 overflow-y-scroll bg-white`}
        >
          <div>
            <div className="w-full flex justify-end mb-10">
              <Image
                src="/assets/x (1).png"
                width={18}
                height={18}
                alt="cancel"
                onClick={() => {
                  setProfileForm(false);
                }}
                id="top-profile"
                className="cursor-pointer pt-8"
              />
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
              <div className=" mb-8 text-navyBlue">
                <div className="text-[14px] mb-1 font-semibold ">
                  Change your Profile Picture
                </div>
                <div className="flex items-center h-full gap-4">
                  <label
                    htmlFor="avatarInput"
                    className="cursor-pointer flex gap-2 items-center"
                  >
                    <input
                      type="file"
                      id="avatarInput"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={updateImage}
                    />
                    <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
                      <Image
                        src={
                          CDNURL + userId + "/avatar.png" || "/assets/user.png"
                        }
                        width={3000}
                        height={3000}
                        alt="user"
                        quality={100}
                        className="w-[100px] h-[100px] object-cover"
                        priority
                      />
                    </div>
                    <p>Tap to change</p>
                  </label>
                </div>
              </div>
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
                    className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 mb-4 capitalize h-[56px] "
                    placeholder="Enter your Full Name"
                  />
                </div>
              </div>
              <div className="w-full">
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor="phone"
                    className="text-[14px] mb-1 font-semibold text-navyBlue"
                  >
                    Phone Number
                  </label>
                  <input
                    type="phone"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    required
                    onChange={handleInputChange}
                    className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 mb-4 capitalize h-[56px] "
                    placeholder="Enter your Full Name"
                  />
                </div>
              </div>
            </form>
          </div>
          <button
            onClick={handleClick}
            disabled={loading}
            className={`font-semibold text-white rounded-[10px] w-full items-center 
              justify-center flex transition duration-300 ${
                loading ? "bg-navyBlue opacity-85" : "bg-blue-700 h-14"
              }`}
          >
            {loading ? (
              <div className=" h-14 flex items-center">
                <div className="loaderInfinity" />
              </div>
            ) : (
              <div className="h-14 flex items-center">PROCEED</div>
            )}
          </button>
        </div>
      </div>
      <div
        onClick={() => {
          setProfileForm(false);
        }}
        className="absolute w-full h-full bg-grey opacity-[40] z-[3]"
      />
    </div>
  );
};

export default ProfileForm;
