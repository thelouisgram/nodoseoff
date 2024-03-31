/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";
import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import supabase from "../../../utils/supabaseClient";
import { updateIsAuthenticated, updateUserId } from "../../../store/stateSlice";
import { useDispatch } from "react-redux";
import Head from "next/head";

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
      toast.error("Input Email & Password");
    } else {
      setLoading(true);
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) {
          toast.error("Error signing in: " + error.message);
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
        toast.error("Error signing up: " + error);
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
      <div className="min-h-[100dvh] w-[100%] py-8 px-6 flex flex-col justify-center items-center ss:py-10 bg-navyBlue font-karla text-blackII">
        <Image
          src="/assets/logo/logo with name png - white color.png"
          width={3912}
          height={1000}
          alt="logo"
          className="w-[180px] h-auto mb-10"
          priority
        />
        <form
          className="bg-white rounded-[15px]  w-full ss:w-[450px] h-auto p-7 ss:p-10 mb-10"
          onSubmit={handleSubmit}
        >
          <div className="mb-10">
            <legend className="text-[24px] font-bold text-darkBlue text-center font-Inter">
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
              required
            />
          </div>
          <div className="flex flex-col mb-4">
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
                className="border bg-[#EDF2F7] border-none outline-none rounded-[10px]"
                placeholder="Password"
                required
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
          <button
            type="submit"
            disabled={loading}
            className={`bg-darkBlue font-semibold text-white rounded-[10px] h-[56px] w-full items-center justify-center flex transition duration-300 ${
              loading ? "bg-navyBlue opacity-85" : "after:"
            }`}
          >
            {loading ? <div className="loaderInfinity"></div> : "LOG IN"}
          </button>
        </form>
        <div>
          <Link href="/signup" className="text-white">
            Don't have an account? Create Account
          </Link>
          <p className="text-white text-center mt-8">Forgot Password?</p>
        </div>
      </div>
    </>
  );
};

export default SignIn;
