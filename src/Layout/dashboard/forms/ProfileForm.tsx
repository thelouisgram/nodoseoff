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
import supabase from "../../../../utils/supabaseClient";
import { toast } from "sonner";
import { updateInfo } from "../../../../store/stateSlice";

type RefObject<T> = React.RefObject<T>;

interface ProfileFormProps {
  setProfileForm: Function;
  profileForm: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  setProfileForm,
  profileForm,
}) => {
  const { info, userId } = useSelector((state: RootState) => state.app);
  const { name, phone, email, role, otcDrugs, herbs } = info[0];
  const dispatch = useDispatch();

  const dropdownRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent): void => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setProfileForm(false);
    }
  };
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      handleClickOutside(event);
    };

    // add event listener for clicks outside of dropdown
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      // remove event listener when component unmounts
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const [formData, setFormData] = useState({
    name: name,
    phone: phone,
    email: email,
    role: role,
    otcDrugs: otcDrugs,
    herbs: herbs,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: formData.name,
          phone: formData.phone,
        })
        .eq("userId", userId);

      if (error) {
        console.error("Failed to update profile", error);
        return;
      }

      dispatch(updateInfo([formData]));
      setProfileForm(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating Profile:", error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.toLowerCase(),
    });
  };

  return (
    <div
      className={` ${
        profileForm ? "w-full h-[100dvh] over" : "w-0 h-0"
      } right-0 bg-none fixed z-[32]`}
    >
      <div
        ref={dropdownRef}
        className={` ${
          profileForm
            ? "right-0 ss:w-[450px] h-full"
            : "-right-[450px] ss:w-[450px] h-full"
        } transition-all duration-300 absolute w-full bg-white h-full z-[4] `}
      >
        <div className={`h-[100dvh] w-full bg-white p-8 overflow-y-scroll app`}>
          <div className="w-full flex justify-end mb-10">
            <Image
              src="/assets/x (1).png"
              width={24}
              height={24}
              alt="cancel"
              onClick={() => {
                setProfileForm(false);
              }}
              className="cursor-pointer"
            />
          </div>
          <div className="mb-10">
            <h1 className="text-[24px] text-darkBlue font-bold">Basic Data</h1>
          </div>
          <form
            onSubmit={handleSubmit}
            className="h-auto flex flex-col justify-between w-full"
          >
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
            <button
              type="submit"
              className="mt-8 font-semibold bg-darkBlue text-white rounded-[10px] w-full text-center py-4 rounded-bl-none px-4 hover:bg-navyBlue transition duration-300"
            >
              UPDATE PROFILE
            </button>
          </form>
        </div>
      </div>
      <div
        onClick={() => {
          setProfileForm(false);
        }}
        className="absolute w-full h-full bg-blackII opacity-[40] z-[3]"
      />
    </div>
  );
};

export default ProfileForm;
