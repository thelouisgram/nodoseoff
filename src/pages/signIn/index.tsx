/* eslint-disable react/no-unescaped-entities */
"use client";
import Image from "next/image";
import Link from "next/link";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import supabase from "../../../utils/supabaseClient";

const SignIn = () => {
  const router = useRouter();
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
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          toast.error("Error signing in: " + error.message);
        } else {
          router.push("/dashboard");
          toast.success("Signed in");
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
        className="bg-white rounded-[15px] rounded-bl-none w-full ss:w-[450px] h-auto p-7 ss:p-10 mb-10"
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
            className="border bg-[#EDF2F7] border-none outline-none rounded-md p-4 mb-4"
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
            className="border bg-[#EDF2F7] border-none outline-none rounded-md p-4 mb-4"
            placeholder="Password"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-darkBlue text-white rounded-[10px] w-full text-center py-4 rounded-bl-none px-4 hover:bg-navyBlue transition duration-300"
        >
          CREATE AN ACCOUNT
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
