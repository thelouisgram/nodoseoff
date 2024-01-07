import Image from "next/image";
import Link from "next/link";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../../../utils/supabaseClient";
import { toast } from "sonner";
import { updateIsAuthenticated, updateUserId } from "../../../store/stateSlice";
import { useDispatch } from "react-redux";

const CreateAccount = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEffectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Password strength validation (can be customized)
    const strongPasswordRegex = /^(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!strongPasswordRegex.test(formData.password)) {
      toast.error(
        "Please enter a strong password (minimum eight characters, one small letter, and one number)"
      );
      return;
    }

    for (const key in formData) {
      if (formData[key as keyof typeof formData] === "") {
        toast.error("Please fill in all fields");
        return;
      }
    }

    toast.loading("Signing Up");

    try {
      // Sign up the user
      const { error: signUpError, data } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) {
        toast.error("Error signing up: " + signUpError.message);
        return;
      }

      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      if (userId) {
        dispatch(updateIsAuthenticated(true));
        dispatch(updateUserId(userId));
      }
      // Add user info to the database
      const { error: addInfoError } = await supabase.from("users").insert({
        name: formData.fullName,
        role: formData.role,
        phone: formData.phoneNumber,
        email: formData.email,
        userId: userId,
        schedule: {},
      });

      if (addInfoError) {
        toast.error("Failed to insert data into the database");
        return;
      }

      // Both operations succeeded
      router.push("/dashboard");
      toast.success("Signed up and information added");
    } catch (error) {
      // Handle any unexpected errors
      toast.error("Error: " + error);
    }

    // Reset form data
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      role: "",
      password: "",
    });
  };

  return (
    <div className="min-h-[100dvh] w-[100%] py-8 px-6 flex flex-col justify-center items-center ss:py-10 bg-navyBlue">
      <Image
        src="/assets/pill perfect png2.png"
        width={3916}
        height={1092}
        quality={100}
        alt="logo"
        className="w-[200px] h-auto mb-10"
      />
      <form
        className="bg-white rounded-[15px] rounded-bl-none w-full ss:w-[450px] h-auto p-7 ss:p-10 mb-10"
        onSubmit={handleSubmit}
      >
        <div className="mb-10">
          <legend className="text-[24px] font-bold text-darkBlue text-center">
            Create an Account
          </legend>
          <p className="text-center text-[14px]">
            Welcome to the future of Drug Monitoring
          </p>
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="fullName" className="text-[14px] mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 mb-4"
            placeholder="Full Name"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="email" className="text-[14px] mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 mb-4"
            placeholder="Email Address"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="phoneNumber" className="text-[14px] mb-1">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 mb-4"
            placeholder="Phone Number"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="role" className="text-[14px] mb-1 ">
            Select your Role:
          </label>
          <div className="bg-[#EDF2F7] outline-none rounded-[10px] w-full px-4 mb-4 h-[56px]">
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleEffectChange}
              className=" bg-[#EDF2F7] border-none w-full outline-none py-4 cursor-pointer h-[56px]"
            >
              <option value="">Select Role</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="password" className="text-[14px] mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 mb-4"
            placeholder="Password"
          />
        </div>
        <button
          type="submit"
          className="bg-darkBlue text-white rounded-[10px] w-full text-center py-4 rounded-bl-none px-4 hover:bg-navyBlue transition duration-300"
        >
          CREATE AN ACCOUNT
        </button>
      </form>
      <Link href="/signIn" className="text-white">
        Already have an account? Login
      </Link>
    </div>
  );
};

export default CreateAccount;
