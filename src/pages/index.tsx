import React, { useEffect, useState } from "react";
import Hero from "@/Layout/home/Hero";
import Tips from "@/Layout/home/Tips";
import Banner from "@/Layout/home/Banner";
import Footer from "@/Layout/home/Footer";
import MeetTheTeam from "@/Layout/home/Team";
import Testimonials from "@/Layout/home/Testimonials";
import AboutNodoseOff from "@/Layout/home/About";

const Home = () => {
  const [nav, setNav] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);


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
      <Hero />
      <AboutNodoseOff />
      <Tips />
      <Testimonials />
      <MeetTheTeam />
      <Banner />
      <Footer />
    </section>
  );
};

export default Home;