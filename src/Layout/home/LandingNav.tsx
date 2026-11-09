"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#home-pulse", label: "Home" },
  { href: "#amanda", label: "AMANDA 6" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#who", label: "Who it’s for" },
  { href: "#mobile-app", label: "Mobile" },
];

export default function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-[background-color,border-color,backdrop-filter] duration-200 ${
          scrolled || menuOpen
            ? "border-b border-white/10 bg-[#031428] backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 ss:px-6 lg:h-[4.5rem]">
          <Link href="/" className="relative z-[110] shrink-0">
            <Image
              src="/assets/logo/logo-with-name-white.png"
              alt="NoDoseOff"
              width={168}
              height={40}
              priority
              className="h-8 w-auto ss:h-9"
            />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className="px-3 py-2 text-[14px] font-semibold text-white/85 transition-colors hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 bg-white px-5 py-2.5 text-[14px] font-semibold text-soft-primary transition-opacity hover:opacity-92"
            >
              Get started
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="relative z-[110] flex size-10 items-center justify-center text-white lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </header>

      {/* Full-screen sheet — sibling of header so fixed positioning stays clean */}
      {menuOpen ? (
        <div
          className="fixed inset-0 z-[90] flex flex-col bg-[#031428] pt-16 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-8 pt-6">
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-white/10 py-4 text-[1.35rem] font-semibold tracking-tight text-white transition-colors hover:text-white/80"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="border border-white/25 px-5 py-3.5 text-center text-[15px] font-semibold text-white"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="bg-white px-5 py-3.5 text-center text-[15px] font-semibold text-soft-primary"
              >
                Get started free
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
