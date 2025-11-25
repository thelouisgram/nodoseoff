import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateIsAuthenticated, updateUserId } from "../../../store/stateSlice";
import supabase from "../../../utils/supabase";

const SignIn = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.password || !formData.email) {
      setErrorMessage("Input Email & Password");
    } else {
      setLoading(true);
      setErrorMessage("");
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) {
          setErrorMessage("Error signing in: " + error.message);
          setLoading(false);
        } else {
          const user = await supabase.auth.getUser();
          const userId = user.data.user?.id;
          if (userId) {
            dispatch(updateIsAuthenticated(true));
            dispatch(updateUserId(userId));
            router.push("/dashboard");
          }
        }
      } catch (error) {
        setErrorMessage("Error signing in: " + error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      if (userId) {
        dispatch(updateIsAuthenticated(true));
      }
    };
    getUser();
  }, []);

  return (
    <>
      <Head>
        <title>NoDoseOff | SignIn</title>
      </Head>

      {/* Parent relative container */}
      <div className="relative min-h-screen w-full flex flex-col justify-center items-center bg-navyBlue font-karla text-grey overflow-hidden">
        {/* --- Geometric SVG Background --- */}
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

        {/* --- Logo --- */}
        <Link href="/">
          <Image
            src="/assets/logo/logo with name png - white color.png"
            width={180}
            height={60}
            alt="logo"
            className="mb-10 relative z-10"
          />
        </Link>

        {/* --- Sign In Form --- */}
        <form
          className="bg-white rounded-[15px] w-full ss:w-[450px] p-7 ss:p-10 mb-10 relative z-10"
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
            <p className="mb-4 -mt-4 text-red font-[500] text-[14px] text-center">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`font-semibold text-white rounded-[10px] h-[56px] w-full flex items-center justify-center transition duration-300 ${
              loading ? "bg-navyBlue opacity-85" : "bg-blue-700"
            }`}
          >
            {loading ? <div className="loaderInfinity"></div> : "LOG IN"}
          </button>
        </form>

        {/* --- Links --- */}
        <div className="w-full flex flex-col items-center relative z-10">
          <Link href="/signup" className="text-white hover:underline">
            Don't have an account? Create Account
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
