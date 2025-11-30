"use client";

import Image from "next/image";
import { useState } from "react";
import { Poppins } from "next/font/google";
import {
  Menu,
  X,
  ArrowRight,
  ArrowRightCircle,
} from "lucide-react";
import Link from "next/link";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section
      id="home"
      className={`${poppins.className} bg-gradient-to-b px-4 sm:px-10 overflow-hidden from-[#F5F7FF] via-[#fffbee] to-[#E6EFFF] pt-6`}
    >
      {/* --- NAVBAR --- */}
      <header className="flex items-center justify-between px-6 py-3 md:py-4 shadow-sm max-w-5xl rounded-full mx-auto w-full bg-white">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/assets/logo/logo-with-name-blue.png"
            alt="NoDoseOff Logo"
            width={150}
            height={40}
          />
        </Link>

        {/* Menu */}
        <nav
          className={`${
            menuOpen ? "max-md:w-full" : "max-md:w-0"
          } max-md:absolute max-md:top-0 max-md:left-0
          max-md:overflow-hidden max-md:h-full
          transition-[width] bg-white/70 backdrop-blur
          flex items-center justify-center 
          max-md:flex-col md:flex-row gap-8 text-gray-900 text-sm font-normal`}
        >
          <Link className="hover:text-blue-600" href="#about">
            About
          </Link>
          <Link className="hover:text-blue-600" href="#tips">
            Tips
          </Link>
          <Link className="hover:text-blue-600" href="#testimonials">
            Testimonials
          </Link>
          <Link className="hover:text-blue-600" href="#team">
            Team
          </Link>

          {/* Close Button */}
          <button
            onClick={() => setMenuOpen(false)}
            className="md:hidden text-gray-600 z-999 absolute right-8 top-10"
          >
            <X className="w-7 h-7" />
          </button>
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-4">

          <Link
            className="hidden md:flex bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition"
            href="/signup"
          >
            Sign up
          </Link>

          {/* Open menu button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-gray-600"
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </header>

      {/* --- HERO CONTENT --- */}
      <main className="flex-grow flex flex-col items-center max-w-7xl mx-auto w-full">
        <Link href='#tips'>
        <button
          className="mt-16 mb-6 flex items-center space-x-2 border border-blue-600 text-blue-600 text-xs rounded-full px-4 pr-1.5 py-1.5 hover:bg-blue-50 transition"
          type="button"
        >
          <span>Explore how NoDoseOff supports medication safety.</span>

          <span className="flex items-center justify-center size-6 p-1 rounded-full bg-blue-600">
            <ArrowRight className="w-4 h-4 text-white" />
          </span>
        </button>
</Link>
        <h1 className="text-center text-gray-900 font-bold text-3xl sm:text-4xl md:text-5xl max-w-2xl leading-tight">
          Trusted medication support for
          <span className="text-blue-600"> everyday users</span>
        </h1>

        <p className="mt-4 text-center text-gray-600 max-w-md text-sm sm:text-base leading-relaxed">
          Stay consistent, stay safe. NoDoseOff helps you manage your long-term
          medications without stress.
        </p>

        <Link
          className="mt-8 bg-blue-600 text-white px-6 pr-2.5 py-2.5 rounded-full text-sm font-medium flex items-center space-x-2 hover:bg-blue-600 transition"
          href="/signup"
        >
          <span>Get Started</span>
          <ArrowRightCircle className="w-5 h-5 text-white" />
        </Link>

        {/* Hero Image */}
        <div className="relative mt-16 w-full max-w-5xl h-72 overflow-hidden rounded-[50px] rounded-b-none">
          <Image
            src="/assets/hero/newHero.jpg"
            alt="Medical professional smiling"
            fill
            className="object-cover"
          />
        </div>
      </main>
    </section>
  );
}