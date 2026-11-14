import { useEffect } from "react";
import LandingNav from "@/Layout/home/LandingNav";
import Hero from "@/Layout/home/Hero";
import Features from "@/Layout/home/Features";
import WhoItsFor from "@/Layout/home/WhoItsFor";
import Amanda from "@/Layout/home/Amanda";
import HowItWorks from "@/Layout/home/HowItWorks";
import Banner from "@/Layout/home/Banner";
import Footer from "@/Layout/home/Footer";
import SeoHead from "@/components/seo/SeoHead";
import SiteWhims from "@/components/landing/SiteWhims";
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
        title="NoDoseOff (No Dose Off) | Medication Tracking & AI"
        description="NoDoseOff (No Dose Off) helps you never miss a dose: common drug tracking, medication reminders, adherence reports, and AMANDA 6 medication AI search for cancer, autoimmune, ARV, diabetes, contraceptive, and Ozempic regimens."
        path="/"
        jsonLd
        keywords="No Dose Off app, drug tracker, pill tracker, medication search AI, ask AI about medication"
      />

      <LandingNav />
      <SiteWhims />
      <main className="relative z-[2] overflow-x-hidden bg-[#f3f7fb] font-sans text-soft-ink antialiased">
        <Hero />
        <Features />
        <Amanda />
        <WhoItsFor />
        <HowItWorks />
        <Banner />
        <Footer />
      </main>
    </LandingMotion>
  );
};

export default Home;
