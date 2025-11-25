"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

type Card = {
  image: string;
  name: string;
  handle: string;
  date: string;
  review?: string;
};

const cardsData: Card[] = [
  {
    image:
      "https://img.freepik.com/free-photo/portrait-african-american-man_23-2149072179.jpg?w=200",
    name: "Chukwudi Okafor",
    handle: "@chukwutech",
    date: "April 20, 2025",
    review:
      "NoDoseOff has been a game changer! I never miss my blood pressure medication anymore. The reminders are timely and reliable.",
  },
  {
    image:
      "https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg?w=200",
    name: "Amina Bello",
    handle: "@aminawrites",
    date: "May 10, 2025",
    review:
      "Managing my mother's diabetes medications was stressful until I found NoDoseOff. Now I get alerts for all her doses!",
  },
  {
    image:
      "https://img.freepik.com/free-photo/handsome-confident-smiling-man-with-hands-crossed-chest_176420-18743.jpg?w=200",
    name: "Oluwaseun Adebayo",
    handle: "@seuntalks",
    date: "June 5, 2025",
    review:
      "Perfect for tracking multiple medications! The interface is clean and the notifications actually work. Worth every naira.",
  },
  {
    image:
      "https://img.freepik.com/free-photo/confident-attractive-caucasian-guy-beige-pullon-smiling-broadly-while-standing-against-gray_176420-44508.jpg?w=200",
    name: "Emeka Nwankwo",
    handle: "@emekahealth",
    date: "July 15, 2025",
    review:
      "As someone with a busy schedule, NoDoseOff ensures I never skip my heart medication. Simple, effective, and reliable!",
  },
];

const CreateCard: React.FC<{ card: Card }> = ({ card }) => {
  return (
    <article
      role="article"
      aria-label={`Testimonial from ${card.name}`}
      className="bg-white/95 border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 w-72 shrink-0 mx-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={card.image}
            alt={card.name}
            width={44}
            height={44}
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex-1">
          <div className="flex flex-col items-start">
            <h4 className="text-sm font-medium text-slate-900">{card.name}</h4>
            <span className="text-xs text-slate-500">{card.handle}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-700 mt-3 leading-relaxed">{card.review}</p>

      <div className="flex items-center justify-between text-xs text-slate-400 mt-4">
        <span>Verified user</span>
        <span>{card.date}</span>
      </div>
    </article>
  );
};

export default function Testimonials() {
  const [mounted, setMounted] = useState(false);

  // mount on client to avoid any SSR/CSS mismatch when using animations
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Build duplicated content for seamless scrolling
  const duplicated = [...cardsData, ...cardsData];

  return (
    <section id='testimonials' className="w-full max-w-6xl mx-auto py-12 px-4">
      <header className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">
          What our users say about NoDoseOff
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto mt-2">
          Real stories from people who rely on NoDoseOff to manage their
          medications and health.
        </p>
      </header>

      <style>{`
        /* marquee animation: duplicated content scrolls left by 50% (one set length) */
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .marquee-inner {
          display: flex;
          gap: 0.5rem;
          min-width: 200%;
          animation: marqueeScroll 28s linear infinite;
          will-change: transform;
        }

        /* Slightly faster reverse row for subtle parallax */
        .marquee-inner.reverse {
          animation-direction: reverse;
          animation-duration: 32s;
        }

        /* subtle fade at edges */
        .fade-left, .fade-right {
          pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-inner { animation: none; }
          .marquee-inner.reverse { animation: none; }
        }
      `}</style>

      {/* Top row */}
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-16 z-10 fade-left"
             style={{ background: "linear-gradient(90deg, #ffffff, transparent)" }} />
        <div className="absolute right-0 top-0 h-full w-16 z-10 fade-right"
             style={{ background: "linear-gradient(270deg, #ffffff, transparent)" }} />

        <div className="marquee-inner px-6 py-6">
          {duplicated.map((card, idx) => (
            <CreateCard key={`top-${idx}`} card={card} />
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="h-6" />

      {/* Bottom row (reverse) */}
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-16 z-10 fade-left"
             style={{ background: "linear-gradient(90deg, #ffffff, transparent)" }} />
        <div className="absolute right-0 top-0 h-full w-16 z-10 fade-right"
             style={{ background: "linear-gradient(270deg, #ffffff, transparent)" }} />

        <div className="marquee-inner reverse px-6 py-6">
          {duplicated.map((card, idx) => (
            <CreateCard key={`bottom-${idx}`} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
