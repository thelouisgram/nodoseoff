import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateIsAuthenticated, updateUserId } from "../../../store/stateSlice";
import { useAuth } from "../../../contexts/AuthContext"; // Import the new hook

const SignIn = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { signIn, user, loading: authLoading } = useAuth(); // Destructure signIn and user/loading state from context

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // Use a separate loading state for the form submission
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

  // 1. Redirect if the user is already authenticated (using the context user state)
  useEffect(() => {
    // Check if the user is available and not in the initial loading state
    if (!authLoading && user) {
      dispatch(updateIsAuthenticated(true));
      dispatch(updateUserId(user.id));
      router.push("/dashboard");
    }
    // Also, if the auth is not loading but there's no user, ensure isAuthenticated is false
    if (!authLoading && !user) {
        dispatch(updateIsAuthenticated(false));
    }
  }, [user, authLoading, dispatch, router]);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.password || !formData.email) {
      setErrorMessage("Input Email & Password");
      return;
    }

    setFormSubmitting(true); // Start form submission loading
    setErrorMessage("");

    try {
      // 2. Use the signIn function from AuthContext
      await signIn(formData.email, formData.password);
      
      // The useEffect above will handle the dispatch and redirect when the 'user' state 
      // in the AuthContext updates after a successful sign in.
      
    } catch (error: any) {
      // Catch any error thrown by the context's signIn function
      const message = error.message || "An unknown error occurred during sign in.";
      setErrorMessage("Error signing in: " + message);
      setFormSubmitting(false); // Stop loading on failure
    } finally {
      // We don't set formSubmitting to false on success here, because the redirect
      // will happen via the useEffect hook.
    }
  };

  return (
    <>
      <Head>
        <title>NoDoseOff | Login</title>
      </Head>
      
      {/* ... rest of your existing JSX UI remains the same ... */}
      <div className="relative min-h-screen w-full flex flex-col justify-center items-center
       bg-navyBlue font-karla text-grey overflow-hidden py-7 px-3">
        {/* Your SVG background and Logo link */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 720"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke="#9CA3AF"
            strokeOpacity=".7"
            d="M-15.227 702.342H1439.7"
          />
          <circle
            cx="711.819"
            cy="372.562"
            r="308.334"
            stroke="#9CA3AF"
            strokeOpacity=".7"
          />
          <circle
            cx="16.942"
            cy="20.834"
            r="308.334"
            stroke="#9CA3AF"
            strokeOpacity=".7"
          />
          <path
            stroke="#9CA3AF"
            strokeOpacity=".7"
            d="M-15.227 573.66H1439.7M-15.227 164.029H1439.7"
          />
          <circle
            cx="782.595"
            cy="411.166"
            r="308.334"
            stroke="#9CA3AF"
            strokeOpacity=".7"
          />
        </svg>

        <Link href="/">
          <Image
            src="/assets/logo/logo-with-name-white.png"
            width={180}
            height={60}
            alt="logo"
            className="mb-10 relative z-10"
          />
        </Link>

        <form
          className="bg-white rounded-[15px] w-full ss:w-[450px] p-6 ss:p-10 mb-10 relative z-10"
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
            />
          </div>

          <div className="flex flex-col mb-8">
            <label htmlFor="passwordLogIn" className="text-[14px] mb-1">
              Password
            </label>
            <div className="justify-between w-full bg-[#EDF2F7] rounded-[10px] flex items-center p-4">
              <input
                type={showPassword ? "text" : "password"}
                id="passwordLogIn"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] w-full"
                placeholder="Password"
              />
              <button
                type="button"
                className="text-gray-500 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                <Image
                  src={showPassword ? "/assets/hide.png" : "/assets/show.png"}
                  width={20}
                  height={20}
                  alt="show password"
                />
              </button>
            </div>
          </div>

          {errorMessage && (
            <p className="mb-4 -mt-4 text-red-500 font-[500] text-[14px] text-center">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            // Use the formSubmitting state for the button
            disabled={formSubmitting}
            className={`font-semibold text-white rounded-[10px] h-[56px] w-full flex items-center justify-center transition duration-300 ${
              formSubmitting ? "bg-navyBlue opacity-85" : "bg-blue-700"
            }`}
          >
            {formSubmitting ? <div className="loaderInfinity"></div> : "LOG IN"}
          </button>
        </form>

        <div className="w-full flex flex-col items-center relative z-10">
          <Link href="/signup" className="text-white hover:underline">
            Don&apos;t have an account? Create Account
          </Link>
          <Link
            href="/forgetpassword"
            className="text-white text-center mt-8 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignIn;