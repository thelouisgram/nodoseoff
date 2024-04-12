import React from "react";
import Hero from "@/Layout/home/Hero";
import Features from "@/Layout/home/Features";
import Tips from "@/Layout/home/Tips";

const Home = () => {
  return (
    <section className="text-blackBlue font-karla">
      <Hero />
      <Features />
      <Tips />
    </section>
  );
};

export default Home;
