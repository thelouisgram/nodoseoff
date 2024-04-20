import Footer from '@/Layout/shared/Footer';
import Navbar from '@/Layout/shared/Navbar';
import React, { useEffect, useState } from 'react'

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
  return (
    <section className="text-blackBlue font-karla">
      <Navbar nav={nav} setNav={setNav} isScrolled={isScrolled} />
      <Footer />
    </section>
  );
}

export default Page
