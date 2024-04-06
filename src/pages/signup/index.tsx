import Image from "next/image";
import Link from "next/link";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../../../utils/supabaseClient";
import { toast } from "sonner";
import { updateIsAuthenticated, updateUserId } from "../../../store/stateSlice";
import { useDispatch } from "react-redux";
import Head from "next/head";

const CreateAccount = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  async function fetchLocalImage() {
    try {
      // Fetch the image from your local assets directory
      const response = await fetch("/assets/icons8-user-100.png");
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      // Convert the image response to a blob
      const blob = await response.blob();

      return blob; // Return the image blob
    } catch (error) {
      console.error("Error fetching local image:", error);
      throw new Error("Error fetching local image");
    }
  }

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
    setLoading(true);
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
        phone: formData.phoneNumber,
        email: formData.email,
        userId: userId,
        schedule: [],
      });
      if (addInfoError) {
        toast.error("Failed to insert data into the database");
        return;
      }

      // Fetch local image and upload
      const file = await fetchLocalImage(); // Fetch local image
      const { error: uploadError } = await supabase.storage
        .from("profile-picture")
        .upload(`${userId}/avatar.png`, file); // Upload fetched image

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        toast.error("Error uploading image");
        return;
      }

      // Both operations succeeded
      router.push("/dashboard");
      toast.success("Signed up and information added");
    } catch (error) {
      // Handle all unexpected errors
      toast.error("Error: " + error);
      setLoading(false);
    }

    // Reset form data
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
    });
  };

  return (
    <>
      <Head>
        <title>NoDoseOff | DashBoard</title>
      </Head>
      <div className="min-h-[100dvh] w-[100%] py-8 px-6 flex flex-col justify-center items-center ss:py-10 bg-navyBlue font-karla text-blackII">
        <Link href="/">
          <Image
            src="/assets/logo/logo with name png - white color.png"
            width={3916}
            height={1092}
            quality={100}
            alt="logo"
            className="w-[180px] h-auto mb-10"
            priority
          />
        </Link>
        <form
          className="bg-white rounded-[15px]  w-full ss:w-[450px] h-auto p-7 ss:p-10 mb-10"
          onSubmit={handleSubmit}
        >
          <div className="mb-10 w-full items-center flex flex-col">
            <legend className="text-[24px] font-bold text-darkBlue font-Inter">
              Create an Account
            </legend>
            <p className="text-[14px]">
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
            disabled={loading}
            className={`bg-darkBlue text-white rounded-[10px] h-[56px] w-full items-center justify-center flex transition duration-300 font-semibold ${
              loading ? "bg-navyBlue" : "after:"
            }`}
          >
            {loading ? (
              <div className="loaderInfinity"></div>
            ) : (
              "CREATE AN ACCOUNT"
            )}
          </button>
        </form>
        <Link href="/login" className="text-white">
          Already have an account? Login
        </Link>
      </div>
    </>
  );
};

export default CreateAccount;
