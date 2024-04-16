import React, { useEffect, useState } from "react";
import Hero from "@/Layout/home/Hero";
import Features from "@/Layout/home/Features";
import Tips from "@/Layout/home/Tips";
import Steps from "@/Layout/home/Steps";
import Banner from "@/Layout/home/Banner";
import Footer from "@/Layout/home/Footer";
import Navbar from "@/Layout/home/Navbar";

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
      <Navbar nav={nav} setNav={setNav} isScrolled ={isScrolled}/>
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
