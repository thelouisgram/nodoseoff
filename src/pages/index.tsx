import { useEffect } from "react";
import LandingNav from "@/Layout/home/LandingNav";
import Hero from "@/Layout/home/Hero";
import Features from "@/Layout/home/Features";
import WhoItsFor from "@/Layout/home/WhoItsFor";
import Amanda from "@/Layout/home/Amanda";
import HowItWorks from "@/Layout/home/HowItWorks";
import Banner from "@/Layout/home/Banner";
import Faq, { HOME_FAQS } from "@/Layout/home/Faq";
import Footer from "@/Layout/home/Footer";
import SeoHead from "@/components/seo/SeoHead";
import SiteWhims from "@/components/landing/SiteWhims";
import { LandingMotion } from "@/components/landing/motion";
import Head from "next/head";

const Home = () => {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.style.scrollBehavior = reduce ? "auto" : "smooth";
    return () => {
      root.style.scrollBehavior = "";
    };
  }, []);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <LandingMotion>
      <SeoHead
        title="NoDoseOff | Med Reminder App + AMANDA 6 Medication AI"
        description="NoDoseOff is a free med reminder app and medication tracker with AMANDA 6 — your medication AI assistant. Set medication reminders, track doses, and ask AMANDA 6 about your regimen."
        path="/"
        jsonLd
        keywords="AMANDA 6, AMANDA 6 AI, medication AI, AI medication assistant, medication AI search, med reminder app, medication tracker, pill reminder, medication chatbot, No Dose Off"
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </Head>

      <LandingNav />
      <SiteWhims />
      <main className="relative z-[2] overflow-x-hidden bg-[#f3f7fb] font-sans text-soft-ink antialiased">
        <Hero />
        <Features />
        <Amanda />
        <WhoItsFor />
        <HowItWorks />
        <Faq />
        <Banner />
        <Footer />
      </main>
    </LandingMotion>
  );
};

export default Home;
