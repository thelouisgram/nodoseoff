import React, { useEffect, useState } from "react";
import Hero from "@/Layout/home/Hero";
import Features from "@/Layout/home/Features";
import Tips from "@/Layout/home/Tips";
import Steps from "@/Layout/home/Steps";
import Banner from "@/Layout/home/Banner";
import Footer from "@/Layout/shared/Footer";
import Navbar from "@/Layout/shared/Navbar";
import MobileNavBar from "@/Layout/shared/MobileNavBar";

const Home = () => {
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

  return (
    <section className="text-blackBlue font-karla">
      <MobileNavBar nav={nav} setNav={setNav} showLinks={true} />
      <Navbar
        showLinks={true}
        nav={nav}
        setNav={setNav}
        isScrolled={isScrolled}
      />
      <Hero nav={nav} setNav={setNav} />
      <Features />
      <Steps />
      <Tips />
      <Banner />
      <Footer />
    </section>
  );
};

export default Home;
