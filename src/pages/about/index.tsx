import Footer from "@/Layout/shared/Footer";
import MobileNavBar from "@/Layout/shared/MobileNavBar";
import Navbar from "@/Layout/shared/Navbar";
import React, { useEffect, useState } from "react";
import { links, scrollToSection } from "../../../utils/landingpage";
import Hero from "@/Layout/about/Hero";
import Story from "@/Layout/about/Story";

const Page = () => {
  const [nav, setNav] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkScrollPosition = () => {
      if (window.scrollY !== 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", checkScrollPosition);

    return () => {
      window.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);
  const renderedLinks = links?.map((link, index) => (
    <button
      onClick={() => {
        setNav(false);
        scrollToSection(link.id);
      }}
      key={index}
    >
      {link.title}
    </button>
  ));
  return (
    <section className="text-blackBlue font-karla">
      <Navbar
        showLinks={false}
        nav={nav}
        setNav={setNav}
        isScrolled={isScrolled}
      />
      <MobileNavBar nav={nav} setNav={setNav} showLinks={false} />
      <Hero />
      <Story />
      <Footer />
    </section>
  );
};

export default Page;
