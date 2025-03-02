"use-client";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../../../utils/supabase";

import { updateIsAuthenticated, updateUserId } from "../../../store/stateSlice";
import { useDispatch } from "react-redux";
import Head from "next/head";
import ReCAPTCHA from "react-google-recaptcha";
import { sendWelcomeEmail } from "../../../utils/lib/sendWelcomeMail";

const CreateAccount = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const recaptchaSiteKey: string =
    process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setConfirmPassword(value);
  };

  const [errorMessage, setErrorMessage] = useState("");

  async function fetchLocalImage() {
    try {
      // Fetch the image from your local assets directory
      const response = await fetch("/assets/user.png");
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

    if (formData.password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!captchaToken) {
      setErrorMessage("Please complete the CAPTCHA verification.");
      return;
    }

    const fieldsEmpty = Object.values(formData).some((field) => field === "");
    if (fieldsEmpty) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    // Check password strength (at least 6 characters)
    if (formData.password.length < 6) {
      setErrorMessage(
        "Please enter a password that is at least 6 characters long."
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      // Sign up the user
      const { error: signUpError, data: signUpData } =
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

      if (signUpError) {
        setErrorMessage("Error signing up: " + signUpError.message);
        setLoading(false);
        return;
      }

      const userId = signUpData.user?.id;
      if (userId) {
        dispatch(updateIsAuthenticated(true));
        dispatch(updateUserId(userId));

        // Add user info to the database
        const { error: insertError } = await supabase.from("users").insert({
          name: formData.fullName,
          phone: formData.phoneNumber,
          email: formData.email,
          userId: userId,
          schedule: [],
        });

        if (insertError) {
          setErrorMessage("Error occurred while adding user info.");
          setLoading(false);
          return;
        }

        // Fetch and upload the local profile picture
        const file = await fetchLocalImage();
        const { error: uploadError } = await supabase.storage
          .from("profile-picture")
          .upload(`${userId}/avatar.png`, file);

        if (uploadError) {
          console.error("Error uploading profile picture:", uploadError);
          setLoading(false);
          return;
        }

        await sendWelcomeEmail(formData.email, formData.fullName);

        // Redirect to the dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>NoDoseOff | DashBoard</title>
      </Head>
      <div className="min-h-[100dvh] w-[100%] py-8 px-6 flex flex-col justify-center items-center ss:py-10 bg-navyBlue font-karla text-grey">
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
            <legend className="text-[24px] font-bold text-blue-700 font-Inter">
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
            <div className="w-full bg-[#EDF2F7] rounded-[10px] mb-4 flex p-4">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="border bg-[#EDF2F7] border-none outline-none rounded-[10px]  w-full"
                placeholder="Password"
              />
              <button
                type="button"
                className="text-gray-500 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                <Image
                  src={showPassword ? "/assets/hide.png" : "/assets/show.png"}
                  width={512}
                  height={512}
                  className="h-5 w-5"
                  alt="show password"
                />
              </button>
            </div>
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="confirmPassword" className="text-[14px] mb-1">
              Confirm Password
            </label>
            <div className="w-full bg-[#EDF2F7] rounded-[10px] mb-4 flex p-4">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="password"
                value={confirmPassword}
                onChange={handleConfirmPassword}
                className="border bg-[#EDF2F7] border-none outline-none rounded-[10px]  w-full"
                placeholder="Password"
              />
              <button
                type="button"
                className="text-gray-500 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Image
                  src={
                    showConfirmPassword
                      ? "/assets/hide.png"
                      : "/assets/show.png"
                  }
                  width={512}
                  height={512}
                  className="h-5 w-5"
                  alt="show password"
                />
              </button>
            </div>
          </div>
          {errorMessage && (
            <p className="mb-4 -mt-4 text-red font-[500] tracking-none leading-none text-[14px]">
              {errorMessage}
            </p>
          )}
          {/* CAPTCHA Verification */}
          <ReCAPTCHA
            onChange={setCaptchaToken}
            sitekey={recaptchaSiteKey}
            className="mx-auto mb-8"
          />
          <button
            type="submit"
            disabled={loading}
            className={` text-white rounded-[10px] h-[56px] w-full items-center justify-center flex transition duration-300 font-semibold ${
              loading ? "bg-navyBlue" : "bg-blue-700"
            }`}
          >
            {loading ? (
              <div className="loaderInfinity"></div>
            ) : (
              "CREATE AN ACCOUNT"
            )}
          </button>
        </form>
        <Link href="/login" className="text-white hover:underline">
          Already have an account? Login
        </Link>
      </div>
    </>
  );
};

export default CreateAccount;
