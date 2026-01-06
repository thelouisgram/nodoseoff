"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@/lib/supabase/client";
import Head from "next/head";
import ReCAPTCHA from "react-google-recaptcha";
import { sendMail } from "@/utils/sendEmail";
import { generateWelcomeEmail } from "@/emails/welcomeMail";
import { useAuth } from "@/contexts/AuthContext";
import { EyeOff, Eye, Pill } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import Image from "next/image";
import { motion } from "framer-motion";

const CreateAccount = () => {
  const supabase = createClient();
  const router = useRouter();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const recaptchaSiteKey: string =
    process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY ?? "";
  const { setIsAuthenticated, setUserId } = useAppStore((state) => state);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
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

    if (formData.password.length < 6) {
      setErrorMessage(
        "Please enter a password that is at least 6 characters long."
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const { user: signedUpUser, error: signUpError } = await signUp(
        formData.email,
        formData.password
      );

      if (signUpError || !signedUpUser) {
        setErrorMessage(
          "Error signing up: " + (signUpError?.message || "Sign up failed.")
        );
        setLoading(false);
        return;
      }

      const userId = signedUpUser.id;

      if (userId) {
        setUserId(userId);
        setIsAuthenticated(true);

        const { error: userError } = await supabase.from("users").insert({
          name: formData.fullName,
          phone: formData.phoneNumber,
          email: formData.email,
          userId: userId,
        });

        if (userError) throw userError;

        await supabase.from("schedule").insert({
          userId: userId,
          schedule: [],
        });

        await supabase.from("completedDrugs").insert({
          userId: userId,
          completedDrugs: [],
        });

        await supabase.from("drugHistory").insert({
          userId: userId,
          otcDrugs: "",
          herbs: "",
        });

        const { html, subject } = generateWelcomeEmail();
        await sendMail(formData.email, html, subject);

        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrorMessage(
        "An unexpected error occurred during profile creation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Account - NoDoseOff</title>
      </Head>

      <div className="min-h-screen flex">
        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Mobile Logo */}
            <Link href="/">
              <div className="w-full flex justify-center">
                <Image
                  src="/assets/logo/logo-with-name-blue.png"
                  width={180}
                  height={60}
                  alt="logo"
                  className="mb-10 relative z-10 dark:hidden"
                />
                <Image
                  src="/assets/logo/logo-with-name-white.png"
                  width={180}
                  height={60}
                  alt="logo"
                  className="mb-10 relative z-10 hidden dark:block"
                />
              </div>
            </Link>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Start managing your medications today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-2.5 pr-12 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full px-4 py-2.5 pr-12 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={handleConfirmPassword}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
                  <svg
                    className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
                    <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" />
                  </svg>
                  <span className="text-sm text-red-800 dark:text-red-200">
                    {errorMessage}
                  </span>
                </div>
              )}

              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey={recaptchaSiteKey}
                  onChange={(token) => setCaptchaToken(token || "")}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CreateAccount;
