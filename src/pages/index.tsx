import React from "react";
import Hero from "@/Layout/home/Hero";
import Features from "@/Layout/home/Features";
import Tips from "@/Layout/home/Tips";
import Steps from "@/Layout/home/Steps";
import Banner from "@/Layout/home/Banner";

const Home = () => {
  return (
    <section className="text-blackBlue font-karla">
      <Hero />
      <Features />
      <Steps />
      <Tips />
      <Banner />
    </section>
  );
};

export default Home;
