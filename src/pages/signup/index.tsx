// pages/login/index.tsx
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";

const SignIn = () => {
  const router = useRouter();
  const { signIn, user, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error message when user starts typing
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        // Handle specific error messages
        if (error.message.includes("Invalid login credentials")) {
          setErrorMessage("Invalid email or password");
        } else if (error.message.includes("Email not confirmed")) {
          setErrorMessage("Please verify your email before signing in");
        } else {
          setErrorMessage(error.message || "Error signing in");
        }
        toast.error("Sign in failed");
      } else {
        toast.success("Signed in successfully!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      setErrorMessage("An unexpected error occurred");
      toast.error("Sign in failed");
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>NoDoseOff | Login</title>
      </Head>
      <div className="min-h-[100dvh] w-[100%] py-8 px-6 flex flex-col justify-center items-center ss:py-10 bg-navyBlue font-karla text-grey">
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
              Login to your account
            </legend>
            <p className="text-center text-[14px]">
              Welcome to the future of Drug Monitoring
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
              value={formData.email}
              onChange={handleInputChange}
              className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 mb-4"
              placeholder="Email Address"
              disabled={loading}
            />
          </div>

          <div className="flex flex-col mb-8">
            <label htmlFor="password" className="text-[14px] mb-1">
              Password
            </label>
            <div className="justify-between w-full bg-[#EDF2F7] rounded-[10px] flex items-center p-4">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] w-full"
                placeholder="Password"
                disabled={loading}
              />
              <button
                type="button"
                className="text-gray-500 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Image
                  src={showPassword ? "/assets/hide.png" : "/assets/show.png"}
                  width={512}
                  height={512}
                  className="h-5 w-5"
                  alt="toggle password visibility"
                />
              </button>
            </div>
          </div>

          {errorMessage && (
            <p className="mb-4 -mt-4 text-red-600 font-[500] text-[14px]">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`font-semibold text-white rounded-[10px] h-[56px] w-full items-center justify-center flex transition duration-300 ${
              loading ? "bg-navyBlue opacity-85 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            {loading ? <div className="loaderInfinity"></div> : "LOG IN"}
          </button>
        </form>

        <div className="w-full flex flex-col items-center gap-4">
          <Link href="/signup" className="text-white hover:underline">
            Don`&#39;`t have an account? Create Account
          </Link>
          <Link href="/forgetpassword" className="text-white hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignIn;