/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
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
        setErrorMessage("Error signing up: " + error);
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
        <title>NoDoseOff | DashBoard</title>
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
          className="bg-white rounded-[15px]  w-full ss:w-[450px] h-auto p-7 ss:p-10 mb-10"
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
                  width={512}
                  height={512}
                  className="h-5 w-5"
                  alt="show password"
                />
              </button>
            </div>
          </div>
          {errorMessage && (
            <p className="mb-4 -mt-4 text-red font-[500] tracking-none leading-none text-[14px]">
              {errorMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className={` font-semibold text-white rounded-[10px] h-[56px] w-full items-center justify-center flex transition duration-300 ${
              loading ? "bg-navyBlue opacity-85" : "bg-blue-700"
            }`}
          >
            {loading ? <div className="loaderInfinity"></div> : "LOG IN"}
          </button>
        </form>
        <div className="w-full flex flex-col items-center">
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
