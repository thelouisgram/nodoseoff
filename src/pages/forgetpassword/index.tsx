/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { toast } from "sonner";
import { useAppStore } from "../../store/useAppStore";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const supabase = createClient();

  const { setIsAuthenticated, setUserId } = useAppStore((state) => state);

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
      try {
        const { error } = await supabase.auth.verifyOtp({
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
        <title>Forgot Password - NoDoseOff</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/">
            <div className="w-full flex justify-center">
              <Image
                src="/assets/logo/logo-with-name-blue.png"
                width={180}
                height={60}
                alt="logo"
                className="mb-10 relative z-10"
              />
            </div>
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Password
            </h2>
            <p className="text-gray-600">
              {showOtp
                ? "Please check your email inbox for the OTP"
                : "Enter your email to reset your password"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!showOtp ? (
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                  required
                />
              </div>
            ) : (
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                  placeholder="Enter 6-digit code"
                  required
                />
              </div>
            )}

            {errorMessage && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <svg
                  className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
                  <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" />
                </svg>
                <span className="text-sm text-red-800">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <svg
                  className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm text-green-800">{successMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : showOtp ? (
                "Confirm OTP"
              ) : (
                "Send Recovery Email"
              )}
            </button>

            <p className="text-center text-sm text-gray-600">
              <Link
                href="/login"
                className="text-blue-600 font-semibold hover:text-blue-700 transition"
              >
                Back to Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
