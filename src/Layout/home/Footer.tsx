import { Poppins } from "next/font/google";
import { Instagram, Github, Music2, Globe } from "lucide-react";
import Link from "next/link";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export default function Footer() {
  return (
    <footer
      className={`${poppins.className} flex flex-col bg-slate-50 items-center justify-around w-full py-16 text-sm text-navyBlue`}
    >
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8">
        {["Home", "About", "Tips", "Testimonials", "Team"].map((link) => (
          <Link
            key={link}
            href={link === "Home" ? "#home" : `#${link.toLowerCase()}`}
            className="font-medium hover:text-black transition-all"
          >
            {link}
          </Link>
        ))}
      </div>

      {/* Social Icons */}
      <div className="flex items-center gap-4 mt-8">
        {/* Instagram */}
        <Link
          href="https://instagram.com/nodoseoff"
          target="_blank"
          className="hover:-translate-y-0.5 transition-all duration-300"
        >
          <Instagram size={24} />
        </Link>

        {/* Website */}
        <Link
          href="https://thelouisgram.vercel.app"
          target="_blank"
          className="hover:-translate-y-0.5 transition-all duration-300"
        >
          <Globe size={24} />
        </Link>

        {/* GitHub */}
        <Link
          href="https://github.com/thelouisgram/nodoseoff"
          target="_blank"
          className="hover:-translate-y-0.5 transition-all duration-300"
        >
          <Github size={24} />
        </Link>
      </div>

      <p className="mt-8 text-center">
        Copyright © {new Date().getFullYear()}{" "}
        <Link href="https://nodoseoff.vercel.app" className="underline">
          Nodoseoff
        </Link>
        . All rights reserved.
      </p>
    </footer>
  );
}
