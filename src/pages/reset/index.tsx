/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import supabase from "../../../utils/supabase";
import Image from 'next/image'
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { toast } from "sonner";

const ResetPassword = () => {
  const router = useRouter();
 const { userId } = useSelector(
   (state: RootState) => state.app
 );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!userId) {
      router.push("/login");
    }
  }, []);

  const fetchUserData = async () => {
  try {
    // Fetch user information
    const { data: user, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error fetching user:', error);
    } else {
      console.log('Authenticated user:', user);
    }
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

// Call the function to fetch user data
fetchUserData();

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setErrorMessage("Please fill in both password fields.");
    } else if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
    } else {
      setLoading(true);
      setErrorMessage("");

      try {
        // Update the user's password using the token
        const { error } = await supabase.auth.updateUser(
          { password },
        );

        if (error) {
          setErrorMessage(`Error updating password: ${error.message}`);
        } else {
          toast.success("Password updated successfully. Please log in.");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
      } catch (error) {
        setErrorMessage(`Error updating password: ${error}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>NoDoseOff | Reset Password</title>
      </Head>
      <div className="min-h-[100dvh] w-full py-8 px-6 flex flex-col justify-center items-center ss:py-10 bg-navyBlue font-karla text-grey">
        <Link href="/">
          <Image
            src="/assets/logo/logo with name png - white color.png"
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
            <legend className="text-[24px] font-bold text-blue-700 text-center font-Inter">
              Reset Password
            </legend>
            <p className="text-center text-[14px]">
              Please enter your new password
            </p>
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="password" className="text-[14px] mb-1">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 mb-4"
              placeholder="New Password"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="confirmPassword" className="text-[14px] mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 mb-4"
              placeholder="Confirm New Password"
            />
          </div>
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
              loading ? "bg-navyBlue opacity-85" : "bg-blue-700"
            }`}
          >
            {loading ? (
              <div className="loaderInfinity"></div>
            ) : (
              "Update Password"
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

export default ResetPassword;
