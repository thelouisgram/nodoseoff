import React, { useEffect, useState } from "react";
import Hero from "@/Layout/home/Hero";
import Features from "@/Layout/home/Features";
import Tips from "@/Layout/home/Tips";
import Steps from "@/Layout/home/Steps";
import Banner from "@/Layout/home/Banner";
import Footer from "@/Layout/shared/Footer";
import Navbar from "@/Layout/shared/Navbar";
import MobileNavBar from "@/Layout/shared/MobileNavBar";
import LogoCarousel from "@/Layout/home/LogoCarousel";

const Home = () => {
  const [nav, setNav] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const logos = [
    "/assets/logo/logo with name - blue color.png",
    "/assets/logo/logo with name - blue color.png",
    "/assets/logo/logo with name - blue color.png",
    "/assets/logo/logo with name - blue color.png",
    "/assets/logo/logo with name - blue color.png",
    "/assets/logo/logo with name - blue color.png",
    "/assets/logo/logo with name - blue color.png",
    "/assets/logo/logo with name - blue color.png",
    "/assets/logo/logo with name - blue color.png",
    "/assets/logo/logo with name - blue color.png",
    "/assets/logo/logo with name - blue color.png",
    "/assets/logo/logo with name - blue color.png",
    "/assets/logo/logo with name - blue color.png",
    "/assets/logo/logo with name - blue color.png",
    "/assets/logo/logo with name - blue color.png",
    "/assets/logo/logo with name - blue color.png",
    "/assets/logo/logo with name - blue color.png",
    "/assets/logo/logo with name - blue color.png",
  ];


  useEffect(() => {
    const checkScrollPosition = () => {
      // Update scroll state
      setIsScrolled(window.scrollY !== 0);
    };

    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = "smooth";

    // Add event listener to handle scroll position
    window.addEventListener("scroll", checkScrollPosition);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  return (
    <section className="text-blackBlue font-karla overflow-hidden">
      <MobileNavBar nav={nav} setNav={setNav} showLinks={true} />
      <Navbar
        showLinks={true}
        nav={nav}
        setNav={setNav}
        isScrolled={isScrolled}
      />
      <Hero nav={nav} setNav={setNav} />
      <LogoCarousel logos={logos} />
      <Features />
      <Steps />
      <Tips />
      <Banner />
      <Footer />
    </section>
  );
};

export default Home;