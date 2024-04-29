import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import supabase from "../../../utils/supabaseClient";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

const SetNewPassword = () => {
  const router = useRouter();
  const { query } = router;
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        email: user?.email,
        password: newPassword,
      });

      if (error) {
        setErrorMessage("Error updating password: " + error.message);
      } else {
        setSuccessMessage("Password updated successfully! Redirecting...");
        // Redirect to the login page after a successful password reset
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Set New Password | NoDoseOff</title>
      </Head>
      <div className="min-h-[100dvh] w-[100%] py-8 px-6 flex flex-col justify-center items-center ss:py-10 bg-navyBlue font-karla text-grey">
        <Link href="/">
          <Image
            src="/assets/logo/logo with name png - white color.png"
            width={3912}
            height={1000}
            alt="logo"
            className="w-[180px] h-auto mb-10"
            priority
          />
        </Link>
        <form
          className="bg-white rounded-[15px] w-full ss:w-[450px] h-auto p-7 ss:p-10 mb-10"
          onSubmit={handleSubmit}
        >
          <div className="mb-10 w-full items-center flex flex-col">
            <legend className="text-[24px] font-bold text-blue-700 text-center">
              Set New Password
            </legend>
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="newPassword" className="text-[14px] mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 mb-4"
              placeholder="New Password"
              required
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="confirmPassword" className="text-[14px] mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 mb-4"
              placeholder="Confirm New Password"
              required
            />
          </div>
          {errorMessage && (
            <p className="mb-4 -mt-4 text-red-600 font-semibold text-[14px]">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="mb-4 -mt-4 text-green-600 font-semibold text-[14px]">
              {successMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`font-semibold text-white rounded-[10px] h-[56px] w-full items-center justify-center flex transition duration-300 ${
              loading ? "bg-navyBlue opacity-85" : "bg-blue-700"
            }`}
          >
            {loading ? (
              <div className="loaderInfinity"></div>
            ) : (
              "Set New Password"
            )}
          </button>
        </form>
        <div className="w-full flex flex-col items-center">
          <Link href="/login" className="text-white">
            Back to Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default SetNewPassword;
