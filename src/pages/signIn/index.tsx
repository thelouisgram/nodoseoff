/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";
import Image from "next/image";
import Link from "next/link";
import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import supabase from "../../../utils/supabaseClient";
import { updateIsAuthenticated, updateUserId } from "../../../store/stateSlice";
import { useDispatch } from "react-redux";

const SignIn = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

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
      toast.loading("Signing In");
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) {
          toast.error("Error signing in: " + error.message);
        } else {
          const user = await supabase.auth.getUser();
          const userId = user.data.user?.id;
          if (userId) {
            dispatch(updateIsAuthenticated(true));
            dispatch(updateUserId(userId));
            router.push("/dashboard");
            toast.success("Signed in");
          }
        }
      } catch (error) {
        toast.error("Error signing up: " + error);
      }
    }
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
    });
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
    <div className="min-h-[100dvh] w-[100%] py-8 px-6 flex flex-col justify-center items-center ss:py-10 bg-navyBlue">
      <Image
        src="/assets/pill perfect png2.png"
        width={3912}
        height={1000}
        alt="logo"
        className="w-[200px] h-auto mb-10"
      />
      <form
        className="bg-white rounded-[15px]  w-full ss:w-[450px] h-auto p-7 ss:p-10 mb-10"
        onSubmit={handleSubmit}
      >
        <div className="mb-10">
          <legend className="text-[24px] font-bold text-darkBlue text-center">
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
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="border bg-[#EDF2F7] border-none outline-none rounded-[10px] p-4 mb-4"
            placeholder="Password"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-darkBlue text-white rounded-[10px] w-full text-center py-4  px-4 hover:bg-navyBlue transition duration-300"
        >
          SIGN IN
        </button>
      </form>
      <div>
        <Link href="/createAccount" className="text-white">
          Don't have an account? Create Account
        </Link>
        <p className="text-white text-center mt-8">Forgot Password?</p>
      </div>
    </div>
  );
};

export default SignIn;
