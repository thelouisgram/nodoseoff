/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import { createClient } from "../../../lib/supabase/client";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useAppStore } from "../../../store/useAppStore";

const ForgotPassword = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

   const supabase = createClient()

   const {setIsAuthenticated, setUserId} = useAppStore((state) => state);


  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Handling OTP verification
    if (showOtp) {
      // Verify the OTP
      try {
        const {
          error,
        } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: "email",
        });

        if (error) {
          setErrorMessage("Error verifying OTP: " + error.message);
          setSuccessMessage("");
        } else {
          toast.success("OTP verification successful!");
          setErrorMessage("");
        const user = await supabase.auth.getUser();
        const userId = user.data.user?.id;
        if (userId) {
          setUserId(userId);
          setIsAuthenticated(true);
          router.push("/reset");
        }
        }
      } catch (err) {
        setErrorMessage("An error occurred during OTP verification: " + err);
        setSuccessMessage("");
      }
    } else {
      // Handling password reset request
      if (!email) {
        setErrorMessage("Please enter your email address.");
        setSuccessMessage("");
      } else {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
          const { data: dataUser, error } =
            await supabase.auth.resetPasswordForEmail(email);

          if (error) {
            setErrorMessage("Error: " + error.message);
            setSuccessMessage("");
          } else {
            setShowOtp(true);
            toast.success(
              "Password reset email sent. Please check your email."
            );
            setErrorMessage("");
          }
        } catch (err) {
          setErrorMessage(
            "An error occurred while sending password reset email: " + err
          );
          setSuccessMessage("");
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    <>
      <Head>
        <title>NoDoseOff | Forgot Password</title>
      </Head>
      <div className="min-h-[100dvh] w-full py-8 px-6 flex flex-col justify-center items-center ss:py-10 bg-navyBlue font-karla text-grey">
        <Link href="/">
          <Image
            src="/assets/logo/logo-with-name-white.png"
            width={1062}
            height={212}
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
            <legend className="text-[24px] font-bold text-blue-600 text-center font-Inter">
              Forgot Password
            </legend>
            <p className="text-center text-[14px]">
              {showOtp ? 'Please check your Email inbox for the OTP.' : 'Enter your email to reset your password'}
            </p>
          </div>
          {!showOtp ? (
            <div className="flex flex-col mb-4">
              <label htmlFor="email" className="text-[14px] mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 mb-4"
                placeholder="Email Address"
              />
            </div>
          ) : (
            <div className="flex flex-col mb-4">
              <label htmlFor="otp" className="text-[14px] mb-1">
                OTP:
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={handleOtpChange}
                className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 mb-4"
                placeholder="Email Otp"
                required
              />
            </div>
          )}
          {errorMessage && (
            <p className="mb-4 -mt-4 text-red font-[500] tracking-none leading-none text-[14px]">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="mb-4 -mt-4 text-green-600 font-[500] tracking-none leading-none text-[14px]">
              {successMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`font-semibold text-white rounded-[10px] h-[56px] w-full items-center justify-center flex transition duration-300 ${
              loading ? "bg-navyBlue opacity-85" : "bg-blue-600"
            }`}
          >
            {loading ? (
              <div className="loaderInfinity"></div>
            ) : showOtp ? (
              "Confirm Otp"
            ) : (
              "Send Recovery Email"
            )}
          </button>
        </form>
        <div className="w-full flex flex-col items-center">
          <Link href="/login" className="text-white hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
