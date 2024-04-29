import { useState, ChangeEvent, FormEvent } from "react";
import supabase from "../../../utils/supabaseClient";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        setErrorMessage(
          "Error sending password recovery email: " + error.message
        );
      } else {
        setSuccessMessage(
          "Password recovery email sent successfully. Please check your inbox."
        );
      }
    } catch (error) {
      setErrorMessage("Error resetting password: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password | NoDoseOff</title>
      </Head>
      <div className="min-h-screen flex flex-col justify-center items-center bg-navyBlue text-grey font-karla">
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
              Forgot your password?
            </legend>
            <p className="text-center text-[14px]">
              Enter your email to reset your password
            </p>
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="email" className="text-[14px] mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 mb-4"
              placeholder="Email Address"
              required
            />
          </div>
          {errorMessage && (
            <p className="mb-4 -mt-4 text-red-600 font-semibold text-[14px]">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="mb-4 -mt-4 text-green-600 font-semibold text-[14px] leading-tight">
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
              "Send Password Recovery Email"
            )}
          </button>
        </form>
        <div className="w-full flex flex-col items-center">
          <Link href="/login" className="text-white mt-4">
            Back to Sign In
          </Link>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;