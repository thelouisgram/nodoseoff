import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";

const SignIn = () => {
  const router = useRouter();
  const { signIn, user, loading: authLoading } = useAuth();
  const { setIsAuthenticated, setUserId } = useAppStore((state) => state);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (!authLoading && user) {
      setIsAuthenticated(true);
      setUserId(user.id);
      router.push("/dashboard");
    }
    if (!authLoading && !user) {
      setIsAuthenticated(false);
    }
  }, [user, authLoading, router, setIsAuthenticated, setUserId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.password || !formData.email) {
      setErrorMessage("Input Email & Password");
      return;
    }
    setFormSubmitting(true);
    setErrorMessage("");
    try {
      await signIn(formData.email, formData.password);
    } catch (error: any) {
      const message =
        error.message || "An unknown error occurred during sign in.";
      setErrorMessage("Error signing in: " + message);
      setFormSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - NoDoseOff</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
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
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to continue managing your medications
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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

            <div className="flex items-center justify-end">
              <Link
                href="/forgetpassword"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={formSubmitting}
            >
              {formSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition"
              >
                Create Account
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default SignIn;
