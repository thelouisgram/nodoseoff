import React from "react";
import Hero from "@/Layout/home/Hero";
import Features from "@/Layout/home/Features";
import Tips from "@/Layout/home/Tips";
import Steps from "@/Layout/home/Steps";

const Home = () => {
  return (
    <section className="text-blackBlue font-karla">
      <Hero />
      <Features />
      <Steps />
      <Tips />
    </section>
  );
};

export default Home;
