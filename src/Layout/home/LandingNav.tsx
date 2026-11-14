"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ndoEase } from "@/components/landing/motion";
import InteractiveLogo from "@/components/ui/InteractiveLogo";
import { landingNavLinks } from "@/utils/landing-nav";

type Props = {
  /** overlay = home hero; solid = always navy bar (inner pages) */
  tone?: "overlay" | "solid";
};

export default function LandingNav({ tone = "overlay" }: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(tone === "solid");

  useEffect(() => {
    if (tone === "solid") {
      setScrolled(true);
      return;
    }
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
  }, [tone]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const solidBar = tone === "solid" || scrolled || menuOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-[background-color,border-color,backdrop-filter] duration-200 ${
          solidBar
            ? "border-b border-white/10 bg-[#031428] backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 ss:px-6 lg:h-[4.5rem]">
          <div className="relative z-[110] shrink-0">
            <InteractiveLogo variant="white" priority />
          </div>

          <nav className="hidden items-center gap-7 lg:flex">
            {landingNavLinks.map((link) => {
              const active = router.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`ndo-nav-link text-[14px] font-medium ${
                    active
                      ? "text-white"
                      : "text-white/80 hover:text-white"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className="ndo-press px-3 py-2 text-[14px] font-semibold text-white/85 hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="ndo-cta ndo-cta-solid group inline-flex items-center gap-1.5 px-5 py-2.5 text-[14px] font-semibold"
            >
              Get started
              <ArrowRight className="ndo-arrow size-4" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="ndo-press relative z-[110] flex size-10 items-center justify-center text-white lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: ndoEase }}
            className="fixed inset-0 z-[90] flex flex-col bg-[#031428] pt-16 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: ndoEase, delay: 0.04 }}
              className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-8 pt-6"
            >
              <nav className="flex flex-col">
                {landingNavLinks.map((link, index) => {
                  const active = router.pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.28,
                        ease: ndoEase,
                        delay: 0.05 + index * 0.04,
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className={`block border-b border-white/10 py-4 text-[1.35rem] font-semibold tracking-tight transition-colors ${
                          active
                            ? "text-white"
                            : "text-white/90 hover:text-white/80"
                        }`}
                        aria-current={active ? "page" : undefined}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="ndo-press rounded-xl border border-white/25 px-5 py-3.5 text-center text-[15px] font-semibold text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="ndo-cta ndo-cta-solid group inline-flex items-center justify-center gap-1.5 px-5 py-3.5 text-center text-[15px] font-semibold"
                >
                  Get started free
                  <ArrowRight className="ndo-arrow size-4" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
