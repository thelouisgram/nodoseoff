import React from 'react'
import Hero from '@/Layout/LandingPage/Hero'
import FiveWays from '@/Layout/LandingPage/FiveWays'
import Testimony from '@/Layout/LandingPage/Testimony'
import Footer from '@/Layout/LandingPage/Footer'

const Home = () => {
  return (
    <section className='text-blackBlue'>
      <Hero />
      <FiveWays />
      <Testimony />
      <Footer />
    </section>
  )
}

export default Home
