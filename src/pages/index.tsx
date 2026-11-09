import { useEffect } from "react";
import LandingNav from "@/Layout/home/LandingNav";
import Hero from "@/Layout/home/Hero";
import Features from "@/Layout/home/Features";
import HomePulse from "@/Layout/home/HomePulse";
import Amanda from "@/Layout/home/Amanda";
import AboutNodoseOff from "@/Layout/home/About";
import HowItWorks from "@/Layout/home/HowItWorks";
import WhoItsFor from "@/Layout/home/WhoItsFor";
import Safety from "@/Layout/home/Safety";
import MobileAppSoon from "@/Layout/home/MobileAppSoon";
import Banner from "@/Layout/home/Banner";
import Footer from "@/Layout/home/Footer";
import SeoHead from "@/components/seo/SeoHead";
import { LandingMotion } from "@/components/landing/motion";

const Home = () => {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.style.scrollBehavior = reduce ? "auto" : "smooth";
    return () => {
      root.style.scrollBehavior = "";
    };
  }, []);

  return (
    <LandingMotion>
      <SeoHead
        title="Medication Tracking & Dose Reminders"
        description="Never miss a dose. Track long-term medications, get smart reminders, ask AMANDA 6, and generate adherence reports with NoDoseOff."
        path="/"
      />
      <LandingNav />
      <main className="overflow-x-hidden bg-[#f3f7fb] font-sans text-soft-ink antialiased">
        <Hero />
        <Features />
        <HomePulse />
        <Amanda />
        <AboutNodoseOff />
        <HowItWorks />
        <WhoItsFor />
        <Safety />
        <MobileAppSoon />
        <Banner />
        <Footer />
      </main>
    </LandingMotion>
  );
};

export default Home;
